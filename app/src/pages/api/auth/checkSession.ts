import { useRouter } from 'next/router';
import { useEffect } from 'react';

export async function checkSession(role: string) {
  try {
    const response = await fetch('/api/auth/getSession');
    if (!response.ok) {
      throw new Error('Failed to fetch session');
    }
    const data = await response.json();
    if (!data || data.user.role !== role) {
      return { isValid: false, session: null };
    }
    return { isValid: true, session: data };
  } catch (error) {
    console.error('Failed to fetch session:', error);
    return { isValid: false, session: null };
  }
}

export async function useSessionValidation(role: string, setLoading: (loading: boolean) => void, setSession: (session: any) => void) {
  const router = useRouter();

  const verifySession = async () => {
    const { isValid, session } = await checkSession(role);
    if (!isValid) {
      router.push('/student/login');
    } else {
      setSession(session);
    }
    setLoading(false);
  };

  useEffect(() => {
    verifySession();
  }, [router]);
}
