import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styles from '../styles/studentLogin.module.css';
import { useState } from 'react';

const StudentLogin: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUpClick = () => {
    router.push('/student');
  };

  return (
    <div className={styles.container}>
      <img className={styles.img1} src="https://via.placeholder.com/300x275" alt="Placeholder" />
      <div className={styles.horizontalLine}></div>
      <div className={styles.loginButton}>
        <div className={styles.loginText}>Login</div>
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
        <div className={styles.signInText}>Sign In</div>
      </div>
      <img className={styles.img2} src="https://via.placeholder.com/100x100" alt="Placeholder" />
    </div>
  );
};

export default StudentLogin;

