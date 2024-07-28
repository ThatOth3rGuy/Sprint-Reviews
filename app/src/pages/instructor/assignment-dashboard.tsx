import { useRouter } from "next/router";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import AssignmentDetailCard from '../components/instructor-components/instructor-assignment-details';
import styles from "../../styles/AssignmentDetailCard.module.css";
import { Breadcrumbs, BreadcrumbItem, Spinner } from "@nextui-org/react";
import type { NextPage } from "next";
interface Assignment {
  assignmentID: number;
  title: string;
  descr: string;
  deadline: string;
  courseID: number;
  submittedStudents: string[];
  remainingStudents: string[];
}

interface CourseData {
  courseID: string;
  courseName: string;
}
interface AssignmentDashboardProps {
  courseId: string;
}

  const AssignmentDashboard: NextPage = () => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const router = useRouter();
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    useSessionValidation('instructor', setLoading, setSession);
  
    useEffect(() => {
      if (!router.isReady) return;
  
      const { assignmentID } = router.query;
  
      const fetchData = async () => {
        if (assignmentID) {
          try {
            const assignmentResponse = await fetch(`/api/assignments/${assignmentID}`);
  
            if (assignmentResponse.ok) {
              const assignmentData: Assignment = await assignmentResponse.json();
              setAssignment(assignmentData);
  
              // Assuming the assignment data includes a courseID
              if (assignmentData.courseID) {
                const courseResponse = await fetch(`/api/courses/${assignmentData.courseID}`);
                if (courseResponse.ok) {
                  const courseData: CourseData = await courseResponse.json();
                  setCourseData(courseData);
                }
              }
            } else {
              console.error('Error fetching assignment data');
            }
          } catch (error) {
            console.error('Error:', error);
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [router.isReady, router.query]);
  
    if (loading || !assignment) {
      return (
        <div className='w-[100vh=w] h-[100vh] instructor flex justify-center text-center items-center my-auto'>
          <Spinner color='primary' size="lg" />
        </div>
      );
    }
  
    if (!session || !session.user || !session.user.userID) {
      console.error('No user found in session');
      return null;
    }
  
    const isAdmin = session.user.role === 'admin';
  
    const handleBackClick = () => router.push(`/instructor/course-dashboard?courseId=${courseData?.courseID}`);
  
    const handleHomeClick = () => {
      router.push("/instructor/dashboard")
    }
  
    return (
      <>
        {isAdmin ? <AdminNavbar /> : <InstructorNavbar />}
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>{assignment.title || "Assignment Name- Details"}</h1>
            <br />
            <Breadcrumbs>
              <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
              <BreadcrumbItem onClick={handleBackClick}>
                {courseData ? courseData.courseName : "Course Dashboard"}
              </BreadcrumbItem>
              <BreadcrumbItem>{assignment.title}</BreadcrumbItem>
            </Breadcrumbs>
          </div>
          <div className={styles.assignmentsSection}>
            <AssignmentDetailCard
              title={assignment.title}
              description={assignment.descr || "No description available"}
              deadline={assignment.deadline || "No deadline set"}
              submittedStudents={assignment.submittedStudents || []}
              remainingStudents={assignment.remainingStudents || []}
            />
          </div>
        </div>
      </>
    );
  }
  
  export default AssignmentDashboard;
