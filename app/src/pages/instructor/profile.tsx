import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import { JSX, SVGProps, useState } from 'react';
import { useSessionValidation } from '../api/auth/checkSession';
import styles from '../../styles/instructor-course-dashboard.module.css';
import { CardBody, User, Avatar, AvatarIcon, SelectItem, Select, Listbox, ListboxItem, AutocompleteItem, Autocomplete, Textarea, Button, Breadcrumbs, BreadcrumbItem, Divider, Checkbox, CheckboxGroup, Progress, Input, Link, CardHeader, Card, Spinner } from "@nextui-org/react";
import router from "next/router";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('instructor', setLoading, setSession);

  if (loading) {
    return <div className='w-[100vh=w] h-[100vh] instructor flex justify-center text-center items-center my-auto'>
    <Spinner color='primary' size="lg" />
</div>;
  }

  // If the session exists, check if the user is an admin
  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return;
  }
  const isAdmin = session.user.role === 'admin';
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
      {isAdmin ? <AdminNavbar profile={{ className: "bg-primary-500" }} /> : <InstructorNavbar profile={{ className: "bg-primary-500" }} />}
      <div className={`instructor text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>Profile</h1>
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem>Profile</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.mainContent}>
          <div className={` ${styles.assignmentsSection}`}>
            {/* <div className="flex flex-col w-full min-h-screen"> */}

            {/* <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10"> */}
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

    </>
  );
}