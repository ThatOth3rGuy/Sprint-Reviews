import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import { useState } from 'react';
import { useSessionValidation } from '../api/auth/checkSession';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('instructor', setLoading, setSession);

  if (loading) {
    return <p>Loading...</p>;
  }

  // If the session exists, check if the user is an admin
  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return;
  }
  const isAdmin = session.user.role === 'admin';

  return (
    <>
      <br />
      <br />
      <br />
      <InstructorHeader title="Course Name"
      addLink={[{href: "./create-assignment", title: "Create Assignment"}, {href: "./release-assignment", title: "Release Assignment"}]}/>
      {isAdmin ? (
        <>
          <AdminNavbar />
        </>
      ) : (
        <>
          <InstructorNavbar />
        </>
      )}
    </>
  );
}