import type { NextPage } from "next";
import { useState } from "react";
import Link from "next/link";
import style from "../../../styles/instructor-components.module.css";

interface LinkProps {
  href: string;
  title: string;
}

interface InstructorHeaderProps {
  title: string;
  addLink?: LinkProps[];
}

const InstructorHeader: NextPage<InstructorHeaderProps> = ({ title, addLink }) => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isCourseOpen, setCourseOpen] = useState(false);

  const toggleProfileDropdown = () => setProfileOpen(!isProfileOpen);
  const toggleCourseDropdown = () => setCourseOpen(!isCourseOpen);

  return (
    <header className={style.header}>
      <div className={style.navTitle}>
        <h1>
          <i>{title}</i>
        </h1>

      </div>
      {addLink && addLink.map((link, index) => (
        <div key={index} className={style.navItem}>
          <Link href={link.href}><h3>{link.title}</h3></Link>
        </div>
      ))}

      <div
        className={style.navItem}
        onMouseEnter={() => setCourseOpen(true)}
        onMouseLeave={() => setCourseOpen(false)}
      >
        <button onClick={toggleCourseDropdown}>Add</button>
        {isCourseOpen && (
          <div className={style.dropdown}>
            <Link href="#">Create Course</Link>
            <Link href="#">Create Assignment</Link>
            <Link href="#">Join Another Institution</Link>
          </div>
        )}
      </div>
      <div
        className={style.navItem}
        onMouseEnter={() => setProfileOpen(true)}
        onMouseLeave={() => setProfileOpen(false)}
      >
        <button onClick={toggleProfileDropdown}>Profile</button>
        {isProfileOpen && (
          <div className={style.dropdown}>
            <Link href="#">My Profile</Link>
            <Link href="#">Logout</Link>
            <p style={{ backgroundColor: "#00abb3", color: "#e7f5fe" }}>
              Instructor Name
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export default InstructorHeader;
