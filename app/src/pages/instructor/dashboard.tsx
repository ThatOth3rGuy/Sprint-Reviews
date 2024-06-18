import InstructorCourseCard from "../components/instructor-components/instructor-course";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import InstructorHeader from "../components/instructor-components/instructor-header";

export default function Page() {
  return (
    <>
      <br />
      <br />
      <br />
      <InstructorHeader title="Dashboard"/>
      <InstructorNavbar />
      <InstructorCourseCard />
      <InstructorCourseCard />
    </>
  );
}
