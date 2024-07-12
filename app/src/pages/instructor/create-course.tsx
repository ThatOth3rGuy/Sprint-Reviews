import type { NextPage } from 'next';
import styles from '../../styles/instructor-courses-creation.module.css';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useCallback, useState } from 'react';
import InstructorHeader from '../components/instructor-components/instructor-header';
import InstructorNavbar from '../components/instructor-components/instructor-navbar';
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import { useSessionValidation } from '../api/auth/checkSession';
import { Button, Input} from '@nextui-org/react';
const Courses: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [courseName, setTitle] = useState('');
  const [institutionName, setDescription] = useState('');
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);
  const [students, setStudents] = useState<{ userID: number }[]>([]);
  const router = useRouter();

  useSessionValidation('instructor', setLoading, setSession);
  const handleBackClick = async () => {
    // Redirect to the landing page
    router.push('/instructor/dashboard');
  }
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
          alert('Failed to upload and process students');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
      }
    }
  }

  const onCreateCourseButtonClick = useCallback(async () => {
    if (!session || !session.user || !session.user.userID) {
      console.error('No instructor ID found in session');
      return;
    }

    const instructorID = session.user.userID;

    try {
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

      if (!createCourseResponse.ok) {
        throw new Error('Failed to create course');
      }

      const courseData = await createCourseResponse.json();
      const courseId = courseData.courseId;

      const studentIDs = students.map(student => student.userID);

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

      if (!enrollStudentsResponse.ok) {
        throw new Error('Failed to enroll students');
      }

      console.log('Students enrolled successfully');
      router.push({
        pathname: '/instructor/course-dashboard',
        query: { courseId },
      });
    } catch (error) {
      console.error((error as Error).message);
      alert((error as Error).message);
    }
  }, [courseName, students, router, session]);

  if (loading) {
    return <p>Loading...</p>;
  }

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
          <h3 style={{ fontSize: "35px", fontWeight: "700", fontFamily: "'Inria Serif'", color: "#04124b", textAlign: "left" }}>Create a Course</h3>
          <Input variant = "flat" size ="lg" className= {styles.textbox} label="Course Name" placeholder="Enter course name" value={courseName} onChange={e => setTitle(e.target.value)} />
          <p className= {styles.upload}>
          <h3 style={{ fontSize: "20px", fontWeight: "700", fontFamily: "'Inria Serif'", color: "#04124b", textAlign: "center" }}> &nbsp; Upload a class list (.csv): </h3>
          <Input  type="file" size ="lg"  className= {styles.textbox} onChange={handleFileUpload} />
          </p>
          <Button variant = "ghost" size ="lg" color ="primary" onClick={onCreateCourseButtonClick}>Create Course</Button>
          <img
            className="absolute top-0 left-0 mt-[2vh] ml-[1vh] object-cover cursor-pointer w-[3vw] h-[3vw]"
            alt="Back"
            src="/images/Back-Instructor.png"
            onClick={handleBackClick}
          />
        </div>


      </div>
      
    </>
  );
}

export default Courses;
