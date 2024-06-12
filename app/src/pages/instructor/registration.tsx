import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../../styles/instructor-register.module.css';

const SignUp: NextPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
  
    const handleSignUpClick = () => {
        // Handle sign-up logic here
        console.log('User signed up with:', { firstName, lastName, email, password });
      };
    
      return (
        <div className={styles.signUp}>
          <img className={styles.sprintrunner1Icon} alt="Sprintrunner" src="/images/Logo.png" />
          <div className={styles.signUpChild}></div>
          <div className={styles.signUpItem}>
            <div className={styles.createAnAccount}>Create an Account</div>
          </div>
          <div className={`${styles.textInput}`} style={{ top: '200px' }}>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={styles.textInputChild}
            />
          </div>
          <div className={`${styles.textInput}`} style={{ top: '270px' }}>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={styles.textInputChild}
            />
          </div>
          <div className={`${styles.textInput}`} style={{ top: '340px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.textInputChild}
            />
          </div>
          <div className={`${styles.textInput}`} style={{ top: '410px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.textInputChild}
            />
          </div>
          <div className={`${styles.textInput}`} style={{ top: '480px' }}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.textInputChild}
            />
          </div>
          <button className={styles.createEvaluationButton} onClick={handleSignUpClick}>
            <div className={styles.createEvaluationButtonChild}>Sign Up</div>
          </button>
          <p className={styles.pleaseEnterThe}>Please enter the following information:</p>
          <img className={styles.backIcon} alt="Back" src="/images/Back-Arrow.png" />
        </div>
      );
    };
    
    export default SignUp;