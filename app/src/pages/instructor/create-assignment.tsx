// create-assignment.tsx
import InstructorHeader from "../home/instructor-components/instructor-header";
import InstructorNavbar from "../home/instructor-components/instructor-navbar";
import type { NextPage } from 'next';
import { useCallback, useState } from 'react';
import styles from '../../styles/instructor-assignments-creation.module.css';
import { useRouter } from 'next/router';

const Assignments: NextPage = () => {
  const [dueDate, setDueDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classID, setClassID] = useState(''); // Keep the initial value as an empty string
  const router = useRouter();

  const onCreateAssignmentButtonClick = useCallback(async () => {
    const response = await fetch('/api/createAssignment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, dueDate, classID: Number(classID) }), // Convert classID to a number
    });

    if (response.ok) {
      // After creating the assignment, navigate to the 'instructor/assignments.tsx' page
      router.push('/instructor/view-assignment');
    } else {
      console.error('An error occurred while creating the assignment');
    }
  }, [title, description, dueDate, classID, router]);

  return (
    <>
      <InstructorHeader title="Assignments"
      addLink={[{href: "./create-assignment", title: "Create Assignment"}, {href: "#", title: "Release Assignment"}]}/>
      <InstructorNavbar/>
      <div className={styles.container}>
        <div className={styles.rectangle}>
          <i style={{width: "368px", position: "relative", fontSize: "35px", display: "flex", fontWeight: "700", fontFamily: "'Inria Serif'", color: "#04124b", textAlign: "left", alignItems: "center", height: "22px",}}>Create an Assigmnent</i>
          <input type="text" placeholder="Assignment Title" className={styles.textbox} value={title} onChange={e => setTitle(e.target.value)} />          
          <textarea placeholder="Assignment Description" className={styles.textbox} value={description} onChange={e => setDescription(e.target.value)}></textarea>
          <input type="date" className={styles.textbox} value={dueDate} onChange={e => setDueDate(e.target.value)} />
          {/* Change the input type to number */}
          <input type="number" placeholder="Class ID" className={styles.textbox} value={classID} onChange={e => setClassID(e.target.value)} />
          <div className={styles.button} onClick={onCreateAssignmentButtonClick}>
            <div />
            <b>Create Assignment</b>
          </div>
        </div>
      </div>
    </>
  );
}

export default Assignments;
