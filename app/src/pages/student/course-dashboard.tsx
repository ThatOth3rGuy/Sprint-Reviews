import StudentHeader from "../components/student-components/student-header";
import StudentNavbar from "../components/student-components/student-navbar";
import { useState, useEffect } from 'react';
import { useSessionValidation } from '../api/auth/checkSession';
import { useRouter } from "next/router";
import { Button } from "@nextui-org/react";
import InstructorCourseCard from "../components/instructor-components/instructor-course";

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
  const { courseId } = router.query;

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('student', setLoading, setSession);
  
  useEffect(() => {
    if (session && session.user && session.user.userID) {
      fetchAssignments(session.user.userID);
    }
    if (courseId) {
      fetchAssignments(courseId);
      fetch(`/api/studentCourses/${courseId}`)
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
      
      <StudentHeader title={courseData.courseName}
      addLink={[{href: "./all-assignments", title: "Assignments"}, {href: "./peer-eval-assignments", title: "Peer Feedback"}]}/>
      <StudentNavbar/>
      <div >
      <div >   
       
      {/* <Button color="secondary" variant='ghost' onClick={handleCreateCourseClick}>Create Course</Button> */}
      </div>
      <div >
        <p>{courseData.courseName}</p>
          {assignments.map((assignments) => (
            <div key={assignments.assignmentID} >
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