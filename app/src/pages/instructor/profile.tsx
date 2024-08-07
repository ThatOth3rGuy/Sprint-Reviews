// instructor/profile.tsx
/**
 * Renders the user profile page for instructors. Fetches user details from the server
 * and displays them in a card. Allows instructors to edit user details by opening a modal
 * with input fields for first name, last name, and email. When changes are saved, the
 * server is updated with the new details and the page is reloaded.
 *
 * @return {JSX.Element|null} The user profile page or null if the user is not logged in.
 */
import React, { useState, useEffect } from 'react';
import {
  Card, CardHeader, CardBody, Avatar, Button, Spinner, Modal,
  ModalContent, ModalHeader, ModalBody, ModalFooter, Input
} from "@nextui-org/react";
import { useSessionValidation } from '../api/auth/checkSession';
import styles from '../../styles/instructor-course-dashboard.module.css';
import AdminNavbar from '../components/admin-components/admin-navbar';
import InstructorNavbar from '../components/instructor-components/instructor-navbar';
import router from 'next/router';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedDetails, setEditedDetails] = useState({
    fname: '',
    lname: '',
    email: '',
    instructorID: ''
  });

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('instructor', setLoading, setSession);

  // function to fetch instructor details from user table and instructor table 
  // sends userID to api/userInfo/instructor-user-details.ts to fetch user details
  useEffect(() => {
    console.log('Session:', session);
    if (session?.user?.userID) {
      fetch(`/api/userInfo/instructor-user-details?userID=${session.user.userID}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          console.log('Response:', response);
          return response.json();
        })
        .then(data => {
          setUserDetails(data);
          setEditedDetails({
            fname: data.firstName,
            lname: data.lastName,
            email: data.email,
            instructorID: data.instructorID || '', // Ensure instructorID is properly handled
          });
          console.log('User details:', data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
          setLoading(false);
        });
    }
  }, [session]);
//  functions handling navigation
  const handleBackClick = async () => {
    // Redirect to the landing page
    router.back();
  }

  // function to handle editing of profile 
  // sends update query to api/userInfo/instructor-user-details.ts
  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDetails({
      ...editedDetails,
      [e.target.name]: e.target.value
    });
  };
  const handleSaveChanges = async () => {
    try {
      const response = await fetch('/api/userInfo/instructor-user-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: session.user.userID,
          firstName: editedDetails.fname,
          lastName: editedDetails.lname,
          email: editedDetails.email,
          instructorID: editedDetails.instructorID // Ensure instructorID is included in the PUT request
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserDetails(updatedUser);
        console.log('User details updated successfully', updatedUser);
        setIsEditModalOpen(false);
        router.reload();
      } else {
        console.error('Failed to update user details');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  // Loading Spinner

  if (loading) {
    return (
      <div className='w-[100vh=w] h-[100vh] instructor flex justify-center text-center items-center my-auto'>
        <Spinner color='primary' size="lg" />
      </div>
    );
  }
// check if session data exists 
  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return null;
  }
// admin check 
  const isAdmin = session.user.role === 'admin';
  
// Renders the components 
  return (
    <>
      {isAdmin ? <AdminNavbar profile={{ className: "bg-primary-500" }} /> : <InstructorNavbar profile={{ className: "bg-primary-500" }} />}

      <div className={`instructor text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>User Profile</h1>
          <br />
          <img className="m-0 mr-2 object-cover cursor-pointer w-[2vw] h-[2vw]" alt="Back" src="/Images/Instructor/Back.png" onClick={handleBackClick} aria-label='Back to Landing Page' />


        </div>
        <div className={styles.mainContent}>
          <div className={styles.assignmentsSection}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardBody className="text-sm font-medium">User Profile</CardBody>
              </CardHeader>
              <CardBody className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <Avatar src="/placeholder-user.jpg" />
                </Avatar>
                {userDetails && (
                  <>
                    <div className="text-2xl font-bold">{`${userDetails.firstName} ${userDetails.lastName}`}</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{userDetails.email}</p>
                    {userDetails.instructorID && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">Instructor ID: {userDetails.instructorID}</p>
                    )}
                  </>
                )}
              </CardBody>
            </Card>
            <div>
              <Button color="primary" variant="ghost" className="w-[100%] m-1" onClick={handleEditClick}>Edit Profile</Button>
            </div>
          </div>

          <Modal className='z-20'
            backdrop="blur"
            isOpen={isEditModalOpen}
            onOpenChange={(open) => setIsEditModalOpen(open)}>
            <ModalContent>
              <ModalHeader>Edit Profile</ModalHeader>
              <ModalBody>
                <Input
                  label="First Name"
                  name="fname"
                  value={editedDetails.fname}
                  onChange={handleInputChange}
                />
                <Input
                  label="Last Name"
                  name="lname"
                  value={editedDetails.lname}
                  onChange={handleInputChange}
                />
                <Input
                  label="Email"
                  name="email"
                  value={editedDetails.email}
                  onChange={handleInputChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={handleSaveChanges}>Save Changes</Button>
                <Button color="danger" variant="light" onClick={handleCloseModal}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </>
  );
}
