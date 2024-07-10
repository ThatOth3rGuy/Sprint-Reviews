import type { NextPage } from "next";
import style from "../../../styles/instructor-components.module.css";
import { useRouter } from "next/router";
import Image from 'next/image';
//TODO: Add logo and images per button

const InstructorNavbar: NextPage = () => {
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
        router.push('/instructor/login');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className={style.navbar}>
      <Image 
    src="/logo-transparent-png.png" 
    alt="SprintRunners Logo"
    width={200}
    height={200}
    />

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
      <div
        className={style.navButton}
        onClick={() => handleNavigation("/admin/portal-home")}
      >
        Admin
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

export default InstructorNavbar;
