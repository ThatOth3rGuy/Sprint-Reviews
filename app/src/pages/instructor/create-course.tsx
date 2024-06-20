// create-assignment.tsx
import type { NextPage } from 'next';
import styles from '../../styles/instructor-courses-creation.module.css';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useCallback, useState } from "react";

import InstructorHeader from "../home/instructor-components/instructor-header";
import InstructorNavbar from "../home/instructor-components/instructor-navbar";

const Courses: NextPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [courseName, setTitle] = useState('');
  const [institutionName, setDescription] = useState('');
  const router = useRouter();

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
      //Handle student list upload here
  }

  const onCreateCourseButtonClick = useCallback(async () => {
    // Get the instructor ID from the session
    const instructorID = '1'; // Get this instructor ID from the session

    // Call API to create course with name and instructor ID
    const createCourseResponse = await fetch('/api/createCourse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: courseName,
        instructorID: instructorID,
      }),
    });

    if (createCourseResponse.ok) {
      const courseData = await createCourseResponse.json();
      const courseId = courseData.id;

    // Call API to add students to the course with institutionName and fileContent
    if (fileContent) {
      await fetch(`/api/courses/${courseId}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          students: fileContent.split('\n'), // Assuming fileContent contains a list of student emails or IDs separated by new lines
          institutionName: institutionName,
        }),
      });
    }

    // Redirect to another page after successful creation
    router.push('/instructor/dashboard'); //This link should be to the newly created courses page
  } else {
    // Handle errors
    console.error('Failed to create course');
  }
  
  }, [courseName, fileContent, institutionName, router]);

  return (
    <>
      <InstructorHeader
        title="Create Course"/>
      <InstructorNavbar />
      <div className={styles.container}>
        <div className={styles.rectangle}>
          <i style={{width: "368px", position: "relative", fontSize: "35px", display: "flex", fontWeight: "700", fontFamily: "'Inria Serif'", color: "#04124b", textAlign: "left", alignItems: "center", height: "22px",}}>Create a Course</i>
          <input type="text" placeholder="Course Name" className={styles.textbox} value={courseName} onChange={e => setTitle(e.target.value)} />          
          <input type="text" placeholder="Institution Name" className={styles.textbox} value={institutionName} onChange={e => setDescription(e.target.value)} />
          <p>Upload Student List: {' '}
          <input type="file" onChange={handleFileUpload} /></p>          
          <div className={styles.button} onClick={onCreateCourseButtonClick}>
            <div />
            <b>Create Course</b>
          </div>
        </div>
      </div>
    </>
  );
}

export default Courses;
