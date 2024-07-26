import { useRouter } from "next/router";
import styles from '../../styles/instructor-course-dashboard.module.css';
import { Button, Breadcrumbs, BreadcrumbItem, Listbox, ListboxItem, Divider, Checkbox, CheckboxGroup, Progress, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import StudentNavbar from "../components/student-components/student-navbar";
import StudentAssignmentCard from "../components/student-components/student-assignment-card";

interface Assignment {
  assignmentID: number;
  title: string;
  description: string;
  deadline: string;
}

export default function AssignmentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [session, setSession] = useState<any>(null);
  const [selectedAssignmentType, setSelectedAssignmentType] = useState('all');
  useSessionValidation('student', setLoading, setSession);
  useEffect(() => {
    if (session && session.user && session.user.userID) {
      fetchAssignments(session.user.userID);
    }
  }, [session]);

  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return null;
  };

  const fetchAssignments = async (userID: string) => {
    try {
      const response = await fetch(`/api/getAllAssignmentsStudent?userID=${userID}`);
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.assignments);
      } else {
        console.error('Failed to fetch assignments');
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };
  const handleCheckboxChange = (value: string) => {
    setSelectedAssignmentType(value);
  };
  const handleCreateAssignmentClick = () => {
    router.push('/instructor/create-assignment');
  };

  const handleCreatePeerReviewAssignmentClick = () => {
    router.push('/instructor/release-assignment');
  };

  const handleAction = (key: any) => {
    switch (key) {
      case "create":
        handleCreateAssignmentClick();
        break;
      case "peer-review":
        handleCreatePeerReviewAssignmentClick();
        break;
      default:
        console.log("Unknown action:", key);
    }
  };
  
if (loading) {
    return <div className='w-[100vh=w] h-[100vh] student flex justify-center text-center items-center my-auto'>
                <Spinner color='primary' size="lg" />
            </div>;
  }
  const handleHomeClick = async () => {
    router.push('/instructor/dashboard');
  }

  return (
    <>
      <StudentNavbar />
      <div className={`instructor text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>All Assignments</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem> Home</BreadcrumbItem>
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
            <br /> <Divider className="instructor bg-secondary" /> <br />
            <div className={styles.courseCard}>
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <div key={assignment.assignmentID} className={styles.courseCard}>
                    <StudentAssignmentCard
                      courseID={assignment.assignmentID}
                      courseName={assignment.title}
                      dueDate={assignment.deadline}
                      color="#b3d0c3"
                    />
                  </div>
                ))
              ) : (
                <p>No assignments available.</p>
              )}
            </div><h3 className={styles.innerTitle}>Peer Reviews Created</h3>
            <br /><Divider className="instructor bg-secondary" /><br />
            <div className={styles.courseCard}>
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <div key={assignment.assignmentID} className={styles.courseCard}>
                    <StudentAssignmentCard
                      courseID={45}
                      courseName="Peer review Assignment"
                      color="#72a98f" 
                      dueDate={""}                    />
                  </div>
                ))
              ) : (
                <p>No peer reviews available.</p>
              )}
            </div>
          </div>

          <div className={styles.notificationsSection}>            
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


