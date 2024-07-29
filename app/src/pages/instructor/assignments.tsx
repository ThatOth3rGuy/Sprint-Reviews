import { useRouter } from "next/router";
import InstructorAssignmentCard from "../components/instructor-components/instructor-assignment-card";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import styles from '../../styles/instructor-course-dashboard.module.css';
import { Button, Breadcrumbs, BreadcrumbItem, Listbox, ListboxItem, Divider, Checkbox, CheckboxGroup, Progress } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import AdminNavbar from "../components/admin-components/admin-navbar";

interface Assignment {
  assignmentID: number;
  title: string;
  description: string;
  deadline: string;
  courseName: string;
}

export default function AssignmentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [session, setSession] = useState<any>(null);

  useSessionValidation('instructor', setLoading, setSession);
  useEffect(() => {
    if (session && session.user && session.user.userID) {
      fetchAssignments(session.user.userID);
    }
  }, [session]);
  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return null;
  }
  const isAdmin = session.user.role === 'admin';
  const dummyassignments: Assignment[] = [
    {
      assignmentID: 1, title: "Assignment 1", description: "Description 1", deadline: "2024-07-20",
      courseName: ""
    },
    {
      assignmentID: 2, title: "Assignment 2", description: "Description 2", deadline: "2024-07-25",
      courseName: ""
    },
  ];
  

  const fetchAssignments = async (userID: string) => {
    try {
      const response = await fetch(`/api/getAllAssignmentsInstructor?userID=${userID}`);
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

  const handleCreateAssignmentClick = () => {
    router.push({
      pathname: '/instructor/create-assignment',
      query: { source: 'assignments' } //sends courseID to create assignment if clicked from assignment dashboard
    });
  };

  const handleCreatePeerReviewAssignmentClick = () => {
    router.push({
      pathname: '/instructor/release-assignment',
      query: { source: 'assignments' } //sends courseID to release assignment if clicked from assignment dashboard
    });
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

  const handleBackClick = () => {router.back()}



  return (
    <>
      {isAdmin ? <AdminNavbar  assignments={{className: "bg-primary-500"}}/> : <InstructorNavbar assignments={{className: "bg-primary-500"}} />}
      <div className={`instructor text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>Assignments</h1>
          <Breadcrumbs>
            <BreadcrumbItem onClick={() => router.push("/instructor/dashboard")}>Home</BreadcrumbItem>
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
              className="text-left flex-row mb-2 text-primary-900 "
            >
              <Checkbox value="assignments">All Assignments</Checkbox>
              <Checkbox value="peerReviews">Peer Reviews</Checkbox>
            </CheckboxGroup>
            <h3 className={styles.innerTitle}>Assignments Created</h3>
            <Divider className="instructor bg-secondary" />
            <div className={styles.courseCard}>
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <div
                    key={assignment.assignmentID}
                    className={styles.courseCard}
                  >
                    <InstructorAssignmentCard 
                      courseID={assignment.assignmentID}
                      courseName={assignment.courseName}
                      assignmentName={assignment.title}
                      color="#9fc3cf"
                      deadline={assignment.deadline}
                    />
                  </div>
                ))
              ) : (
                <p>No assignments found for this course.</p>
              )}
            </div>
          </div>
          <div className={styles.notificationsSection}>
           <h2>Notifications</h2>
          </div>
          
        </div>
      </div>
    </>
  );
}


