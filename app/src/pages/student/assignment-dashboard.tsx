//assignment-dashboard.tsx
import { useRouter } from "next/router";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import AssignmentDetailCard from '../components/instructor-components/instructor-assignment-details';
import styles from "../../styles/AssignmentDetailCard.module.css";
import { Button, Breadcrumbs, BreadcrumbItem, Listbox, ListboxItem, Divider, Checkbox, CheckboxGroup, Progress, Spinner, Link } from "@nextui-org/react";
import StudentNavbar from "../components/student-components/student-navbar";
import StudentAssignmentView from "../components/student-components/student-assignment-details";
import SubmitAssignment from "../components/student-components/student-submit-assignment";

interface Assignment {
    assignmentID: number;
    title: string;
    descr: string;
    deadline: string;
    allowedFileTypes: string;
}

interface CourseData {
    courseID: string;
    courseName: string;
}
interface AssignmentDashboardProps {
    courseId: string;
}
export default function AssignmentDashboard({ courseId }: AssignmentDashboardProps) {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const router = useRouter();
    const { assignmentID } = router.query;

    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    useSessionValidation('student', setLoading, setSession);

    useEffect(() => {
        if (assignmentID) {
            // Fetch assignment data
            fetch(`/api/assignments/${assignmentID}`)
                .then((response) => response.json())
                .then((data: Assignment) => {
                    console.log("Fetched assignment data:", data);
                    setAssignment(data);
                })
                .catch((error) => console.error('Error fetching assignment data:', error));

            // Fetch course data
            fetch(`/api/courses/${courseId}`) // Replace `courseID` with the actual course ID
                .then((response) => response.json())
                .then((data: CourseData) => {
                    console.log("Fetched course data:", data);
                    setCourseData(data);
                })
                .catch((error) => console.error('Error fetching course data:', error));
        }
    }, [assignmentID]);

    if (!assignment || loading) {
        return <div className='w-[100vh=w] h-[100vh] student flex justify-center text-center items-center my-auto'>
            <Spinner color='primary' size="lg" />
        </div>;
    }

    if (!session || !session.user || !session.user.userID) {
        console.error('No user found in session');
        return null;
    }

    // Dummy data for submittedStudents and remainingStudents

    const handleBackClick = async () => {
        // Redirect to the landing page
        router.back();
    }
    const handleHomeClick = async () => {
        router.push("/student/dashboard")
    }
    return (
        <>
            <StudentNavbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>{assignment.title ? assignment.title : "Assignment Name- Details"} </h1>
                    <br />
                    <Breadcrumbs>
                        <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
                        {/* <BreadcrumbItem onClick={handleBackClick}>{courseData ? courseData.courseName : "Course Dashboard"}</BreadcrumbItem> */}
                        <BreadcrumbItem>{assignment.title ? assignment.title : "Assignment Name"} </BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <div className={styles.assignmentsSection}>
                    {assignment && (
                        <StudentAssignmentView
                            description={assignment.descr || "No description available"}
                            deadline={assignment.deadline || "No deadline set"}
                            allowedFileTypes={assignment.allowedFileTypes} />
                    )}
                    <SubmitAssignment
                assignmentID={assignment.assignmentID}
                userID={session.user.userID}
              />
                </div>
            </div>

        </>
    );
}
