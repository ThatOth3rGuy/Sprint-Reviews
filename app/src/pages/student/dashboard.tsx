import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import StudentHeader from '../home/student-components/student-header';
import StudentNavbar from '../home/student-components/student-navbar';

function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/getSession');
        const data = await response.json();
        if (!data || data.user.role !== 'student') {
          router.push('/student/login');
        } else {
          setSession(data);
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
        router.push('/student/login');
      }
      setLoading(false);
    };

    checkSession();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <br />
      <br />
      <br />
      <StudentHeader />
      <StudentNavbar />
    </>
  );
}

export default Page;
