// course-dashboard.tsx
import { useRouter } from "next/router";
import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';

interface CourseData {
  courseID: string;
  courseName: string;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const { courseId } = router.query;

  const [courseData, setCourseData] = useState<CourseData | null>(null);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('instructor', setLoading, setSession);

  useEffect(() => {
    if (courseId) {
      // Fetch course data from the database using the courseID
      fetch(`/api/courses/${courseId}`)
        .then((response) => response.json())
        .then((data: CourseData) => {
          console.log("Fetched course data:", data);
          setCourseData(data);
        })
        .catch((error) => console.error('Error fetching course data:', error));
    }
  }, [courseId]);

  if (!courseData || loading) {
    return <div>Loading...</div>;
  }

  // If the session exists, check if the user is an admin
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
          <AdminHeader title="Course Name"
          addLink={[{href: "./create-assignment", title: "Create Assignment"}, {href: "./release-assignment", title: "Release Assignment"}]}/>
          <AdminNavbar />
        </>
      ) : (
        <>
          <InstructorHeader title="Course Name"
          addLink={[{href: "./create-assignment", title: "Create Assignment"}, {href: "./release-assignment", title: "Release Assignment"}]}/>
          <InstructorNavbar />
        </>
      )}
    </>
  );
}
