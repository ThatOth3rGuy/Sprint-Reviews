import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import InstructorHeader from "../home/instructor-components/instructor-header";
import InstructorNavbar from "../home/instructor-components/instructor-navbar";

interface CourseData {
  courseID: string;
  name: string;
}

export default function Page() {
  const router = useRouter();
  const { courseID } = router.query;

  const [courseData, setCourseData] = useState<CourseData | null>(null);

  useEffect(() => {
    if (courseID) {
      // Fetch course data from the database using the courseID
      fetch(`/api/courses/${courseID}`)
        .then((response) => response.json())
        .then((data: CourseData) => setCourseData(data))
        .catch((error) => console.error('Error fetching course data:', error));
    }
  }, [courseID]);

  if (!courseData) {
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
