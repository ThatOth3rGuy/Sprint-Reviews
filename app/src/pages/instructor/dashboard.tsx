import React, { useState, useEffect } from 'react';
import InstructorCourseCard from "../components/instructor-components/instructor-course";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import InstructorHeader from "../components/instructor-components/instructor-header";
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import { useSessionValidation } from '../api/auth/checkSession';
import { useRouter } from 'next/router';
import { User,Button,Image} from '@nextui-org/react';
import styles from '../../styles/instructor-dashboard.module.css';
import {Card,CardHeader,Breadcrumbs,BreadcrumbItem } from "@nextui-org/react";
interface Course {
  courseID: number;
  courseName: string;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useSessionValidation('instructor', setLoading, setSession);

  useEffect(() => {
    if (session && session.user && session.user.userID) {
      fetchCourses(session.user.userID);
    }
  }, [session]);
  const handleCreateCourseClick = () => {
    router.push('/instructor/create-course');
  };
  const fetchCourses = async (instructorID: number) => {
    try {
      const response = await fetch(`/api/getCourse4Instructor?instructorID=${instructorID}`);
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
      <br />
  <br />
  <br />
  {isAdmin ? (
    <>
      <AdminHeader title="Instructor Dashboard"/>
      <AdminNavbar />
    </>
  ) : (
    <>
      <InstructorHeader title="Instructor Dashboard"/>
      <InstructorNavbar />
    </>
  )}
   <Breadcrumbs>
            <BreadcrumbItem>Dashboard</BreadcrumbItem>
          </Breadcrumbs>
  <div className={styles.container}>
        <div className={styles.topSection}>
          <Breadcrumbs>
            <BreadcrumbItem>Dashboard</BreadcrumbItem>
          </Breadcrumbs>
          <Button color="secondary" variant='ghost' onClick={handleCreateCourseClick}>Create Course</Button>
        </div>
        <div className={styles.courseCards}>
          {courses.map((course) => (
            <div key={course.courseID} className={styles.courseCard}>
              <InstructorCourseCard
                courseID={course.courseID}
                courseName={course.courseName}
                color="#4c9989"
                img="/logo-transparent-png.png"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}