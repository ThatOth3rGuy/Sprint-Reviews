import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import { useSessionValidation } from '../api/auth/checkSession';

interface CourseData {
  courseID: string;
  name: string;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const { courseID } = router.query;

  const [courseData, setCourseData] = useState<CourseData | null>(null);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('instructor', setLoading, setSession);

  useEffect(() => {
    if (courseID) {
      // Fetch course data from the database using the courseID
      fetch(`/api/courses/${courseID}`)
        .then((response) => response.json())
        .then((data: CourseData) => setCourseData(data))
        .catch((error) => console.error('Error fetching course data:', error));
    }
  }, [courseID]);

  if (!courseData || loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <br />
      <br />
      <br />
      <InstructorHeader 
        title={courseData.name}
        addLink={[
          { href: `/${courseID}/create-assignment`, title: "Create Assignment" }, 
          { href: `/${courseID}/release-assignment`, title: "Release Assignment" }
        ]}
      />
      <InstructorNavbar/>
    </>
  );
}
