// instructor/assignments.tsx
/**
* This page displays a comprehensive list of all assignments created by the instructor. 
* It serves as a central hub for instructors to directly access the dashboard of each assignment.
* The page features a filter function that enables users to search for specific types of 
* assignments. Additionally, it provides the course name associated with each assignment.
* 
* @return {JSX.Element} The rendered AssignmentsPage component.
*/

// Importing necessary libraries and components

import { useRouter } from "next/router";
import InstructorAssignmentCard from "../components/instructor-components/instructor-assignment-card";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import styles from '../../styles/instructor-course-dashboard.module.css';
import { Button, Breadcrumbs, BreadcrumbItem, Listbox, ListboxItem, Divider, Checkbox, CheckboxGroup, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import AdminNavbar from "../components/admin-components/admin-navbar";

//Defining interfaces for all assignments created by the instructor 

interface Assignment {
  assignmentID: number;
  title: string;
  description: string;
  deadline: string;
  courseName: string;
  groupAssignment: boolean;
}

export default function AssignmentsPage() {
// Initializing state variables
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [session, setSession] = useState<any>(null);
  const [selectedAssignmentTypes, setSelectedAssignmentTypes] = useState<string[]>(['all']);

// Checking user session

  useSessionValidation('instructor', setLoading, setSession);

// Fetching assignments to display from database 
  useEffect(() => {
    if (session && session.user && session.user.userID) {
      fetchAssignments(session.user.userID); // function or fetching assignments using userID
    }
  }, [session]);

// Checking if user session exists
  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return null;
  }

// function which uses userID to fetch all assignments created by instructor 
// sends userID from session to api/getAllAssignmentsInstructor
 
const fetchAssignments = async (userID: string) => {
    try {
      const response = await fetch(`/api/getAllAssignmentsInstructor?userID=${userID}`);
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.assignments);
        console.log("Setting assignment data: ", data.assignments);
      } else {
        console.error('Failed to fetch assignments');
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };
// front end handler for filtering between assignment types 
  const handleCheckboxChange = (type: string, isChecked: boolean) => {
    if (type === 'all') {
      setSelectedAssignmentTypes(['all']);
    } else {
      setSelectedAssignmentTypes(prevTypes => {
        if (isChecked) {
          return [...prevTypes.filter(t => t !== 'all'), type];
        } else {
          const newTypes = prevTypes.filter(t => t !== type);
          return newTypes.length > 0 ? newTypes : ['all'];
        }
      });
    }
  };

// Navigation handlers
  const handleHomeClick = async () => {
    router.push('/instructor/dashboard');
  };
// Loading Spinner
  if (loading) {
    return (
      <div className='w-[100vw] h-[100vh] flex justify-center items-center'>
        <Spinner color='primary' size="lg" />
      </div>
    );
  }
// function to filter based on assignment type by dynamically rendering 
//the function based on the filter and what function is called
  const individualAssignments = assignments.filter(assignment => !assignment.groupAssignment && !assignment.title.toLowerCase().includes('peer review'));
  const groupAssignments = assignments.filter(assignment => assignment.groupAssignment);
  const peerReviews = assignments.filter(assignment => assignment.title.toLowerCase().includes('peer review'));

  const renderAssignments = (assignments: Assignment[], title: string, color: string, isGroup: boolean) => (
    <>
      <h3 className={styles.innerTitle}>{title}</h3>
      <br />
      <Divider className="instructor bg-secondary" />
      <br />
      <div className={styles.courseCard}>
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div key={assignment.assignmentID} className={styles.courseCard}>
              <InstructorAssignmentCard
                courseID={assignment.assignmentID}
                assignmentName={assignment.title}
                courseName={assignment.courseName}
                deadline={assignment.deadline}
                color={color}
                groupAssignment={isGroup}
              />
            </div>
          ))
        ) : (
          <p>No {title.toLowerCase()} found.</p>
        )}
      </div>
    </>
  );
// default renders all assignments 
  const shouldRenderAssignments = (type: string) => {
    return selectedAssignmentTypes.includes('all') || selectedAssignmentTypes.includes(type);
  };
// Checking if user is an admin
  const isAdmin = session.user.role === 'admin';
// Rendering the component
  return (
    <>
      {isAdmin ? <AdminNavbar assignments={{ className: "bg-primary-500" }} /> : <InstructorNavbar assignments={{ className: "bg-primary-500" }} />}
      <div className={`instructor text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>Assignments</h1>
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem>Assignments</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.assignmentsSection}>
            <CheckboxGroup
              label="Select assignment type:"
              orientation="horizontal"
              color="primary"
              size="sm"
              className="text-left flex-row mb-2 text-primary-900"
              value={selectedAssignmentTypes}
            >
              <Checkbox
                value="all"
                onChange={(e) => handleCheckboxChange('all', e.target.checked)}
                isSelected={selectedAssignmentTypes.includes('all')}
              >
                All Assignments
              </Checkbox>
              <Checkbox
                value="individual"
                onChange={(e) => handleCheckboxChange('individual', e.target.checked)}
                isSelected={selectedAssignmentTypes.includes('individual')}
              >
                Individual Assignments
              </Checkbox>
              <Checkbox
                value="group"
                onChange={(e) => handleCheckboxChange('group', e.target.checked)}
                isSelected={selectedAssignmentTypes.includes('group')}
              >
                Group Assignments
              </Checkbox>
              <Checkbox
                value="peerReviews"
                onChange={(e) => handleCheckboxChange('peerReviews', e.target.checked)}
                isSelected={selectedAssignmentTypes.includes('peerReviews')}
              >
                Peer Reviews
              </Checkbox>
            </CheckboxGroup>

            {shouldRenderAssignments('individual') && renderAssignments(individualAssignments, 'Individual Assignments', '#9fc3cf', false)}
            {shouldRenderAssignments('group') && renderAssignments(groupAssignments, 'Group Assignments', '#9fc3cf', true)}
            {shouldRenderAssignments('peerReviews') && renderAssignments(peerReviews, 'Peer Reviews', '#9fc3cf', false)}
          </div>
          <div className={styles.notificationsSection}>
            <h2>Notifications</h2>
            <div className={styles.notificationsContainer}>
              <div className={styles.notificationCard}>Dummy Notification</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
