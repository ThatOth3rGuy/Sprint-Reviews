import type { NextPage } from "next";
import Link from "next/link";
import style from "../../../styles/instructor-components.module.css";
import { useRouter } from "next/router";

//TODO: Add logo and images per button

const InstructorNavbar: NextPage = () => {
  const router = useRouter();

  const handleLogoutClick = () => {
    // Redirect user to login page
    router.push("/instructor/login");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav className={style.navbar}>
      <div
        className={style.navButton}
        onClick={() => handleNavigation("/instructor/dashboard")}
      >
        Home
      </div>
      <div
        className={style.navButton}
        onClick={() => handleNavigation("/instructor/assignments")}
      >
        Assignments
      </div>
      <div
        className={style.navButton}
        onClick={() => handleNavigation("/instructor/overall-performance")}
      >
        Grades
      </div>
      <div
        className={style.navButton}
        onClick={() => handleNavigation("/instructor/settings")}
      >
        Settings
      </div>
      <div className={style.logoutWrapper} onClick={handleLogoutClick}>
        <div
          className={style.navButton}
          onClick={() => handleNavigation("/instructor/login")}
        >
          Logout
        </div>
      </div>
    </nav>
  );
};

export default InstructorNavbar;
