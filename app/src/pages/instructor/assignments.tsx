// assignments.tsx
import InstructorHeader from "../home/instructor-components/instructor-header";
import InstructorNavbar from "../home/instructor-components/instructor-navbar";
import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import styles from '../../styles/instructor-assignments-creation.module.css';
import { useState } from 'react';
import { useSessionValidation } from '../api/auth/checkSession';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('instructor', setLoading, setSession);

  if (loading) {
    return <p>Loading...</p>;
  }

const Assignments: NextPage = () => {
  const [assignments, setAssignments] = useState([]); // State variable for the list of assignments

  useEffect(() => {
    // Fetch the assignments when the component mounts
    fetch('/api/getAssignments')
      .then(response => response.json())
      .then(setAssignments);
  }, []);



  return (
    <>
      <InstructorHeader title="Assignments"
      addLink={[{href: "./create-assignment", title: "Create Assignment"}, {href: "#", title: "Release Assignment"}]}/>
      <InstructorNavbar/>
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
