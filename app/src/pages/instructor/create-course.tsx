import type { NextPage } from 'next';
import styles from "../../styles/instructor-assignments-creation.module.css";
import { useRouter } from 'next/router';
import { Card,SelectItem, Select,Listbox, ListboxItem, AutocompleteItem, Autocomplete, Textarea, Button, Breadcrumbs, BreadcrumbItem, Divider, Checkbox, CheckboxGroup, Progress, Input } from "@nextui-org/react";
import React, { ChangeEvent, useCallback, useState } from 'react';
import InstructorHeader from '../components/instructor-components/instructor-header';
import InstructorNavbar from '../components/instructor-components/instructor-navbar';
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import { useSessionValidation } from '../api/auth/checkSession';
import Image from 'next/image';
const Courses: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [courseName, setTitle] = useState('');
  const [institutionName, setDescription] = useState('');
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);
  const [students, setStudents] = useState<{ userID: number }[]>([]);
  const [missingData, setMissingData] = useState<string[]>([]);
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
          setMissingData(studentsData.missingData);
          console.log('Student Data:', studentsData.students); // Log student data
          console.log('Missing Data:', studentsData.missingData); // Log missing data
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
      const createCourseResponse = await fetch('/api/addNew/createCourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName: courseName,
          instructorID: instructorID,
          missingData: missingData,
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
      const enrollStudentsResponse = await fetch(`/api/addNew/enrollStudents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentIDs: studentIDs,
          courseID: courseId,
          missingData: missingData, // Include missingData here
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
  }, [courseName, students, missingData, router, session]);

  if (loading) {
    return <p>Loading...</p>;
  }

  // If the session exists, check if the user is an admin
  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return;
  }
  const isAdmin = session.user.role === 'admin'; 
  function handleHomeClick(): void {
    router.push("/instructor/dashboard");
  }
  return (
    <>
      {isAdmin ? <AdminNavbar /> : <InstructorNavbar />}
      <div className={`instructor text-primary-900 ${styles.container}`}>
      <div className={styles.header}>
          <h1>Create Course</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem>Create Course</BreadcrumbItem>
          </Breadcrumbs>
          
        </div>
        <div className={styles.mainContent}>
          
        <div className={`flex flex-row items-center justify-center  ${styles.rectangle}`}>         
        
        <br/><br/><br/><br/><br/><br/>
        <Image
          src= "/texture-png.png"
          alt="Theme 1"
          width={90}
          height={90}
        />
        <Input type="text" placeholder="Course Name" className={styles.textbox} value={courseName} onChange={e => setTitle(e.target.value)} />
          
          <p>Upload Student List: {' '}
          <input type="file" onChange={handleFileUpload} /></p>
          <Button color="primary" variant="ghost" className={styles.createButton} onClick={onCreateCourseButtonClick}>Create Course</Button>

          
        </div>
      </div>
      </div>
    </>
  );
}

export default Courses;
