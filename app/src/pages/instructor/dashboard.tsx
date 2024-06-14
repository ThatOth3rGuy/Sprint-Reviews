import InstructorCourseCard from "../home/instructor-components/instructor-course";
import InstructorNavbar from "../home/instructor-components/instructor-navbar";
import InstructorHeader from "../home/instructor-components/instructor-header";

export default function Page() {
  return (
    <>
      <br />
      <br />
      <br />
      <InstructorHeader />
      <InstructorNavbar />
      <InstructorCourseCard />
      <InstructorCourseCard />
    </>
  );
}
