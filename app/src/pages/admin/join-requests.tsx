import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import InstructorHeader from "../components/instructor-components/instructor-header";
import { useState } from 'react';
import { useSessionValidation } from '../api/auth/checkSession';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('admin', setLoading, setSession);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <br />
      <br />
      <br />
      <InstructorHeader title="Join Requests"
      addLink={[{href: "./view-users", title: "View Users"}, {href: "./join-requests", title: "Join Requests"}, {href: "./archived-courses", title: "Archived Courses"}]}/>
      <InstructorNavbar />
    </>
  );
}
