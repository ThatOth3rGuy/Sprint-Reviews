// student/dashboard.tsx
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback } from 'react';
import StudentHeader from '../components/student-components/student-header';
import StudentNavbar from '../components/student-components/student-navbar';
import styles from '../../styles/student-dashboard.module.css';
import { useSessionValidation } from '../api/auth/checkSession';
import { useRouter } from 'next/router';
import StudentCourseCard from '../components/student-components/student-course';
import { Breadcrumbs, BreadcrumbItem, Button } from '@nextui-org/react';

// Define the types for course and session
interface Course {
  courseID: number;
  courseName: string;
  instructorFirstName: string;
  instructorLastName: string;
}

function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  // Use the session validation hook to check if the user is logged in
  useSessionValidation("student", setLoading, setSession);

  useEffect(() => {
    const fetchCourses = async () => {
      if (session) {
        try {
          const response = await fetch(
            `/api/courses/getCoursesByStudent?studentID=${session.user.studentID}` //Needs to be fixed to match db changes
          );
          const data = await response.json();
          setCourses(data);
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      }
    };

    fetchCourses();
  }, [session]);

  const onCoursesContainerClick = useCallback(
    (courseID: number) => {
      router.push({
        pathname: "/student/course-dashboard",
        query: { courseID },
      });
    },
    [router]
  );

  const onAssignmentsContainerClick = useCallback(() => {
    // Redirect to the assignments page
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* <StudentHeader title="Dashboard" /> */}
      
      <div className='inline-block mx-0 '>
        <StudentNavbar home={{ className: "bg-secondary-50" }} />
      </div>
      <div className={styles.content}>
      <h2>Dashboard</h2>
        <div className={styles.topSection}>
          {/* <Breadcrumbs variant='bordered' color='secondary'>
            <BreadcrumbItem>Dashboard</BreadcrumbItem>
          </Breadcrumbs> */}

        </div>
        <div className={styles.studentHome}>
          {courses.map((course) => (
            <div
            className={styles.courseCard}
              key={course.courseID}
              onClick={() => onCoursesContainerClick(course.courseID)}
            >
              <StudentCourseCard
                courseID={course.courseID}
                courseName={course.courseName} color={''} img="/logo-transparent-png.png"
                instructorName={course.instructorFirstName + " " + course.instructorLastName}>
              </StudentCourseCard>
            </div>
          ))}
        </div>
      </div>

    </>
  );
}

export default Page;
