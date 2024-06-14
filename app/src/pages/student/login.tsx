import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styles from '../../styles/student-login.module.css';
import { useState } from 'react';

const StudentLogin: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUpClick = async () => {
    // Redirect to the instructor dashboard
    router.push('/student/registration');
  }

  const handleSignInClick = async () => {
    setError('');

    try {
      const response = await fetch('/api/auth/studentLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        // Redirect to the instructor dashboard
        router.push('/student/dashboard');
      } else {
        // Handle error response
        const errorData = await response.json();
        setError(errorData.message || 'Failed to authenticate');
      }
    } catch (error) {
      // Handle network or other errors
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <img className={styles.img1} src="/images/Logo.png" alt="Logo" /> {/* Use relative path */}
      <div className={styles.horizontalLine}></div>
      <div className={styles.loginButton}>
        <div className={styles.loginText}>Student Login</div>
      </div>
      <div className={styles.emailInput}>
        <input 
          type="email" 
          className={styles.inputField} 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      <div className={styles.passwordInput}>
        <input 
          type="password" 
          className={styles.inputField} 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>
      <div className={styles.forgotPassword}>I Forgot My Password</div>
      <div className={styles.signUpPrompt}>
        <span className={styles.signUpText}>Don’t have an account yet?<br/></span>
        <span className={styles.signUpLink} onClick={handleSignUpClick}>Sign up</span>
      </div>
      <div className={styles.signInButton}>
        <div className={styles.signInText} onClick={handleSignInClick}>Sign In</div>
      </div>
    </div>
  );
};

export default StudentLogin;
