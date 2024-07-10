// student/dashboard.tsx
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback } from 'react';
import StudentHeader from '../components/student-components/student-header';
import StudentNavbar from '../components/student-components/student-navbar';
import styles from '../../styles/student-dashboard.module.css';
import { useSessionValidation } from '../api/auth/checkSession';
import { useRouter } from 'next/router';

// Define the types for course and session
interface Course {
  courseID: number;
  courseName: string;
  instructorFirstName: string;
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
            `/api/getCourses?studentID=${session.user.userID}`
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
      <StudentHeader title="Dashboard" />
      <StudentNavbar />
      <br />
      <br />
      <br />
      <br />
      <b className={styles.breadcrumbs}>Breadcrumbs</b>
      <div className={styles.studentHome}>
        {courses.map((course) => (
          <div
            key={course.courseID}
            className={styles.courseCard}
            onClick={() => onCoursesContainerClick(course.courseID)}
          >
            <img
              className={styles.courseCardChild}
              alt=""
              src="/CourseCard-outline.svg"
            />
            <div className={styles.courseCardItem} />
            <b className={styles.courseName}>{course.courseName}</b>
            <i className={styles.instructor}>{course.instructorFirstName}</i>
          </div>
        ))}
        {/* <div className={styles.pendingAssignments}> */}
        {/* <div className={styles.pendingAssignmentsChild} />
          <div className={styles.pendingAssignmentsItem} /> */}
        <div className={styles.pendingAssignments}>
          <b className={styles.pendingTitle}>Pending Assignments</b>
          <div
            className={styles.assignmentDetails}
            onClick={onAssignmentsContainerClick}
          >
            <b className={styles.assignment}>Assignment</b>
            <b className={styles.due010101}>Due: 01/01/01</b>
            <p className={styles.course}>Course</p>
          </div>
        </div>
        <div
          className={styles.assignmentDetails1}
          onClick={onAssignmentsContainerClick}
        >
          <b className={styles.assignment}>Assignment</b>
          <b className={styles.due010101}>Due: 01/01/01</b>
          <p className={styles.course}>Course</p>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}

export default Page;
