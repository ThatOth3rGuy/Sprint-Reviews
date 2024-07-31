// course-dashboard.tsx
import { useRouter } from "next/router";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import styles from '../../styles/instructor-course-dashboard.module.css';
import InstructorAssignmentCard from "../components/instructor-components/instructor-assignment-card";
import { Button, Breadcrumbs, BreadcrumbItem, Listbox, ListboxItem, Divider, Checkbox, CheckboxGroup, Progress, Spinner } from "@nextui-org/react";
import StudentNavbar from "../components/student-components/student-navbar";
import StudentAssignmentCard from "../components/student-components/student-assignment-card";
import StudentReviewCard from "../components/student-components/student-peer-review-card";
interface CourseData {
  courseID: string;
  courseName: string;
}

interface Assignment {
  assignmentID: number;
  title: string;
  description: string;
  deadline: string;
  rubric: string;
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
  const [loading, setLoading] = useState(true);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  const router = useRouter();
  const { courseId } = router.query;

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [peerReviews, setPeerReviews] = useState<PeerReview[]>([]);
  const [peerReviewAssignments, setPeerReviewAssignments] = useState<Assignment[]>([]);
  useSessionValidation('student', setLoading, setSession);

  useEffect(() => {
    if (session && session.user && session.user.userID) {
      fetchAssignments(session.user.userID);
      
    }
    if (courseId) {
      fetchPeerReviews(courseId);
      fetch(`/api/courses/${courseId}`)
        .then((response) => response.json())
        .then((data: CourseData) => {
          console.log("Fetched course data:", data);
          setCourseData(data);
        })
        .catch((error) => console.error('Error fetching course data:', error));

        fetchAssignments(courseId);
    }
  }, [courseId]);
  const handleHomeClick = async () => {
    router.push("/student/dashboard")
  }
  /**
   * Fetches assignments based on the provided course ID.
   * @param {string | string[]} courseID - The ID of the course to fetch assignments for.
   */
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

  if (!courseData || loading) {
    return <div className='w-[100vh=w] h-[100vh] student flex justify-center text-center items-center my-auto'>
    <Spinner color='primary' size="lg" />
</div>;
  }

  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return null;
  }

  /**
   * Renders the instructor course dashboard page.
   * @returns {JSX.Element} The instructor course dashboard page.
   */
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
          <div className={styles.assignmentsSection}>
            <CheckboxGroup
              label="Select assignment type:"
              orientation="horizontal"
              color="primary"
              size="sm"
              className="text-left flex-row mb-2 text-primary-900 "
            >
              <Checkbox value="assignments">All Assignments</Checkbox>
              <Checkbox value="peerReviews">Peer Reviews</Checkbox>
              <Checkbox value="peerReviews">Peer Evaluations</Checkbox>
            </CheckboxGroup>
            <h3 className={styles.innerTitle}>Assignments</h3>
            <br /> <Divider className="student bg-secondary" /> <br />
            <div className={styles.courseCard}>
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <div key={assignment.assignmentID} className={styles.courseCard}>
                    <StudentAssignmentCard
                      courseID={assignment.assignmentID}
                      courseName={assignment.title}
                      color="#b3d0c3"
                      dueDate={new Date(assignment.deadline).toLocaleString()}
                    />
                  </div>
                ))
              ) : (
                <p>No assignments found for this course.</p>
              )}
            </div><h3 className={styles.innerTitle}>Peer Reviews</h3>
            <br /><Divider className="student bg-secondary" /><br />
            <div className={styles.courseCard}>
            {peerReviews.length > 0 ? (
  peerReviews.map((review) => (
    <div key={review.reviewID} className={styles.courseCard}>
      <StudentReviewCard
        courseID={review.linkedAssignmentID}
        courseName={`Review for Assignment - ${review.title}`|| `Review for Assignment ${review.linkedAssignmentID}`}
        color="#b3d0c3"
        dueDate={new Date(review.deadline).toLocaleString()}
      />
    </div>
  ))
) : (
  <p>No peer reviews assigned for this course.</p>
)}
          </div>
          </div>
          <div className={styles.notificationsSection}>
          <h2 className="my-3">Notifications</h2>
          <div className={styles.notificationsContainer}>
              <div className={styles.notificationCard}>Dummy Notification</div>
            </div>
            </div>          
        </div>
      </div>
    </>
  );
}