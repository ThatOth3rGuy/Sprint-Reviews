// pages/student/course-dashboard.tsx
/**
* Renders the course dashboard page for students.This function renders: 
the assignments an instructor has created the student needs to submit. This page also allows the student to filter what type of assignments they want to display. The folllowing assignment types are displayed: assignments to submit for peer reviews (Assignments), group assignments (Group Assignments), and assignments to review (Peer Reviews). 

 @return {JSX.Element} The rendered course dashboard.
*/

// Importing necessary libraries and components
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import styles from '../../styles/instructor-course-dashboard.module.css';
import { Breadcrumbs, BreadcrumbItem, Divider, Checkbox, CheckboxGroup, Spinner } from "@nextui-org/react";
import StudentNavbar from "../components/student-components/student-navbar";
import StudentAssignmentCard from "../components/student-components/student-course-assignment-card";
import StudentReviewCard from "../components/student-components/student-peer-review-card";

/** Defining interfaces for CourseData, Assignment, and Peer Review **/
interface CourseData {
  courseID: string;
  courseName: string;
}

interface Assignment {
  assignmentID: number;
  title: string;
  descr: string;
  deadline: string;
  groupAssignment: boolean;
}

interface PeerReview {
  linkedAssignmentID: number;
  reviewID: number;
  assignmentID: number;
  title: string;
  deadline: string;
  courseID: number;
  courseName: string;
}

