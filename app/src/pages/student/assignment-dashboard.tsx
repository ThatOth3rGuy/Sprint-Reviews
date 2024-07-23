//assignment-dashboard.tsx
import { useRouter } from "next/router";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import AssignmentDetailCard from '../components/instructor-components/instructor-assignment-details';
import styles from "../../styles/AssignmentDetailCard.module.css";
import { Button, Breadcrumbs, BreadcrumbItem, Listbox, ListboxItem, Divider, Checkbox, CheckboxGroup, Progress, Spinner, Link, Modal, useDisclosure, ModalContent, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react";
import StudentNavbar from "../components/student-components/student-navbar";
import StudentAssignmentView from "../components/student-components/student-assignment-details";
import SubmitAssignment from "../components/student-components/student-submit-assignment";

interface Assignment {
    assignmentID: number;
    title: string;
    descr: string;
    deadline: string;
    allowedFileTypes: string;
    courseID: number;
}

interface CourseData {
    courseID: string;
    courseName: string;
}

export default function AssignmentDashboard() {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const router = useRouter();
    const { assignmentID, courseID } = router.query;

    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    useSessionValidation('student', setLoading, setSession);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    useEffect(() => {
        if (!router.isReady) return;
    
        const { assignmentID } = router.query;
    
        const fetchData = async () => {
          if (assignmentID) {
            try {
              const assignmentResponse = await fetch(`/api/assignments/${assignmentID}`);
    
              if (assignmentResponse.ok) {
                const assignmentData: Assignment = await assignmentResponse.json();
                setAssignment(assignmentData);
    
                // Assuming the assignment data includes a courseID
                if (assignmentData.courseID) {
                  const courseResponse = await fetch(`/api/courses/${assignmentData.courseID}`);
                  if (courseResponse.ok) {
                    const courseData: CourseData = await courseResponse.json();
                    setCourseData(courseData);
                  }
                }
              } else {
                console.error('Error fetching assignment data');
              }
            } catch (error) {
              console.error('Error:', error);
            } finally {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [router.isReady, router.query]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setUploadedFile(event.target.files[0]);
        }
    };

    const isFileTypeAllowed = (file: File | null) => {
        if (!file || !assignment?.allowedFileTypes) return false;
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const allowedFileTypes = assignment.allowedFileTypes.split(','); // Split the string into an array
        return allowedFileTypes.some((type: string) =>
            type.toLowerCase().trim() === `.${fileExtension}` || type.toLowerCase().trim() === fileExtension
        );
    };


    const handleSubmit = async () => {
        if (uploadedFile && isFileTypeAllowed(uploadedFile)) {
            const formData = new FormData();
            formData.append('file', uploadedFile);
            formData.append('assignmentID', assignment.assignmentID.toString());
            formData.append('studentID', session.user.userID);

            try {
                const response = await fetch('/api/assignments/submitAssignment', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    console.log('File uploaded successfully');
                    alert('Assignment submitted successfully!')
                } else {
                    throw new Error('File upload failed');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                setFileError('Failed to upload file. Please try again.');
            }
        }
    };

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
                        <BreadcrumbItem onClick={handleBackClick}>{courseData ? courseData.courseName : "Course Dashboard"}</BreadcrumbItem>
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
                    <Button onClick={onOpen}>Submit Assignment</Button>
                    <Modal className="student" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Submit Assignment</ModalHeader>
                                    <ModalBody>
                                        <input type="file" onChange={handleFileUpload} />
                                        {fileError && <p style={{ color: 'red' }}>{fileError}</p>}
                                        {uploadedFile && (
                                            <div>
                                                <p>Selected file: {uploadedFile.name}</p>
                                            </div>
                                        )}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={() => {
                                            setUploadedFile(null); // Clear the selected file
                                            setFileError(null); // Clear any file errors
                                            onClose(); // Close the modal
                                        }}>
                                            Cancel
                                        </Button>
                                        <Button color="primary" onPress={handleSubmit}>
                                            Submit
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </div>

        </>
    );
}
