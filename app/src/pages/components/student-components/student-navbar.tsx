import type { NextPage, NextApiResponse } from "next";
import style from "../../../styles/student-components.module.css";
import { useRouter } from "next/router";
import { logout } from "../../../lib";

//TODO: Add logo and images per button

const StudentNavbar: NextPage = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/student/login');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className={style.navbar}>
      <div
        className={style.navButton}
        onClick={() => handleNavigation("/student/dashboard")}
      >
        Home
      </div>
      <div
        className={style.navButton}
        onClick={() => handleNavigation("/student/all-assignments")}
      >
        Assignments
      </div>
      <div
        className={style.navButton}
        onClick={() => handleNavigation("/student/grades")}
      >
        Grades
      </div>
      <div
        className={style.navButton}
        onClick={() => handleNavigation("/student/settings")}
      >
        Settings
      </div>
      <div className={style.logoutWrapper}>
        <div
          className={style.navButton}
          onClick={() => handleLogout()}
        >
          Logout
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
