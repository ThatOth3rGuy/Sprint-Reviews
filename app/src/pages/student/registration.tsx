// Student Registration
// src/pages/student/registration.tsx

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../../styles/student-register.module.css';

const SignUp: NextPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [institution, setInstitution] = useState('');
    const router = useRouter();
  
    const handleSignUpClick = async () => {
        // Reference any additional necessary authentification logic here


        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/api/addStudent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, email, password, role: 'student', institution })
            });

            if (response.ok) {
                router.push('/student/login');
            } else {
                const errorData = await response.json();
                alert(errorData.error);
            }
        } catch (error) {
            alert('Failed to sign up');
        }
    };

    const handleLoginClick = () => {
        // Redirect user to login page
        router.push('/student/login');
    }
    
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
        <div className={`${styles.textInput}`} style={{ top: '550px' }}>
        <input
          type="institution"
          placeholder="Institution"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          className={styles.textInputChild}
        />
        </div>
        <button className={styles.createEvaluationButton} onClick={handleSignUpClick}>
        <div className={styles.createEvaluationButtonChild}>Sign Up</div>
        </button>
        <p className={styles.pleaseEnterThe}>Please enter the following information:</p>
        <div className={styles.loginPrompt}>
            <span className={styles.loginText}>Already have an account?<br/></span>
            <span className={styles.loginLink} onClick={handleLoginClick}>Login</span>
        </div>
      </div>
    );
    };
    
    export default SignUp;