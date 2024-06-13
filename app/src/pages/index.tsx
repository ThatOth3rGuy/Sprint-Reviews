import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/landing.module.css';

export default function Page() {
  return (
    <div className={styles.roleSelection}>
      <header className={styles.roleButton}>Select Your Role</header>
      <Image 
        className={styles.image} 
        src="/sprintrunner.png" 
        alt="SprintRunners Logo"
        width={363}
        height={330}
      />
      <div className={styles.line}></div>
      <p className={styles.description}>Choose from below to continue to sign up</p>
      <p className={styles.iAmA}>I am a:</p>
      <div className={styles.roleButtons}>
        <Link href="/home/student">
          <button className={styles.studentButton}>Student</button>
        </Link>
        <Link href="/home/instructor">
          <button className={styles.instructorButton}>Instructor</button>
        </Link>
      </div>
    </div>
  );
}