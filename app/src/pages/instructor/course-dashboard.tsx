// course-dashboard.tsx
import { useRouter } from "next/router";
import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import styles from '../../styles/instructor-dashboard.module.css';
import InstructorCourseCard from "../components/instructor-components/instructor-assignment-card";
import {Button,Breadcrumbs,BreadcrumbItem} from "@nextui-org/react";
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
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  
  const router = useRouter();
  const { courseId } = router.query;

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useSessionValidation('instructor', setLoading, setSession);

  useEffect(() => {
    if (session && session.user && session.user.userID) {
      fetchAssignments(session.user.userID);
    }
    if (courseId) {
      fetchAssignments(courseId);
      fetch(`/api/courses/${courseId}`)
        .then((response) => response.json())
        .then((data: CourseData) => {
          console.log("Fetched course data:", data);
          setCourseData(data);
        })
        .catch((error) => console.error('Error fetching course data:', error));

      
    }
  }, [courseId]);

  const fetchAssignments = async (courseID: string | string[]) => {
    try {
      const response = await fetch(`/api/getAssignments?courseID=${courseID}`);
      if (response.ok) {
        const data = await response.json();
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

  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return null;
  }
  const isAdmin = session.user.role === 'admin';

  const handleBackClick = async () => {
    router.push('/instructor/dashboard');
  }

  const handleCreateCourseClick = () => {
    router.push('/instructor/create-course');
  };

  return (
    <>
      <br />
      <br />
      <br />
      {isAdmin ? (
        <>
          {/* <AdminHeader 
            title={courseData.courseName}
            addLink={[
              {href: "./create-assignment", title: "Create Assignment"}, 
              {href: "./release-assignment", title: "Release Assignment"}
            ]}
          /> */}
          <AdminNavbar />
        </>
      ) : (
        <>
          {/* <InstructorHeader 
            title={courseData.courseName}
            addLink={[
              {href: "./create-assignment", title: "Create Assignment"}, 
              {href: "./release-assignment", title: "Release Assignment"}
            ]}
          /> */}
          <InstructorNavbar />
        </>
      )}

      <div className={styles.container}>
      <div className={styles.topSection}>   
       
      <Button color="secondary" variant='ghost' onClick={handleCreateCourseClick}>Create Course</Button>
      </div>
      <div className={styles.courseCards}>
          {assignments.map((assignments) => (
            <div key={assignments.assignmentID} className={styles.courseCard}>
              <InstructorCourseCard
                courseID={assignments.assignmentID}
                courseName={assignments.title}
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