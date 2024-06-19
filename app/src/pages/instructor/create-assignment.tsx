// create-assignment.tsx
import type { NextPage } from 'next';
import styles from '../../styles/instructor-assignments-creation.module.css';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useCallback, useState } from "react";

import InstructorHeader from "../home/instructor-components/instructor-header";
import InstructorNavbar from "../home/instructor-components/instructor-navbar";

const Assignments: NextPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classID, setClassID] = useState('');
  const router = useRouter();

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const selectedFile = event.target.files[0];
    setFile(selectedFile); // Store the File object in state
    const reader = new FileReader();
    reader.onload = function(e) {
      if (e.target) {
        setFileContent(e.target.result as string); // Store the file content as a string in state
      }
    };
    reader.readAsText(selectedFile);
  }

  const onCreateAssignmentButtonClick = useCallback(async () => {
    const response = await fetch('/api/createAssignment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, dueDate, classID: Number(classID), file: fileContent }),
    });

    if (response.ok) {
      router.push('/instructor/view-assignment');
    } else {
      console.error('An error occurred while creating the assignment');
    }
  }, [title, description, dueDate, classID, fileContent, router]);

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
          <i style={{width: "368px", position: "relative", fontSize: "35px", display: "flex", fontWeight: "700", fontFamily: "'Inria Serif'", color: "#04124b", textAlign: "left", alignItems: "center", height: "22px",}}>Create an Assignment</i>
          <input type="text" placeholder="Assignment Title" className={styles.textbox} value={title} onChange={e => setTitle(e.target.value)} />          
          <textarea placeholder="Assignment Description" className={styles.textbox} value={description} onChange={e => setDescription(e.target.value)}></textarea>
          <input type="date" className={styles.textbox} value={dueDate} onChange={e => setDueDate(e.target.value)} />
          <input type="number" placeholder="Class ID" className={styles.textbox} value={classID} onChange={e => setClassID(e.target.value)} />
          <p>Upload Rubric: 
          <input type="file" onChange={handleFileUpload} /></p>          
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
