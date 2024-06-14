import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/landing.module.css';


const Landing: NextPage = () => {
  const router = useRouter();

  const handleStudentClick = () => {
    // Redirect user to login page
    router.push('/home/student');
  }

  const handleInstructorClick = () => {
    // Redirect user to login page
    router.push('/home/instructor');
  }

    return (
      <div className={styles.roleSelection}>
        <header className={styles.roleButton}>Select Your Role</header>
        <Image 
          className={styles.image} 
          src="/Logo.png" 
          alt="SprintRunners Logo"
          width={363}
          height={330}
        />
        <div className={styles.line}></div>
        <p className={styles.description}>Choose from below to continue to sign up</p>
        <p className={styles.iAmA}>I am a:</p>
        <div className={styles.roleButtons}>
          <button className={styles.studentButton} onClick={handleStudentClick}>Student</button>
          <button className={styles.instructorButton} onClick={handleInstructorClick}>Instructor</button>
        </div>
      </div>
    );
  }

  export default Landing;
