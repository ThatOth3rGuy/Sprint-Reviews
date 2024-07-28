//archived-courses.tsx
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import AdminCourseCard from "../components/admin-components/admin-course";
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import { useState, useEffect } from 'react';
import { useSessionValidation } from '../api/auth/checkSession';
import styles from '../../styles/admin-portal-home.module.css';
import { useRouter } from 'next/router';
import { Divider, Listbox, ListboxItem, Input, BreadcrumbItem, Breadcrumbs, Spinner } from '@nextui-org/react';


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
        const response = await fetch('/api/courses/getAllArchivedCourses?isArchived=true');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          alert(error.message);
        } else {
          setError(String(error));
          alert(String(error));
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
    return <div className='w-[100vh=w] h-[100vh] instructor flex justify-center text-center items-center my-auto'>
    <Spinner color='primary' size="lg" />
</div>;
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
  const handleViewUsersClick = () => {
    router.push('/admin/view-users');
  };
  const handleJoinRequestClick = () => {
    router.push('/admin/role-requests');
  };
  const handleArchivedCoursesClick = () => {
    router.push('/admin/archived-courses');
  };
  const handleHomeClick = () => {
    router.push('/admin/portal-home');
  };
  const handleAction = (key: any) => {
    switch (key) {
      case "view":
        handleViewUsersClick();
        break;
      case "join":
        handleJoinRequestClick();
        break;
      case "archives":
        handleArchivedCoursesClick();
        break;
      case "admin":
        handleHomeClick();
        break;
      // case "delete":
      //   // Implement delete course functionality
      //   console.log("Delete course");
      //   break;
      default:
        console.log("Unknown action:", key);
    }
  };
  return (
    <>
      <div className={`instructor text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>Archived Courses</h1>
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Admin Dashboard</BreadcrumbItem>
            <BreadcrumbItem>Archived Courses</BreadcrumbItem>
          </Breadcrumbs>        
          <Divider className="my-1" />
        </div>
        <div className={styles.mainContent}>
          <div className={styles.assignmentsSection}>
            {/* TODO: add functionality to search bar to search from all archived courses */}
            <Input className="m-1 mx-4 pr-7" placeholder="Search for course" size="sm" type="search" />

            <div className={styles.courseCards}>
              {courses.map((course, index) => (
                <div className={styles.courseCard} key={course.courseID}>
                  <AdminCourseCard
                    key={course.courseID}
                    courseName={course.courseName}
                    instructor={`${course.instructorFirstName} ${course.instructorLastName}`}
                    averageGrade={course.averageGrade}
                    courseID={course.courseID}
                    isArchived={true}
                    img="/logo-transparent-png.png"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.notificationsSection}>
            <div className={styles.actionButtons}>
              <Listbox aria-label="Actions" onAction={handleAction} color='primary' variant='flat'>
                <ListboxItem key="admin" className='text-primary-900 border-1 border-primary bg-primary-50'>Admin Portal</ListboxItem>
                <ListboxItem key="join">Join Requests</ListboxItem>
                <ListboxItem key="view">View Users</ListboxItem>
              </Listbox>
            </div>
            <hr />
            <h2 className="my-3">Notifications</h2>
            <div className={styles.notificationsContainer}>
              <div className={styles.notificationCard}>Dummy Notification</div>
            </div>
          </div>
          {/* <AdminHeader
        title="Admin Portal"
        addLink={[
          { href: "./view-users", title: "View Users" },
          { href: "./join-requests", title: "Join Requests" },
          { href: "./archived-courses", title: "Archived Courses" },
        ]}
      /> */}
          <AdminNavbar admin={{ className: "bg-primary-500" }} />
        </div>
      </div>
    </>
  );
}
