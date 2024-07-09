import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/landing.module.css';
import React, { useEffect } from 'react';


const Landing: NextPage = () => {
  const router = useRouter();

  const handleStudentClick = () => {
    // Redirect user to login page
    router.push('/student/login');
  }

  const handleInstructorClick = () => {
    // Redirect user to login page
    router.push('/instructor/login');
  }
  // const initializeDb = async () => {
  //   try {
  //     const response = await fetch('/api/dbInit', { method: 'POST' });
  //     const data = await response.json();
  //     console.log(data.message); // Log success message or handle it as needed
  //   } catch (error) {
  //     console.error('Failed to initialize database'); // Log or handle error
  //   }
  // };

  // // useEffect hook to run on component mount
  // useEffect(() => {
  //   initializeDb();
  // }, []); // The empty array ensures this effect runs only once on mount

    return (
      <>
     
      <br /><br /><br />
      <div className={styles.roleSelection}>
        <Image 
          className={styles.image} 
          src="/Logo.png" 
          alt="SprintRunners Logo"
          width={150}
          height={150}
        />
        <h2 className={styles.roleButton}>Select Your Role</h2>
        <hr />
        <p className={styles.description}>Choose from below to continue to sign up:</p>
        {/* <p className={styles.iAmA}>I am a:</p> */}
        <div className={styles.roleButtons}>
        
          <button className={styles.studentButton} onClick={handleStudentClick}>Student</button><br />
          <button className={styles.instructorButton} onClick={handleInstructorClick}>Instructor</button>
        </div>
      </div>
      </>
      
    );
  }

  export default Landing;
