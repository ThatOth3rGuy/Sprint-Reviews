import React, { useState, useEffect } from 'react';
import StudentCourseCard from "../components/student-components/student-course";
import InstructorCourseCard from "../components/instructor-components/instructor-course";
import StudentHeader from "../components/student-components/student-header";
import StudentNavbar from "../components/student-components/student-navbar";
import { useSessionValidation } from '../api/auth/checkSession';
import { useRouter } from 'next/router';
import { Button } from '@nextui-org/react';
import styles from '../../styles/instructor-dashboard.module.css';
import { Modal,Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

interface Course {
  courseID: number;
  courseName: string;
  instructorFirstName: string;
  instructorLastName: string;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useSessionValidation('student', setLoading, setSession);

  useEffect(() => {
    console.log('Session updated:', session);
    if (session && session.user && session.user.userID) {
      console.log('Fetching courses for userID:', session.user.userID);
      fetchCourses(session.user.userID);
    }
  }, [session]);


  const handleCreateCourseClick = () => {
    router.push('/instructor/create-course');
  };
  
  const fetchCourses = async (userID: number) => {
    try {
      const response = await fetch(`/api/getCoursesByStudent?userID=${userID}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return null;
  }

  const isAdmin = session.user.role === 'admin';

  return (
    <>
      <StudentNavbar />

      <div className={`instructor text-primary-900 ${styles.container}`}>
        <div className={styles.topSection}>
          <h1>Dashboard  </h1>
        </div>
        <div >
          <div className={styles.courseCards}>
            {courses.map((course) => (
              <div key={course.courseID} className={styles.courseCard}>
                <StudentCourseCard
                courseID={course.courseID}
                courseName={course.courseName}
                color="#9fc3cf"
                img="/logo-transparent-png.png"
                instructorName={`${course.instructorFirstName} ${course.instructorLastName}`}
              />
              </div>
            ))}
          </div>
        </div>
      </div>
        
    </>
  );
}