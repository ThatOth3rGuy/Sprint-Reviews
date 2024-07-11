import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/landing.module.css';
import React, { useEffect } from 'react';
import {Button, ButtonGroup} from "@nextui-org/react";
import {Divider} from "@nextui-org/react";

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

  return (
<div style={{background: 'linear-gradient(to right, #265652, #4c5699)', minHeight: '100vh'}}>      <br /><br /><br /><br />

      <div className={styles.roleSelection}>
      <br /><br/><br /><br />
        <Image 
          style={{
            display: 'flex',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: 'none'
          }}  
          src="/logo-transparent-png.png" 
          alt="SprintRunners Logo"
          width={145}
          height={145}
        />
        <h2 className={styles.roleButton}>Select Your Role</h2>
        <Divider />
        <p className={styles.description}>Choose your role from below to continue:</p>
        <div className="flex gap-2 items-center justify-evenly">
          <Button color="primary" variant="ghost" size = "lg" className="student" onClick={handleStudentClick}>Student</Button><br />
          <Button color="primary" variant="ghost" size = "lg" className="instructor" onClick={handleInstructorClick}>Instructor</Button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
