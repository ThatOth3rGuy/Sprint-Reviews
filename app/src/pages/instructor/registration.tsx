import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../../styles/instructor-register.module.css';
import { GoogleLogin } from '@react-oauth/google'; // import GoogleLogin
import jwtDecode from 'jwt-decode'; // import jwtDecode

const SignUp: NextPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleSignUpClick = async () => {
        // Reference any additional necessary authentification logic here

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/api/addInstructor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, email, password, role: 'instructor' })
            });

            if (response.ok) {
                router.push('/instructor/login');
            } else {
                const errorData = await response.json();
                alert(errorData.error);
            }
        } catch (error) {
            alert('Failed to sign up');
        }
    };

    const handleBackClick = () => {
        // Redirect user to login page
        router.push('/instructor/login');
    };

    const handleGoogleSuccess = (credentialResponse) => {
        if (credentialResponse?.credential) {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log(decoded);
            // After successful Google authentication, redirect to dashboard
            router.push('/dashboard');
        }
    };

    const handleGoogleError = () => {
        console.log('Login Failed');
    };
    
    return (
      <div className={styles.signUp}>
        <img className={styles.sprintrunner1Icon} alt="Sprintrunner" src="/images/Logo.png" />
        <div className={styles.signUpChild}></div>
        <div className={styles.signUpItem}>
          <div className={styles.createAnAccount}>Create an Account</div>
        </div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
        />

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
        <img className={styles.backIcon} alt="Back" src="/images/Back-Arrow.png" onClick={handleBackClick}/>
      </div>
    );
};

export default SignUp;