import { useState } from 'react';
import StudentHeader from '../home/student-components/student-header';
import StudentNavbar from '../home/student-components/student-navbar';
import { useSessionValidation } from '../api/auth/checkSession';


function Page() {
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
      <StudentHeader title="Dashboard"/>
      <StudentNavbar/>
    </>
  );
}

export default Page;
