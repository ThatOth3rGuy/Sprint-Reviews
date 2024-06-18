import InstructorNavbar from "../home/instructor-components/instructor-navbar";
import InstructorHeader from "../home/instructor-components/instructor-header";

export default function Page() {
  return (
    <>
      <br />
      <br />
      <br />
      <InstructorHeader title="View Users"
      addLink={[{href: "./view-users", title: "View Users"}, {href: "./join-requests", title: "Join Requests"}, {href: "./archived-courses", title: "Archived Courses"}]}/>
      <InstructorNavbar />
    </>
  );
}
