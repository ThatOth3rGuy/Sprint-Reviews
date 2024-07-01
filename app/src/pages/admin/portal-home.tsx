//portal-home.tsx
/* eslint-disable @next/next/no-img-element */
import AdminCourseCard from "../components/admin-components/admin-course";
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import { useState, useEffect } from 'react';
import { useSessionValidation } from '../api/auth/checkSession';
import styles from '../../styles/admin-portal-home.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Course {
  courseID: number;
  courseName: string;
  instructorFirstName: string;
  instructorLastName: string;
  averageGrade: number | null;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useSessionValidation('admin', setLoading, setSession);

  // Get all courses from database to display in course cards
  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/getAllCourses?isArchived=false');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    }

    if (!loading) {
      fetchCourses();
    }
  }, [loading]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleCourseClick = (courseID: number) => {
    router.push({
      pathname: '/instructor/course-dashboard',
      query: { courseID },
    });
  };

  return (
    <>
      <div className={styles.adminHome}>
      <nav className={`${styles.breadcrumbsBase} ${styles.breadcrumbs}`}>

          <Link href="/instructor/dashboard">Dashboard</Link>
          {' / '}
          <Link href="/admin/portal-home">Admin Portal</Link>
        </nav>
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
        {courses.map((course, index) => (
          <AdminCourseCard
            key={index}
            courseName={course.courseName}
            instructor={`${course.instructorFirstName} ${course.instructorLastName}`}
            averageGrade={course.averageGrade}
            courseID={course.courseID}
            onClick={() => handleCourseClick(course.courseID)}
          />
        ))}
      </div>
      <AdminHeader
        title="Admin Portal"
        addLink={[
          { href: "./view-users", title: "View Users" },
          { href: "./join-requests", title: "Join Requests" },
          { href: "./archived-courses", title: "Archived Courses" },
        ]}
      />
      <AdminNavbar />
    </>
  );
}
