import StudentHeader from "../components/student-components/student-header";
import StudentNavbar from "../components/student-components/student-navbar";
import { SVGProps, useState } from 'react';
import { useSessionValidation } from '../api/auth/checkSession';
import styles from '../../styles/instructor-course-dashboard.module.css';
import { Avatar, BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import router from "next/router";


export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('student', setLoading, setSession);

  if (loading) {
    return <div className='w-[100vh=w] h-[100vh] student flex justify-center text-center items-center my-auto'>
        <Spinner color='primary' size="lg" />
      </div>;
  }
  
  function handleHomeClick(): void {
    router.push("/instructor/dashboard");
  }
  function UserIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  }
  return (
    <>
      <div className={`student text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>Profile</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem>Profile</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.mainContent}>
          <div className={` ${styles.assignmentsSection}`}>
            {/* This is where the data can just be parsed here from the functions to display pofile details here */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardBody className="text-sm font-medium">User Profile</CardBody>
              </CardHeader>
              <CardBody className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <Avatar src="/placeholder-user.jpg" />

                </Avatar>
                <div className="text-2xl font-bold">Username</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">User's email</p>
              </CardBody>
            </Card>

          </div>
          <div className="w-[25%] h-[100%] flex-col p-[1%]">
            <Button color="primary" variant="ghost" className="w-[100%] m-1">Edit Profile</Button>
            <Button color="danger" variant="ghost" className="w-[100%] m-1">Delete Account</Button>
          </div>
        </div>
      </div>

      <StudentNavbar profile={{ className: "bg-secondary-200" }}/>
    </>
  );
}