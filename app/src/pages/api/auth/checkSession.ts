// This file is used to check the session of the user and return the user's session if it exists
// it will be called at the start of every page that requires a user to have a role
import { useRouter } from 'next/router';
import { useEffect, useCallback } from 'react';


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

  const verifySession = useCallback(async () => {
    const { isValid, session } = await checkSession(role);
    if (!isValid) {
    router.push('/' + role + '/login');
    } else {
      setSession(session);
    }
    setLoading(false);
  }, [router, role, setLoading, setSession]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);
}
