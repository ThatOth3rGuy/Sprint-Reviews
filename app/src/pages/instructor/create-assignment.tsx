import InstructorHeader from "../home/instructor-components/instructor-header";
import InstructorNavbar from "../home/instructor-components/instructor-navbar";



export default function Page() {
  return (
    <>
      <br />
      <br />
      <br />
      <InstructorHeader title="Assignments"
      addLink={[{href: "#", title: "Create Assignment"}, {href: "./release-assignment", title: "Release Assignment"}]}/>
      <InstructorNavbar/>
    </>
  );
}