export default function Page() {
  // Initializing state variables
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [selectedAssignmentTypes, setSelectedAssignmentTypes] = useState<string[]>(['all']);

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [peerReviews, setPeerReviews] = useState<PeerReview[]>([]);
  const [peerReviewAssignments, setPeerReviewAssignments] = useState<Assignment[]>([]);

  // Checking user session
  useSessionValidation('student', setLoading, setSession);

// Fetching data when the router is ready
  const router = useRouter();
  const { courseId } = router.query;

  useEffect(() => {
    if (session && session.user && session.user.userID) {
      fetchAssignments(session.user.userID); //fetches assignments for a student by their userID
    }
    if (courseId) {
      fetchPeerReviews(courseId);// fetches peer reviews for a student by the courseID
      fetch(`/api/courses/${courseId}`)
        .then((response) => response.json())
        .then((data: CourseData) => {
          console.log("Fetched course data:", data);
          setCourseData(data);
        })
        .catch((error) => console.error('Error fetching course data:', error));
      fetchAssignments(courseId); //fetches assignments in a course
    }
  }, [courseId]);

  //filters assignments by types
  const handleCheckboxChange = (type: string, isChecked: boolean) => {
    if (type === 'all') {
      setSelectedAssignmentTypes(['all']);
    } else {
      setSelectedAssignmentTypes(prevTypes => {
        if (isChecked) {
          return [...prevTypes.filter(t => t !== 'all'), type];
        } else {
          const newTypes = prevTypes.filter(t => t !== type);
          return newTypes.length > 0 ? newTypes : ['all'];
        }
      });
    }
  };

  //redirects the user to home
  const handleHomeClick = async () => {
    router.push("/student/dashboard");
  };

  //function to fetch assignments via getAssignments4CoursesInstructor.ts 
  const fetchAssignments = async (courseID: string | string[]) => {
    try {
      const response = await fetch(`/api/assignments/getAssignments4CoursesInstructor?courseID=${courseID}`);
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.courses); // Make sure this is the correct property
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  //fetches peer reivews via getReviewsByCourseId.ts api
  const fetchPeerReviews = async (courseID: string | string[]) => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(
        `/api/reviews/getReviewsByCourseId?courseID=${courseId}&role=student&t=${timestamp}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched peer review assignments:", data);
        setPeerReviews(data.reviews || []);
      } else {
        console.error("Failed to fetch peer review assignments");
      }
    } catch (error) {
      console.error("Error fetching peer review assignments:", error);
    }
  };

  //wait for the page to load with the correct data
  if (!courseData || loading) {
    return <div className='w-[100vh=w] h-[100vh] student flex justify-center text-center items-center my-auto'>
      <Spinner color='primary' size="lg" />
    </div>;
  }

  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return null;
  }

  //define assignment type for filter
  const individualAssignments = assignments.filter(assignment => !assignment.groupAssignment && !assignment.title.toLowerCase().includes('peer review'));
  const groupAssignments = assignments.filter(assignment => assignment.groupAssignment);
  const peerReviewCards = assignments.filter(assignment => assignment.title.toLowerCase().includes('peer review'));
  //render assignment based on selected type
  const shouldRenderAssignments = (type: string) => {
    return selectedAssignmentTypes.includes('all') || selectedAssignmentTypes.includes(type);
  };

  return (
    <>
      <StudentNavbar />
      <div className={`student text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>{courseData.courseName}</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem>{courseData.courseName}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.mainContent}>
          <div className={`flex-col bg-white p-[1%] w-[86%] m-[.8%] ml-auto h-[100%] overflow-auto`}>
            <CheckboxGroup
              label="Select assignment type:"
              orientation="horizontal"
              color="primary"
              size="sm"
              className="text-left flex-row mb-2 text-primary-900"
              value={selectedAssignmentTypes}
            >
              <Checkbox 
                value="all" 
                onChange={(e) => handleCheckboxChange('all', e.target.checked)}
                isSelected={selectedAssignmentTypes.includes('all')}
              >
                All Assignments
              </Checkbox>
              <Checkbox 
                value="individual" 
                onChange={(e) => handleCheckboxChange('individual', e.target.checked)}
                isSelected={selectedAssignmentTypes.includes('individual')}
              >
                Individual Assignments
              </Checkbox>
              <Checkbox 
                value="group" 
                onChange={(e) => handleCheckboxChange('group', e.target.checked)}
                isSelected={selectedAssignmentTypes.includes('group')}
              >
                Group Assignments
              </Checkbox>
              <Checkbox 
                value="peerReviews" 
                onChange={(e) => handleCheckboxChange('peerReviews', e.target.checked)}
                isSelected={selectedAssignmentTypes.includes('peerReviews')}
              >
                Peer Reviews
              </Checkbox>
            </CheckboxGroup>

            {shouldRenderAssignments('individual') && (
              <>
                <h3 className={styles.innerTitle}>Individual Assignments</h3>
                <br />
                <Divider className="student bg-secondary" />
                <br />
                <div className={styles.courseCard}>
                  {individualAssignments.length > 0 ? (
                    individualAssignments.map((assignment) => (
                      <div key={assignment.assignmentID} className={styles.courseCard}>
                        <StudentAssignmentCard
                          courseID={assignment.assignmentID}
                          assignmentName={assignment.title}
                          color="#b3d0c3"
                          deadline={new Date(assignment.deadline).toLocaleString()}
                          groupAssignment={assignment.groupAssignment}
                        />
                      </div>
                    ))
                  ) : (
                    <p>No individual assignments found for this course.</p>
                  )}
                </div>
              </>
            )}

            {shouldRenderAssignments('group') && (
              <>
                <h3 className={styles.innerTitle}>Group Assignments</h3>
                <br />
                <Divider className="student bg-secondary" />
                <br />
                <div className={styles.courseCard}>
                  {groupAssignments.length > 0 ? (
                    groupAssignments.map((assignment) => (
                      <div key={assignment.assignmentID} className={styles.courseCard}>
                        <StudentAssignmentCard
                          courseID={assignment.assignmentID}
                          assignmentName={assignment.title}
                          color="#b3d0c3"
                          deadline={new Date(assignment.deadline).toLocaleString()}
                          groupAssignment={assignment.groupAssignment}
                        />
                      </div>
                    ))
                  ) : (
                    <p>No group assignments found for this course.</p>
                  )}
                </div>
              </>
            )}

            {shouldRenderAssignments('peerReviews') && (
              <>
                <h3 className={styles.innerTitle}>Peer Reviews</h3>
                <br />
                <Divider className="student bg-secondary" />
                <br />
                <div className={styles.courseCard}>
                  {peerReviews.length > 0 ? (
                  peerReviews.map((review) => (
                    <div key={review.reviewID} className={styles.courseCard}>
                      <StudentReviewCard
                        courseID={review.linkedAssignmentID}
                        courseName={`Review for Assignment - ${review.title}`|| `Review for Assignment ${review.linkedAssignmentID}`}
                        color="#b3d0c3"
                        deadline={new Date(review.deadline).toLocaleString()}
                      />
                    </div>
                    ))
                  ) : (
                    <p>No peer reviews found for this course.</p>
                  )}
                </div>
              </>
            )}

          </div>
          
        </div>
      </div>
    </>
  );
}
