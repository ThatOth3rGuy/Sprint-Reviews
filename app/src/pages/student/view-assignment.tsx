import StudentHeader from "../home/student-components/student-header";
import StudentNavbar from "../home/student-components/student-navbar";


export default function Page() {
  return (
    <>
      <br />
      <br />
      <br />
      <StudentHeader title="Course Name"
      addLink={[{href: "./all-assignments", title: "View All"}, {href: "./peer-eval-assignments", title: "Peer Evaluations"}]}/>
      <StudentNavbar/>
    </>
  );
}