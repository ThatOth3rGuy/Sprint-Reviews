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
import { Divider, Listbox, ListboxItem } from "@nextui-org/react";

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
  const handleCreateAssignmentClick = () => {
    router.push('/instructor/create-assignment');
  };
  const handleCreatePeerReviewAssignmentClick = () => {
    router.push('/instructor/release-assignment');
  };
  const handleCreateGroupPeerReviewAssignmentClick = () => {
    router.push('/instructor/create-assignment');
  };
  const handleAction = (key: any) => {
    switch (key) {
      case "create":
        handleCreateAssignmentClick();
        break;
      case "peer-review":
        handleCreatePeerReviewAssignmentClick();
        break;
      case "group-review":
        handleCreateGroupPeerReviewAssignmentClick();
        break;
      case "delete":
        // Implement delete course functionality
        console.log("Delete course");
        break;
      default:
        console.log("Unknown action:", key);
    }
  };
  return (
    <>
      <div className={`instructor text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>Admin Dashboard</h1>
          {/* <Button size='sm' color="secondary" variant='ghost' className=' self-end' onClick={handleCreateCourseClick}>Create Course</Button> */}
        </div>
        <div className={styles.mainContent}>
        <div className={styles.assignmentsSection}>
          <div className="text-left mx-2 mt-0 ">
            <h3>Courses</h3>
            <Divider className="my-1"/>
          </div>
        <div className={styles.courseCards}>
            {courses.map((course, index) => (
              <div className={styles.courseCard}>
                <AdminCourseCard
                key={index}
                courseName={course.courseName}
                instructor={`${course.instructorFirstName} ${course.instructorLastName}`}
                averageGrade={course.averageGrade}
                courseID={course.courseID}
                img="/logo-transparent-png.png"
              />
              </div>
            ))}
          </div>
        </div>
          
          <div className={styles.notificationsSection}>
            <div className={styles.actionButtons}>
              <Listbox aria-label="Actions" onAction={handleAction}>
                <ListboxItem key="create">Create Assignment</ListboxItem>
                <ListboxItem key="peer-review">Create Peer Review</ListboxItem>
                <ListboxItem key="group-review">Create Group Peer Review</ListboxItem>
                <ListboxItem key="delete" className="text-danger" color="danger">
                  Archive Course
                </ListboxItem>
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
          <AdminNavbar />
        </div>
        </div>
      </>
      );
}
