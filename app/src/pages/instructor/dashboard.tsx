import InstructorCourseCard from "../components/instructor-components/instructor-course";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import InstructorHeader from "../components/instructor-components/instructor-header";
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import { useState } from 'react';
import { useSessionValidation } from '../api/auth/checkSession';
import { useRouter } from 'next/router';
import { Button } from "@nextui-org/react";
export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

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
      
      <InstructorCourseCard />
      <InstructorCourseCard />
      {isAdmin ? (
        <>
          <AdminHeader title="Instructor Dashboard"/>
          <AdminNavbar />

          
        </>
      ) : (
        <>
          <InstructorHeader title="Instructor Dashboard"/>
          <InstructorNavbar />
        </>
      )}
    </>
  );
}
