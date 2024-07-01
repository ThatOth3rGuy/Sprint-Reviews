import InstructorCourseCard from "../components/instructor-components/instructor-course";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import InstructorHeader from "../components/instructor-components/instructor-header";
import { useState } from 'react';
import { useSessionValidation } from '../api/auth/checkSession';
import { useRouter } from 'next/router';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('instructor', setLoading, setSession);

  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return;
  } else if (session.user.role == 'admin') {
    router.push('/admin/portal-home');
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <br />
      <br />
      <br />
      <InstructorHeader title="Dashboard"/>
      <InstructorNavbar />
      <InstructorCourseCard />
      <InstructorCourseCard />
    </>
  );
}
