// create-course.tsx
import type { NextPage } from 'next';
import styles from '../../styles/instructor-courses-creation.module.css';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useCallback, useState } from "react";
import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import { useSessionValidation } from '../api/auth/checkSession';

const Courses: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [courseName, setTitle] = useState('');
  const [institutionName, setDescription] = useState('');
  const router = useRouter();

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('instructor', setLoading, setSession);

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
        courseName: courseName,
        instructorID: instructorID,
      }),
    });

    if (createCourseResponse.ok) {
      const courseData = await createCourseResponse.json();
      const courseId = courseData.courseId;

    // Call API to add students to the course with institutionName and fileContent


    // Redirect to course page after successful creation
    router.push({
      pathname: '/instructor/course-dashboard',
      query: { courseId }
    });
  } else {
    // Handle errors
    console.error('Failed to create course');
  }
  
  }, [courseName, fileContent, institutionName, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

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
