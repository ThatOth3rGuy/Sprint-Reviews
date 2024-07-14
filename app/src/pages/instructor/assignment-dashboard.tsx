import { useRouter } from "next/router";
import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import styles from '../../styles/instructor-dashboard.module.css';

interface Assignment {
  assignmentID: number;
  title: string; 
}

export default function AssignmentDashboard() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const { assignmentID } = router.query;

  const [assignment, setAssignment] = useState<Assignment | null>(null);

  useSessionValidation('instructor', setLoading, setSession);

  useEffect(() => {
    if (assignmentID) {
      fetch(`/api/assignments/${assignmentID}`)
        .then((response) => response.json())
        .then((data: Assignment) => {
          console.log("Fetched assignment data:", data);
          setAssignment(data);
        })
        .catch((error) => console.error('Error fetching assignment data:', error));
    }
  }, [assignmentID]);

  if (!assignment || loading) {
    return <div>Loading...</div>;
  }

  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return null;
  }

  const isAdmin = session.user.role === 'admin';

  return (
    <>
      <br />
      <br />
      <br />
      {isAdmin ? (
        <>
          <AdminHeader title={assignment.title} />
          <AdminNavbar />
        </>
      ) : (
        <>
          <InstructorHeader title={assignment.title} />
          <InstructorNavbar />
        </>
      )}
      <div className={styles.courseCards}>
        <h2>{assignment.title}</h2>
        <h2>{assignment.title}</h2>      
        
      </div>
    </>
  );
}