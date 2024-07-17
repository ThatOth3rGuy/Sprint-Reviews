// course-dashboard.tsx
import { useRouter } from "next/router";
import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import styles from '../../styles/instructor-course-dashboard.module.css';
import InstructorAssignmentCard from "../components/instructor-components/instructor-assignment-card";
import { Button, Breadcrumbs, BreadcrumbItem, Listbox, ListboxItem, Divider, Checkbox, CheckboxGroup, Progress } from "@nextui-org/react";
interface CourseData {
  courseID: string;
  courseName: string;
}

interface Assignment {
  assignmentID: number;
  title: string;
  description: string;
  deadline: string;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  const router = useRouter();
  const { courseId } = router.query;

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useSessionValidation('instructor', setLoading, setSession);

  useEffect(() => {
    if (session && session.user && session.user.userID) {
      fetchAssignments(session.user.userID);
    }
    if (courseId) {
      fetchAssignments(courseId);
      fetch(`/api/courses/${courseId}`)
        .then((response) => response.json())
        .then((data: CourseData) => {
          console.log("Fetched course data:", data);
          setCourseData(data);
        })
        .catch((error) => console.error('Error fetching course data:', error));


    }
  }, [courseId]);
  const handleHomeClick = async () => {
    router.push("/instructor/dashboard")
  }
  const fetchAssignments = async (courseID: string | string[]) => {
    try {
      const response = await fetch(`/api/getAssignments?courseID=${courseID}`);
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
    return <div className="instructor"><Progress
    size="sm"
    isIndeterminate
    aria-label="Loading..."
    color="secondary"
  /></div>;;
  }

  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return null;
  }
  const isAdmin = session.user.role === 'admin';

  const handleBackClick = async () => {
    router.push('/instructor/dashboard');
  }

  const handleCreateAssignmentClick = () => {
    router.push('/instructor/create-assignment');
  };
  const handleCreatePeerReviewAssignmentClick = () => {
    router.push('/instructor/release-assignment');
  };
  const handleCreateGroupPeerReviewAssignmentClick = () => {
    router.push('/instructor/create-assignment');
  };
  const handleAction = (key: any) => {
    switch (key) {
      case "create":
        handleCreateAssignmentClick();
        break;
      case "peer-review":
        handleCreatePeerReviewAssignmentClick();
        break;
      case "group-review":
        handleCreateGroupPeerReviewAssignmentClick();
        break;
      case "delete":
        // Implement delete course functionality
        console.log("Delete course");
        break;
      default:
        console.log("Unknown action:", key);
    }
  };
  return (
    <>
      {isAdmin ? <AdminNavbar /> : <InstructorNavbar />}
      <div className={`instructor text-primary-900 ${styles.container}`}>
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
            <h3 className={styles.innerTitle}>Assignments Created</h3>
            <br /> <Divider className="instructor bg-secondary" /> <br />
            <div className={styles.courseCard}>
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <div key={assignment.assignmentID} className={styles.courseCard}>
                    <InstructorAssignmentCard
                      courseID={assignment.assignmentID}
                      courseName={assignment.title}
                      color="#72a98f"
                    />
                  </div>
                ))
              ) : (
                <p>No assignments found for this course.</p>
              )}
            </div><h3 className={styles.innerTitle}>Peer Reviews Created</h3>
            <br /><Divider className="instructor bg-secondary" /><br />
            <div className={styles.courseCard}>
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <div key={assignment.assignmentID} className={styles.courseCard}>
                    <InstructorAssignmentCard
                      courseID={45}
                      courseName="Peer review Assignment"
                      color="#72a98f"
                    />
                  </div>
                ))
              ) : (
                <p>No assignments found for this course.</p>
              )}
            </div>
          </div>

          <div className={styles.notificationsSection}>
            <div className={styles.actionButtons}>
              <Listbox aria-label="Actions" onAction={handleAction}>
                <ListboxItem key="create">Create Assignment</ListboxItem>
                <ListboxItem key="peer-review">Create Peer Review</ListboxItem>
                <ListboxItem key="group-review">Create Group Peer Review</ListboxItem>
                <ListboxItem key="delete" className="text-danger" color="danger">
                  Archive Course
                </ListboxItem>
              </Listbox>
            </div>
            <hr />
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