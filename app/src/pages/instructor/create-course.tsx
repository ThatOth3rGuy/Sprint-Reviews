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
  const [showEnrollPopup, setShowEnrollPopup] = useState(false); // State for enrollment success popup
  const [students, setStudents] = useState([]); // State to store students
  const router = useRouter();

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    // Get the file from the event target and create a FormData object from formidable
    if (event.target.files && event.target.files[0]) { // Check if a file was uploaded
      const file = event.target.files[0]; // Get the file
      const formData = new FormData(); // Create a FormData object
      formData.append('file', file); // Add the file to the form data
  
      try {
        const enrollStudentsResponse = await fetch('/api/listStudents', { // Call the listStudents API
          method: 'POST',
          body: formData, // Send as FormData
        });
  
        if (enrollStudentsResponse.ok) { 
          const students = await enrollStudentsResponse.json(); // Get the students from the response
          setStudents(students); // Set the students state
          setShowEnrollPopup(true); // Show the popup on successful enrollment
        } else {
          console.error('Failed to upload and process students');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
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
    // If course creation is successful, get the course ID and enroll students
    if (createCourseResponse.ok) {
      const courseData = await createCourseResponse.json();
      const courseId = courseData.id;

    // Call API to add students to the course with institutionName and fileContent
      const enrollStudentsResponse = await fetch(`/api/enrollStudents/${courseId}`, { // Call the enrollStudents API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        students: students, // Send the students array
        courseId: courseId, // Send the course ID
      }),
    });

    if (enrollStudentsResponse.ok) {
      console.log('Students enrolled successfully');
    } else {
      console.error('Failed to enroll students');
    }
    // Redirect to course page after successful creation
    router.push(`/instructor/course-dashboard/${courseId}`); // Redirect to specific course-dashboard page
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
