import { useRouter } from "next/router";
import styles from '../../styles/instructor-course-dashboard.module.css';
import { Breadcrumbs, BreadcrumbItem, Divider, Checkbox, CheckboxGroup, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import StudentNavbar from "../components/student-components/student-navbar";
import StudentAssignmentCard from "../components/student-components/student-assignment-card";

interface Assignment {
  assignmentID: number;
  title: string;
  descr: string;
  deadline: string;
  groupAssignment: boolean;
  courseName: string;
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
  }

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

  if (loading) {
    return (
      <div className='w-[100vh=w] h-[100vh] student flex justify-center text-center items-center my-auto'>
        <Spinner color='primary' size="lg" />
      </div>
    );
  }

  const handleHomeClick = async () => {
    router.push('/instructor/dashboard');
  }

  const individualAssignments = assignments.filter(assignment => !assignment.groupAssignment && !assignment.title.toLowerCase().includes('peer review'));
  const groupAssignments = assignments.filter(assignment => assignment.groupAssignment);
  const peerReviews = assignments.filter(assignment => assignment.title.toLowerCase().includes('peer review'));

  return (
    <>
      <StudentNavbar />
      <div className={`instructor text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>All Assignments</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem>Assignments</BreadcrumbItem>
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

            {selectedAssignmentType === 'all' || selectedAssignmentType === 'individual' ? (
              <>
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
                          courseName={assignment.courseName}
                          deadline={assignment.deadline}
                          color="#b3d0c3"
                          groupAssignment={assignment.groupAssignment}
                        />
                      </div>
                    ))
                  ) : (
                    <p>No individual assignments found.</p>
                  )}
                </div>
              </>
            ) : null}

            {selectedAssignmentType === 'all' || selectedAssignmentType === 'group' ? (
              <>
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
                          courseName={assignment.courseName}
                          deadline={assignment.deadline}
                          color="#b3d0c3"
                          groupAssignment={assignment.groupAssignment}
                        />
                      </div>
                    ))
                  ) : (
                    <p>No group assignments found.</p>
                  )}
                </div>
              </>
            ) : null}

            {selectedAssignmentType === 'all' || selectedAssignmentType === 'peerReviews' ? (
              <>
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
                          courseName={assignment.courseName}
                          deadline={assignment.deadline}
                          color="#72a98f"
                          groupAssignment={false}
                        />
                      </div>
                    ))
                  ) : (
                    <p>No peer reviews found.</p>
                  )}
                </div>
              </>
            ) : null}
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
