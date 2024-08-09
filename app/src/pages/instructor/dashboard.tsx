// instructor/dashboard.tsx
/**
 * Renders the main dashboard page for instructors after login. This page fetches  
 * course data to display all courses created by instructor and helps 
 *
 * @return {JSX.Element} The rendered instructor dashboard page
 */

// Importing necessary libraries and components
import React, { useState, useEffect } from 'react';
import InstructorCourseCard from "../components/instructor-components/instructor-course";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import { useSessionValidation } from '../api/auth/checkSession';
import { useRouter } from 'next/router';
import { Button, Spinner } from '@nextui-org/react';
import styles from '../../styles/instructor-dashboard.module.css';
import toast from 'react-hot-toast';
// Defining interfaces for  Course Data 
interface Course {
  courseID: number;
  courseName: string;
}

export default function Page() {
  // Initializing state variables
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  // Checking user session
  useSessionValidation('instructor', setLoading, setSession);

  useEffect(() => {
    if (session && session.user && session.user.userID) {
      fetchCourses(session.user.userID); // fetches courses using instructor userID 
    }
  }, [session]);

  // navigation function to create course page
  const handleCreateCourseClick = () => {
    router.push('/instructor/create-course');
  };
  // function to fetch course data using the userID in session 
  // sends the userID to api/getCourse4Instructor.ts
  const fetchCourses = async (instructorID: number) => {
    try {
      const response = await fetch(`/api/getCourse4Instructor?instructorID=${instructorID}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
      } else {
        toast.error('Failed to fetch courses');
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      toast.error('Error fetching courses');
      console.error('Error fetching courses:', error);
    }
  };
  // Loading Spinner
  if (loading) {
    return <div className='w-[100vh=w] h-[100vh] instructor flex justify-center text-center items-center my-auto'>
      <Spinner color='primary' size="lg" />
    </div>;
  }
  // checks if user session exists
  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return null;
  }
  // admin check
  const isAdmin = session.user.role === 'admin';

  // Renders the component 
  return (
    <>
      {isAdmin ? <AdminNavbar home={{ className: "bg-primary-500" }} /> : <InstructorNavbar home={{ className: "bg-primary-500" }} />}
      <div className={`instructor text-primary-900 ${styles.container}`}>
        <div className={styles.topSection}>
          <h1>Dashboard  </h1>
          <Button size='sm' color="secondary" variant='ghost' className='self-end text-right' onClick={handleCreateCourseClick}>Create Course</Button>
        </div>
        <div >
          <div className={styles.courseCards}>
            {courses.map((course) => (
              <div key={course.courseID} className={styles.courseCard}>
                <InstructorCourseCard
                  courseID={course.courseID}
                  courseName={course.courseName}
                  color="#9fc3cf"
                  img="/logo-transparent-png.png"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  );
}