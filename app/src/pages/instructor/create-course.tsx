import type { NextPage } from 'next';
import styles from '../../styles/instructor-courses-creation.module.css';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useCallback, useState } from 'react';
import InstructorHeader from '../components/instructor-components/instructor-header';
import InstructorNavbar from '../components/instructor-components/instructor-navbar';
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import { useSessionValidation } from '../api/auth/checkSession';

const Courses: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [courseName, setTitle] = useState('');
  const [institutionName, setDescription] = useState('');
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);
  const [students, setStudents] = useState<{ userID: number }[]>([]);
  const router = useRouter();

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('instructor', setLoading, setSession);

  // Function to handle file upload
  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const enrollStudentsResponse = await fetch('/api/listStudents', {
          method: 'POST',
          body: formData,
        });

        if (enrollStudentsResponse.ok) {
          const studentsData = await enrollStudentsResponse.json();
          setStudents(studentsData.students);
          setShowEnrollPopup(true);
        } else {
          console.error('Failed to upload and process students');
          alert('Failed to upload and process students'); // Ensure alert is shown
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file'); // Ensure alert is shown
      }
    }
  }

  // Function to create a course
  const onCreateCourseButtonClick = useCallback(async () => {
    if (!session || !session.user || !session.user.userID) {
      console.error('No instructor ID found in session');
      return;
    }

    const instructorID = session.user.userID;

    try {
      // Call the create course API with courseName and instructorID
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

      // If it fails, throw an error
      if (!createCourseResponse.ok) {
        throw new Error('Failed to create course');
      }

      const courseData = await createCourseResponse.json();
      const courseId = courseData.courseId;

      const studentIDs = students.map(student => student.userID);

      // Call the enroll students API with studentIDs and courseID
      const enrollStudentsResponse = await fetch(`/api/enrollStudents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentIDs: studentIDs,
          courseID: courseId,
        }),
      });

      // If it fails, throw an error
      if (!enrollStudentsResponse.ok) {
        throw new Error('Failed to enroll students');
      }

      // If there are no errors, log success message and redirect
      console.log('Students enrolled successfully');
      
      // Redirect to course page after successful creation and enrollment
      router.push({
        pathname: '/instructor/course-dashboard',
        query: { courseId },
      });
    // Catch any errors and log/display them
    } catch (error) {
      console.error((error as Error).message);
      alert((error as Error).message); // Ensure alert is shown
    }
  }, [courseName, students, router, session]);

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
          <AdminHeader title="Create Course"/>
          <AdminNavbar />
        </>
      ) : (
        <>
          <InstructorHeader title="Create Course"/>
          <InstructorNavbar />
        </>
      )}
      <div className={styles.container}>
        <div className={styles.rectangle}>
          <i style={{width: "368px", position: "relative", fontSize: "35px", display: "flex", fontWeight: "700", fontFamily: "'Inria Serif'", color: "#04124b", textAlign: "left", alignItems: "center", height: "22px"}}>Create a Course</i>
          
          
        <input type="text" placeholder="Course Name" className={styles.textbox} value={courseName} onChange={e => setTitle(e.target.value)} />
          
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
