import type { NextPage } from "next";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import style from "../../../styles/instructor-components.module.css";

interface LinkProps {
  href: string;
  title: string;
}

interface AdminHeaderProps {
  title: string;
  addLink?: LinkProps[];
}

const AdminHeader: NextPage<AdminHeaderProps> = ({ title, addLink }) => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isCourseOpen, setCourseOpen] = useState(false);
  const router = useRouter();
  
  const toggleProfileDropdown = () => setProfileOpen(!isProfileOpen);
  const toggleCourseDropdown = () => setCourseOpen(!isCourseOpen);

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
            <Link href="/instructor/create-course">Create Course</Link>
            <Link href="/instructor/create-assignment">Create Assignment</Link>
            <Link href="/admin/assign-role">Assign Roles to User</Link>
            <Link href="/admin/create-institution">Create Institution</Link>
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
            <Link href="/instructor/settings">My Profile</Link>
            <a href="#" onClick={handleLogout}>Logout</a>
            <p style={{ backgroundColor: "#00abb3", color: "#e7f5fe" }}>
              Instructor Name
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
