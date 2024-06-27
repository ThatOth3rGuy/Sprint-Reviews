import AdminCourseCard from "../components/admin-components/admin-course";
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import { useState } from 'react';
import { useSessionValidation } from '../api/auth/checkSession';
import styles from '../../styles/admin-portal-home.module.css';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('admin', setLoading, setSession);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
    <div className={styles.adminHome}>
      <b className={styles.breadcrumbs}>Dashboard / Admin Portal</b>
      <div className={styles.filtersort}>
        <div className={styles.filterButton}>
          <div className={styles.filterButtonChild} />
          <div className={styles.filter}>
            <b className={styles.filter1}>Filter</b>
            <img className={styles.filterIcon} alt="" src="/Images/Filter.png" />
          </div>
        </div>
        <div className={styles.sortButton}>
          <div className={styles.filterButtonChild} />
          <div className={styles.sort}>
            <b className={styles.sort1}>Sort</b>
            <img className={styles.descendingSortingIcon} alt="" src="/Images/Descending Sorting.png" />
          </div>
        </div>
      </div>
      <br />
      <br />
      <i className={styles.institution}>Institution</i>
      <AdminCourseCard />
      <AdminCourseCard />
    </div>
      <AdminHeader title="Admin Portal"
      addLink={[{href: "./view-users", title: "View Users"}, {href: "./join-requests", title: "Join Requests"}, {href: "./archived-courses", title: "Archived Courses"}]}/>
      <AdminNavbar />
    </>
  );
}
