import Link from 'next/link';
import styles from '../styles/index.module.css'; // Assuming you have or will create a CSS module for styling

export default function Page() {
  return (
    <div className={styles.roleSelection}>
      <header className={styles.roleButton}>Select Your Role</header>
      <p>I am a</p>
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
