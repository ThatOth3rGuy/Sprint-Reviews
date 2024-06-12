import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import styles from '../../styles/instructor-register.module.css';


const SignUp:NextPage = () => {
  	const router = useRouter();

  	const onCreateEvaluationButtonClick = useCallback(() => {
    		// Register user to database and redirect to dashboard
  	}, []);
  	
  	
  	const onBackImageClick = () => {
    		// Redirect to Landing page
            router.push('/instructor/login')
  	};
  	
  	return (
    		<div className={styles.signUp}>
      			<img className={styles.sprintrunner1Icon} alt="" src="/images/Logo.png" />
      			<div className={styles.signUpChild} />
      			<div className={styles.signUpItem} />
      			<b className={styles.createAnAccount}>Create an Account</b>
      			<div className={styles.textInput}>
        				<div className={styles.textInputChild} />
        				<b className={styles.firstName}>First Name</b>
      			</div>
      			<div className={styles.textInput1}>
        				<div className={styles.textInputChild} />
        				<b className={styles.firstName}>Password</b>
      			</div>
      			<div className={styles.textInput2}>
        				<div className={styles.textInputChild} />
        				<b className={styles.firstName}>Email</b>
      			</div>
      			<div className={styles.textInput3}>
        				<div className={styles.textInputChild} />
        				<b className={styles.firstName}>Last Name</b>
      			</div>
      			<div className={styles.createEvaluationButton} onClick={onCreateEvaluationButtonClick}>
        				<div className={styles.createEvaluationButtonChild} />
        				<b className={styles.createEvaluation}>Sign Up</b>
      			</div>
      			<b className={styles.pleaseEnterThe}>Please enter the following information:</b>
      			<img className={styles.backIcon} alt="" src="/images/Back-Arrow.png" onClick={onBackImageClick} />
    		</div>);
};

export default SignUp;
