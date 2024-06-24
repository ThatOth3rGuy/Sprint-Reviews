// create-course.tsx
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
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);
  const [students, setStudents] = useState<{ userID: number }[]>([]);
  const router = useRouter();

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

  const onCreateCourseButtonClick = useCallback(async () => {
    const instructorID = '1'; // Get this instructor ID from the session

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
    } else {
      console.error('Failed to create course');
    }
  }, [courseName, students, router]);

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
