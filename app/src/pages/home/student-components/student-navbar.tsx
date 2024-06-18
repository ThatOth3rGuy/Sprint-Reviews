import type { NextPage } from "next";
import Link from "next/link";
import style from "../../../styles/student-components.module.css";
import { useRouter } from "next/router";

//TODO: Add logo and images per button

const StudentNavbar: NextPage = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
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
          onClick={() => handleNavigation("/student/login")}
        >
          Logout
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
