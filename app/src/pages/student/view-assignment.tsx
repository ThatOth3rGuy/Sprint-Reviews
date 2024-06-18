import StudentHeader from "../home/student-components/student-header";
import StudentNavbar from "../home/student-components/student-navbar";
import { useState } from 'react';
import { useSessionValidation } from '../api/auth/checkSession';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('student', setLoading, setSession);

  if (loading) {
    return <p>Loading...</p>;
  }

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