import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import styles from '../../styles/instructor-course-dashboard.module.css';
import { Breadcrumbs, BreadcrumbItem, Divider, Checkbox, CheckboxGroup, Spinner } from "@nextui-org/react";
import StudentNavbar from "../components/student-components/student-navbar";
import StudentAssignmentCard from "../components/student-components/student-course-assignment-card";

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

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  const router = useRouter();
  const { courseId } = router.query;

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useSessionValidation('student', setLoading, setSession);

  useEffect(() => {
    if (courseId) {
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
    router.push("/student/dashboard");
  };

  const fetchAssignments = async (courseID: string | string[]) => {
    try {
      const response = await fetch(`/api/assignments/getAssignments4CoursesInstructor?courseID=${courseID}`);
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.courses);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
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

  const individualAssignments = assignments.filter(assignment => !assignment.groupAssignment);
  const groupAssignments = assignments.filter(assignment => assignment.groupAssignment);
  const peerReviews = assignments.filter(assignment => assignment.title.toLowerCase().includes('peer review'));

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
              className="text-left flex-row mb-2 text-primary-900"
            >
              <Checkbox value="all">All Assignments</Checkbox>
              <Checkbox value="individual">Individual Assignments</Checkbox>
              <Checkbox value="group">Group Assignments</Checkbox>
              <Checkbox value="peerReviews">Peer Reviews</Checkbox>
            </CheckboxGroup>

            <h3 className={styles.innerTitle}>Individual Assignments</h3>
            <br />
            <Divider className="instructor bg-secondary" />
            <br />
            <div className={styles.courseCard}>
              {individualAssignments.length > 0 ? (
                individualAssignments.map((assignment) => (
                  <div key={assignment.assignmentID} className={styles.courseCard}>
                    <StudentAssignmentCard
                      courseID={assignment.assignmentID}
                      assignmentName={assignment.title}
                      color="#b3d0c3"
                      deadline={assignment.deadline}
                      groupAssignment={assignment.groupAssignment}
                    />
                  </div>
                ))
              ) : (
                <p>No individual assignments found for this course.</p>
              )}
            </div>

            <h3 className={styles.innerTitle}>Group Assignments</h3>
            <br />
            <Divider className="instructor bg-secondary" />
            <br />
            <div className={styles.courseCard}>
              {groupAssignments.length > 0 ? (
                groupAssignments.map((assignment) => (
                  <div key={assignment.assignmentID} className={styles.courseCard}>
                    <StudentAssignmentCard
                      courseID={assignment.assignmentID}
                      assignmentName={assignment.title}
                      color="#b3d0c3"
                      deadline={assignment.deadline}
                      groupAssignment={assignment.groupAssignment}
                    />
                  </div>
                ))
              ) : (
                <p>No group assignments found for this course.</p>
              )}
            </div>

            <h3 className={styles.innerTitle}>Peer Reviews</h3>
            <br />
            <Divider className="instructor bg-secondary" />
            <br />
            <div className={styles.courseCard}>
              {peerReviews.length > 0 ? (
                peerReviews.map((assignment) => (
                  <div key={assignment.assignmentID} className={styles.courseCard}>
                    <StudentAssignmentCard
                      courseID={assignment.assignmentID}
                      assignmentName={assignment.title}
                      color="#b3d0c3"
                      deadline={assignment.deadline}
                      groupAssignment={false} // Assuming peer reviews are not group assignments
                    />
                  </div>
                ))
              ) : (
                <p>No peer reviews found for this course.</p>
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
