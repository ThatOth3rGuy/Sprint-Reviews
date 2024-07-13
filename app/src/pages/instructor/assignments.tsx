// assignments.tsx
import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import styles from '../../styles/instructor-assignments-creation.module.css';
import { useSessionValidation } from '../api/auth/checkSession';


const Assignments: NextPage = () => {
  const [assignments, setAssignments] = useState([]); // State variable for the list of assignments

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('instructor', setLoading, setSession);

  useEffect(() => {
    // Fetch the assignments when the component mounts
    fetch('/api/assignments/getAssignments')
      .then(response => response.json())
      .then(setAssignments);
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  // If the session exists, check if the user is an admin
  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return;
  }
  const isAdmin = session.user.role === 'admin';

  return (
    <>
      <br />
      <br />
      <br />
      {isAdmin ? (
        <>
          <AdminHeader title="Assignments"
          addLink={[{href: "./create-assignment", title: "Create Assignment"}, {href: "#", title: "Release Assignment"}]}/>
          <AdminNavbar />
        </>
      ) : (
        <>
          <InstructorHeader title="Assignments"
          addLink={[{href: "./create-assignment", title: "Create Assignment"}, {href: "#", title: "Release Assignment"}]}/>
          <InstructorNavbar />
        </>
      )}
      <div className={styles.container}>
        {assignments.map(({ assignmentID, title, description, deadline }) => (
          <div key={assignmentID} className={styles.card}>
            <h2>{title}</h2>
            <p>{description}</p>
            <p>Due date: {new Date(deadline).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Assignments;
