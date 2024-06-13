import type { NextPage } from "next";
import { useCallback } from "react";
import Link from "next/link";
import style from "../../../styles/student-components.module.css";

//TODO: Add logo and images per button

const StudentNavbar: NextPage = () => {
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
      <div className={style.navButton}>
        <Link href="#">Logout</Link>
      </div>
      
    </nav>
  );
};

export default StudentNavbar;
