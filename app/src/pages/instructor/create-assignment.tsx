// create-assignment.tsx
import React, { ChangeEvent, useState } from "react"; // Import React

import InstructorHeader from "../home/instructor-components/instructor-header";
import InstructorNavbar from "../home/instructor-components/instructor-navbar";

export default function Page() {
  const [file, setFile] = useState<File | null>(null); // Specify the type for 'file'

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return; // User canceled file selection
    }
    const selectedFile = event.target.files[0]; // Get the first selected file
    setFile(selectedFile);
  }

  async function createAssignment() {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/create-assignment", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("Assignment created successfully");
        // Handle any further actions (e.g., display a success message)
      } else {
        console.error("Error creating assignment");
        // Handle error cases (e.g., display an error message)
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle network or other errors
    }
  }

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
      <InstructorHeader
        title="Assignments"
        addLink={[
          { href: "./create-assignment", title: "Create Assignment" },
          { href: "#", title: "Release Assignment" },
        ]}
      />
      <InstructorNavbar />
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

      {/* Display the file upload input */}
      <div style={{ textAlign: "center" }}>
        <p>Upload file:</p>
        <input type="file" onChange={handleFileUpload} />
        <button onClick={createAssignment}>Create Assignment</button>
      </div>
    </>
  );
}

export default Assignments;

