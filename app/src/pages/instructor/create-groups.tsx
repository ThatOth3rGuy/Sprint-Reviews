import { useRouter } from "next/router";
import AdminNavbar from "../components/admin-components/admin-navbar";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import styles from '../../styles/instructor-course-dashboard.module.css';
import { Button, Breadcrumbs, BreadcrumbItem, Listbox, ListboxItem, Card, Accordion, AccordionItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@nextui-org/react";
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
  const [groups, setGroups] = useState<Group[]>([]);
  const [isRandomizeModalOpen, setIsRandomizeModalOpen] = useState(false);
  const [groupSize, setGroupSize] = useState<number>(3); // Default group size
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
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchRandomizedGroups = async (groupSize: number) => {
    try {
      const studentIds = students.map(student => student.studentID);
      const response = await fetch(`/api/groups/randomizeGroups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupSize, studentIds }),
      });

      if (response.ok) {
        const data = await response.json();
        const newGroups = data.groups.map((group: number[], index: number) => ({
          groupName: `Group ${index + 1}`,
          members: group.map(id => {
            const student = students.find(student => student.studentID === id);
            return `${student?.firstName} ${student?.lastName}`;
          }),
        }));
        setGroups(newGroups);
        setIsRandomizeModalOpen(false); // Close the modal after successful group randomization
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch randomized groups', errorData);
        alert(errorData.error);
      }
    } catch (error) {
      console.error('Error fetching randomized groups:', error);
    }
  };

  const handleCreateGroups = async () => {
    const groupsData = groups.map((group, index) => {
      return {
        groupNumber: index + 1,
        studentIDs: group.members.map(member => {
          const student = students.find(student => `${student.firstName} ${student.lastName}` === member);
          return student ? student.studentID : null;
        }).filter(studentID => studentID !== null)
      };
    });
  
    console.log('Creating groups:', groupsData);
    console.log('Course ID:', courseId);
  
    try {
      const response = await fetch(`/api/groups/createGroups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groups: groupsData, courseID: courseId }),
      });
  
      if (response.ok) {
        alert('Groups created successfully');
        router.push(`/instructor/course-dashboard?courseId=${courseId}`);
      } else {
        const errorData = await response.json();
        console.error('Failed to create groups', errorData);
        alert(errorData.error);
      }
    } catch (error) {
      console.error('Error creating groups:', error);
    }
  };

  const handleGroupRandomizer = () => {
    setIsRandomizeModalOpen(true); // Open the modal to input group size
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
    router.push("/instructor/dashboard");
  }

  const handleRandomizeGroupsSubmit = () => {
    fetchRandomizedGroups(groupSize);
  };

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
            <Card shadow="sm" className={`${styles.outerCard}`} style={{ overflow: 'auto' }}>
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
            <Card shadow="sm" className={`${styles.outerCard}`} style={{ maxHeight: '80%', overflow: 'auto', minHeight: groups.length > 0 ? '60%' : '10%' }}>
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

        {/* Randomize Groups Modal */}
        <Modal
          className='z-20'
          backdrop="blur"
          isOpen={isRandomizeModalOpen}
          onOpenChange={(open) => setIsRandomizeModalOpen(open)}
        >
          <ModalContent>
            <ModalHeader>Randomize Groups</ModalHeader>
            <ModalBody>
              <Input
                type="number"
                label="Group Size"
                value={groupSize.toString()}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                min={1}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={() => setIsRandomizeModalOpen(false)}>
                Close
              </Button>
              <Button color="primary" onPress={handleRandomizeGroupsSubmit}>
                Randomize
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
