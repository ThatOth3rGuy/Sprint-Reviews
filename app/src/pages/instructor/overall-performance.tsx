import InstructorHeader from "../home/instructor-components/instructor-header";
import InstructorNavbar from "../home/instructor-components/instructor-navbar";



export default function Page() {
  return (
    <>
      <br />
      <br />
      <br />
      <InstructorHeader title="Grades"
      addLink={[{href: "#", title: "Overall Performance"}, {href: "#", title: "Individual Performance"}]}/>
      <InstructorNavbar/>
    </>
  );
}