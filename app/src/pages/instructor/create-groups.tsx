import { useRouter } from "next/router";
import AdminNavbar from "../components/admin-components/admin-navbar";
import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import styles from '../../styles/instructor-course-dashboard.module.css';
import { Button, Breadcrumbs, BreadcrumbItem, Listbox, ListboxItem, Divider, Checkbox, CheckboxGroup, Progress, Card, CardBody,CardFooter,Accordion, AccordionItem, SelectItem, Select, Spinner } from "@nextui-org/react";
import { useSessionValidation } from '../api/auth/checkSession';
import React, { useState, useEffect } from 'react';

interface Assignment {
  assignmentID: number;
  title: string;
  description: string;
  deadline: string;
  courseID: number;
}

export default function CreateGroup() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [courseName, setCourseName] = useState<string>("");
  
  useSessionValidation('instructor', setLoading, setSession);
  const students = ['Student 1', 'Student 2', 'Student 3', 'Student 4', 'Student 5'];

//Get course name for breadcrumbs
useEffect(() => {
  const { source, courseId } = router.query;

  if (source === 'course' && courseId) {
    // Fetch course name
    fetchCourseName(courseId as string);
  }
}, [router.query]);

const fetchCourseName = async (courseId: string) => {
  try {
    const response = await fetch(`/api/courses/${courseId}`);
    if (response.ok) {
      const data = await response.json();
      setCourseName(data.courseName);
    }
  } catch (error) {
    console.error('Error fetching course name:', error);
  }
};




  // Dummy groups
  const groups = [
    { groupName: 'Group 1', members: ['Student 1', 'Student 2'] },
    { groupName: 'Group 2', members: ['Student 3', 'Student 4'] },
  ];

  const handleCreateGroups = () => { // Add Group  creation from instructor input 
    router.push('/instructor/create-groups');
  };

  const handleGroupRandomizer = () => {
    router.push('/instructor/create-groups'); //Add Native Randomizer logic here
    
  };
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
  };

  if(loading){
    <div className='w-[100vh=w] h-[100vh] instructor flex justify-center text-center items-center my-auto'>
    <Spinner color='primary' size="lg" />
</div>;
  }
  const handleBackClick= async () =>{
    const { source } = router.query;
    if (source === 'course') {
      router.push(`/instructor/course-dashboard?courseId=${router.query.courseId}`);
    }
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
            <BreadcrumbItem onClick={handleBackClick}>{router.query.source === 'course' ? courseName : 'Course Dashboard'}</BreadcrumbItem> 
            <BreadcrumbItem>Create Student Groups</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.mainContent}>
          <div className={`flex flex-row items-center justify-center  ${styles.assignmentsSection}`}>
            <Card shadow="sm" className={`${styles.outerCard}`}>
              <h2>All Students</h2>
              <Listbox>
                {students.map((student, index) => (
                  <ListboxItem key={index}>{student}</ListboxItem>
                ))}
              </Listbox>
            </Card>
            <Card shadow="sm" className={`${styles.outerCard}`}>
              {/* These will be subject to change as per how we want to receive input  */}
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
          {/* These Pull the courses for creating groups. Still Work In progress */}

          <div className={styles.notificationsSection}>
            <Select
            label=" Select Course"
            >
              <SelectItem key={""}>Course 1</SelectItem>
            </Select>
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