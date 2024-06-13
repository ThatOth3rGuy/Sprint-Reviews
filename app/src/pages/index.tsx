import Link from 'next/link';
import styles from '../styles/index.module.css'; // Assuming you have or will create a CSS module for styling
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

export default function Page() {
  return (
    <div className={styles.roleSelection}>
      <header className={styles.roleButton}>Select Your Role</header>
      <p>I am a</p>
      <div className={styles.roleButtons}>
        <Link href="">
          <button className={styles.studentButton}>Student</button>
        </Link>
        <Link href="/instructor/">
          <button className={styles.instructorButton}>Instructor</button>
        </Link>
      </div>
      <span>
      <GoogleLogin
  onSuccess={credentialResponse => {
    if (credentialResponse?.credential) {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log(decoded); // Do something with the decoded credential here this is to be used to confirm Login or registration
    }
  }}
  onError={() => {
    console.log('Login Failed');
  }}
  useOneTap
/>

      </span>
    </div>
  );
}
