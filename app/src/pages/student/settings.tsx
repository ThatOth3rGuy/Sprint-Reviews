import StudentHeader from "../components/student-components/student-header";
import StudentNavbar from "../components/student-components/student-navbar";
import { useState } from 'react';
import { useSessionValidation } from '../api/auth/checkSession';
import styles from '../../styles/instructor-course-dashboard.module.css';
import { Breadcrumbs, BreadcrumbItem, Switch, Spinner } from "@nextui-org/react";
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
  return (
    <>
      <div className={`student text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>Settings</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem>Settings</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.mainContent}>
          <div className={` ${styles.assignmentsSection}`}>
            <h3>Customization Settings Below</h3>
            <br />
            <p>This will be a place where user can customize any changes that they may want to make.</p>
            <Switch defaultSelected className="m-1">
              Assignment Notifications
            </Switch>
            <Switch defaultSelected className="m-1">
              Peer Review Notifications
            </Switch>
            <Switch defaultSelected className="m-1">
              Deadline Notifications
            </Switch>
            <Switch defaultSelected className="m-1">
              Peer Evaluation Notifications
            </Switch>
            <Switch defaultSelected className="m-1">
              Feedback Notifications
            </Switch>
          </div>
          <div className="w-[25%] h-[100%] flex-col p-[1%] text-left">
            {/* Add buttons as needed */}
            
          </div>
        </div>
      </div>
      <StudentNavbar settings={{ className: "bg-secondary-200" }} />
    </>
  );
}