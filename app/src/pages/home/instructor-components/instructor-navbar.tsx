import type { NextPage } from "next";
import Link from "next/link";
import style from "../../../styles/instructor-components.module.css";
import { useRouter } from 'next/router';


//TODO: Add logo and images per button

const InstructorNavbar: NextPage = () => {
  const router = useRouter();

  const handleLogoutClick = () => {
    // Redirect user to login page
    router.push('/instructor/login');
  }

  return (
    <nav className={style.navbar}>
      <div className={style.navButton}>
        <Link href="#">Home</Link>
      </div>
      <div className={style.navButton}>
        <Link href="#">Assignments</Link>
      </div>
      <div className={style.navButton}>
        <Link href="#">Grades</Link>
      </div>
      <div className={style.navButton}>
        <Link href="#">Settings</Link>
      </div>
      <div className={style.logoutWrapper} onClick={handleLogoutClick}>
        <div className={style.navButton}>
          <Link href="#">Logout</Link>
        </div>
      </div>
    </nav>
  );
};

export default InstructorNavbar;