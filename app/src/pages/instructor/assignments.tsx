import InstructorHeader from "../home/instructor-components/instructor-header";
import InstructorNavbar from "../home/instructor-components/instructor-navbar";



export default function Page() {
  return (
    <>
      <br />
      <br />
      <br />
      <InstructorHeader title="Assignments"
      addLink={[{href: "./create-assignment", title: "Create Assignment"}, {href: "#", title: "Release Assignment"}]}/>
      <InstructorNavbar/>
    </>
  );
}