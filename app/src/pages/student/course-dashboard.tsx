import StudentHeader from "../components/student-components/student-header";
import StudentNavbar from "../components/student-components/student-navbar";
import { useState, useEffect } from 'react';
import { useSessionValidation } from '../api/auth/checkSession';
import { useRouter } from "next/router";
import { Button } from "@nextui-org/react";
import InstructorAssignmentCard from "../components/instructor-components/instructor-assignment-card";
import styles from '../../styles/instructor-course-dashboard.module.css';

interface CourseData {
  courseID: string;
  courseName: string;
}

interface Assignment {
  assignmentID: number;
  title: string;
  description: string;
  deadline: string;
}
export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const [courseId, setCourseId] = useState(null);

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('student', setLoading, setSession);
  useEffect(() => {
    setCourseId(router.query.courseId);
  }, [router.query.courseId]);
  useEffect(() => {
    if (session && session.user && session.user.userID) {
      fetchAssignments(session.user.userID);
    }
    if (courseId) {
      
      fetch(`/api/studentCourses/${courseId}`)
        .then((response) => response.json())
        .then((data: CourseData) => {
          console.log("Fetched course data:", data);
          setCourseData(data);
        })
        .catch((error) => console.error('Error fetching course data:', error));
        fetchAssignments(courseId);
      }
  }, [courseId]);

  const fetchAssignments = async (courseID: string | string[]) => {
    try {
      const response = await fetch(`/api/getAssignmentByStudentID?courseID=${courseID}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched assignments:", data);
        setAssignments(data.courses);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  if (!courseData || loading) {
    return <div>Loading...</div>;
  }


  return (
    <>

      
      <StudentNavbar />
      <div >
        <div >
        <h2>{courseData ? courseData.courseName : 'Loading course name...'}</h2>
          {/* <Button color="secondary" variant='ghost' onClick={handleCreateCourseClick}>Create Course</Button> */}
        </div>
        <h2>Assignments for {courseData.courseName}</h2>
        <div >
          {assignments.map((assignments) => (
            <div key={assignments.assignmentID} >
              <InstructorAssignmentCard
                courseID={assignments.assignmentID}
                courseName={assignments.title}
                color="#4c9989"
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.notificationsSection}>
            <h2>Notifications</h2>
            <div className={styles.notificationsContainer}>
              <div className={styles.notificationCard}>Dummy Notification</div>
            </div>
          </div>
    </>
  );
}