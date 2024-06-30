// create-course.tsx
import type { NextPage } from 'next';
import styles from '../../styles/instructor-courses-creation.module.css';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useCallback, useState } from 'react';
import InstructorHeader from '../components/instructor-components/instructor-header';
import InstructorNavbar from '../components/instructor-components/instructor-navbar';
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
        }
      } catch (error) {
        console.error('Error uploading file:', error);
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

      const studentIDs = students.map(student => student.userID); // Ensure student IDs are extracted

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

      if (enrollStudentsResponse.ok) {
        console.log('Students enrolled successfully');
        //router.push(`/instructor/course-dashboard/${courseId}`);
      } else {
        console.error('Failed to enroll students');
      }

      // Redirect to course page after successful creation
      router.push({
        pathname: '/instructor/course-dashboard',
        query: { courseId },
      });
    } else {
      // Handle errors
      console.error('Failed to create course');
    }
  }, [courseName, students, router, session]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <InstructorHeader title="Create Course" />
      <InstructorNavbar />
      <div className={styles.container}>
        <div className={styles.rectangle}>
          <i style={{width: "368px", position: "relative", fontSize: "35px", display: "flex", fontWeight: "700", fontFamily: "'Inria Serif'", color: "#04124b", textAlign: "left", alignItems: "center", height: "22px"}}>Create a Course</i>
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
