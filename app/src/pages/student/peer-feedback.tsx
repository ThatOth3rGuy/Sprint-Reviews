import StudentHeader from "../home/student-components/student-header";
import StudentNavbar from "../home/student-components/student-navbar";


export default function Page() {
  return (
    <>
      <br />
      <br />
      <br />
      <StudentHeader title="Course Name"
      addLink={[{href: "#", title: "Assignments"}, {href: "#", title: "Peer Feedback"}]}/>
      <StudentNavbar/>
    </>
  );
}