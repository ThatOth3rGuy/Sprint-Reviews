import { useRouter } from "next/router";
import AdminNavbar from "../components/admin-components/admin-navbar";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import styles from '../../styles/instructor-course-dashboard.module.css';
import { Button, Breadcrumbs, BreadcrumbItem, Listbox, ListboxItem, Card, Accordion, AccordionItem, SelectItem, Select } from "@nextui-org/react";
import { useSessionValidation } from '../api/auth/checkSession';
import React, { useState, useEffect } from 'react';

interface Assignment {
  assignmentID: number;
  title: string;
  description: string;
  deadline: string;
}

interface Student {
  studentID: number;
  firstName: string;
  lastName: string;
}

interface Group {
  groupName: string;
  members: string[];
}

export default function CreateGroup() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const { courseId } = router.query;
  
  useSessionValidation('instructor', setLoading, setSession);

  useEffect(() => {
    if (session && session.user && session.user.userID && courseId) {
      fetchStudents(courseId as string);
    }
  }, [session, courseId]);

  const fetchStudents = async (courseId: string) => {
    try {
      const response = await fetch(`/api/getStudentByCourse?courseId=${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data.student || []);
        console.log(data.student);
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const groups: Group[] = [
    { groupName: 'Group 1', members: ['Student 1', 'Student 2'] },
    { groupName: 'Group 2', members: ['Student 3', 'Student 4'] },
  ];

  const handleCreateGroups = () => {
    router.push('/instructor/create-groups');
  };

  const handleGroupRandomizer = () => {
    router.push('/instructor/create-groups');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return null;
  }

  const isAdmin = session.user.role === 'admin';

  const handleAction = (key: any) => {
    switch (key) {
      case "create":
        handleCreateGroups();
        break;
      case "peer-review":
        handleGroupRandomizer();
        break;
      default:
        console.log("Unknown action:", key);
    }
  };

  const handleHomeClick = async () => {
    router.push("/instructor/dashboard")
  }

  return (
    <>
      {isAdmin ? <AdminNavbar /> : <InstructorNavbar />}
      <div className={`instructor text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>Create Groups</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem>Create Student Groups</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.mainContent}>
          <div className={`flex flex-row items-center justify-center ${styles.assignmentsSection}`}>
            <Card shadow="sm" className={`${styles.outerCard}`}>
              <h2>All Students</h2>
              <Listbox>
                {students.length > 0 ? (
                  students.map((student) => (
                    <ListboxItem key={student.studentID}>{student.firstName} {student.lastName}</ListboxItem>
                  ))
                ) : (
                  <ListboxItem key=''>No students available</ListboxItem>
                )}
              </Listbox>
            </Card>
            <Card shadow="sm" className={`${styles.outerCard}`}>
              <h2>Groups</h2>
              <Accordion variant="bordered">
                {groups.map((group, index) => (
                  <AccordionItem key={index} aria-label={group.groupName} title={group.groupName}>
                    {group.members.join(', ')}
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
          <div className={styles.notificationsSection}>
            <Listbox aria-label="Actions" onAction={handleAction}>
              <ListboxItem key="create">Create Group</ListboxItem>
              <ListboxItem key="peer-review">Randomize Groups</ListboxItem>
            </Listbox>
            <Button color="primary" variant="ghost">Edit groups</Button>
            <Button color="danger" variant="ghost">Remove groups </Button>
          </div>
        </div>
      </div>
    </>
  );
}
