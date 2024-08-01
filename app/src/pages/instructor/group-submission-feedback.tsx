import { useRouter } from "next/router";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import { useEffect, useState } from "react";
import { useSessionValidation } from "../api/auth/checkSession";
import InstructorGroupDetails from "../components/instructor-components/instructor-group-feedback";
import styles from "../../styles/AssignmentDetailCard.module.css";
import { Button, Breadcrumbs, BreadcrumbItem, Spinner, useDisclosure, Card, CardBody } from "@nextui-org/react";
import toast from "react-hot-toast";

interface Assignment {
  assignmentID: number;
  title: string;
  descr: string;
  deadline: string;
  allowedFileTypes: string;
  groupAssignment: boolean;
  courseID: string;
}

interface CourseData {
  courseID: string;
  courseName: string;
}

interface GroupDetails {
  groupID: number;
  students: { studentID: number; firstName: string; lastName: string }[];
}

interface Feedback {
  revieweeID: number;
  reviewerID: number;
  score: string;
  content: string;
}

export default function AssignmentDashboard() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const studentID = parseInt(router.query.studentID as string);
  const assignmentID = parseInt(router.query.assignmentID as string);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLateSubmission, setIsLateSubmission] = useState(false);
  const [submittedFileName, setSubmittedFileName] = useState<string | null>(null);
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useSessionValidation('instructor', setLoading, setSession);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchData = async () => {
      if (assignmentID) {
        try {
          const assignmentResponse = await fetch(`/api/assignments/${assignmentID}`);
          if (assignmentResponse.ok) {
            const assignmentData: Assignment = await assignmentResponse.json();
            setAssignment(assignmentData);

            if (assignmentData.courseID) {
              const courseResponse = await fetch(`/api/courses/${assignmentData.courseID}`);
              if (courseResponse.ok) {
                const courseData: CourseData = await courseResponse.json();
                setCourseData(courseData);
              }
            }

            if (assignmentData.groupAssignment) {
              const groupResponse = await fetch(`/api/groups/getGroupDetails?courseID=${assignmentData.courseID}&userID=${studentID}`);
              if (groupResponse.ok) {
                const groupData: GroupDetails = await groupResponse.json();
                console.log('Group details:', groupData);
                setGroupDetails(groupData);
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

  useEffect(() => {
    const checkSubmissionStatus = async () => {
      if (assignmentID) {
        try {
          const response = await fetch(`/api/submissions/checkSubmission?assignmentID=${assignmentID}&userID=${studentID}`);
          if (!response.ok) {
            throw new Error('Failed to check submission status');
          }
          const data = await response.json();

          if (data.isSubmitted) {
            setIsSubmitted(true);
            setSubmittedFileName(data.fileName);
            setIsLateSubmission(data.isLate);
          } else {
            setIsSubmitted(false);
            setIsLateSubmission(false);
            setSubmittedFileName(null);
          }
        } catch (error) {
          console.error('Error checking submission status:', error);
          toast.error('Error checking submission status. Please refresh the page.');
        }
      }
    };

    const checkFeedbackStatus = async () => {
      if (assignmentID) {
        try {
          const response = await fetch(`/api/groups/getFeedbackStatus?assignmentID=${assignmentID}&reviewerID=${studentID}`);
          if (!response.ok) {
            throw new Error('Failed to check feedback status');
          }
          const data = await response.json();
          setIsFeedbackSubmitted(data.isFeedbackSubmitted);
        } catch (error) {
          console.error('Error checking feedback status:', error);
          toast.error('Error checking feedback status. Please refresh the page.');
        }
      }
    };

    const fetchFeedback = async () => {
      if (assignmentID && groupDetails) {
        try {
          const response = await fetch(`/api/groups/getSubmittedFeedback?assignmentID=${assignmentID}&groupID=${groupDetails.groupID}`);
          if (!response.ok) {
            throw new Error('Failed to fetch feedback');
          }
          const data = await response.json();
          setFeedback(data);
        } catch (error) {
          console.error('Error fetching feedback:', error);
          toast.error('Error fetching feedback. Please refresh the page.');
        }
      }
    };

    checkSubmissionStatus();
    checkFeedbackStatus();
    fetchFeedback();
  }, [assignmentID, groupDetails]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const isFileTypeAllowed = (file: File | null) => {
    if (!file || !assignment?.allowedFileTypes) return false;
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const allowedFileTypes = assignment.allowedFileTypes.split(",");
    return allowedFileTypes.some(
      (type: string) =>
        type.toLowerCase().trim() === `.${fileExtension}` ||
        type.toLowerCase().trim() === fileExtension
    );
  };

  const handleSubmit = async () => {
    if (uploadedFile && isFileTypeAllowed(uploadedFile)) {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('assignmentID', assignment?.assignmentID?.toString() ?? '');
      formData.append('userID', studentID?.toString() ?? '');
      formData.append('isGroupAssignment', String(assignment?.groupAssignment ?? false));
      formData.append('groupID', groupDetails?.groupID?.toString() ?? '');
      if (assignment?.groupAssignment) {
        const studentList = groupDetails?.students?.map(student => student.studentID);
        formData.append('students', JSON.stringify(studentList));
      }

      const checkSubmissionStatus = async () => {
        if (assignmentID) {
          try {
            const response = await fetch(`/api/submissions/checkSubmission?assignmentID=${assignmentID}&userID=${studentID}`);
            if (!response.ok) {
              throw new Error('Failed to check submission status');
            }
            const data = await response.json();
    
            if (data.isSubmitted) {
              setIsSubmitted(true);
              setSubmittedFileName(data.fileName);
              setIsLateSubmission(data.isLate);
            } else {
              setIsSubmitted(false);
              setIsLateSubmission(false);
              setSubmittedFileName(null);
            }
          } catch (error) {
            console.error('Error checking submission status:', error);
            toast.error('Error checking submission status. Please refresh the page.');
          }
        }
      };

      try {
        console.log('Submitting assignment...', formData.get('file'), formData.get('assignmentID'), formData.get('userID'), formData.get('isGroupAssignment'), formData.get('groupID'));
        const response = await fetch('/api/assignments/submitAssignment', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        console.log('Submit result:', result);

        if (response.ok) {
          if (result.success) {
            console.log('File uploaded successfully');
            toast.success('Assignment submitted successfully!');
            onOpenChange();
            setIsSubmitted(true);
            setSubmittedFileName(uploadedFile.name);
            setIsLateSubmission(result.isLate);
            checkSubmissionStatus();
          } else {
            throw new Error(result.message || 'File upload failed');
          }
        } else {
          throw new Error('File upload failed');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setFileError('Failed to upload file. Please try again.');
        toast.error('Failed to upload file. Please try again.');
      }
    } else {
      console.error('Invalid submission attempt:', {
        uploadedFile: !!uploadedFile,
        isFileTypeAllowed: isFileTypeAllowed(uploadedFile),
        userID: studentID
      });
      toast.error('Invalid submission. Please check your file and try again.');
    }
  };

  if (!assignment || loading) {
    return (
      <div className="w-[100vh=w] h-[100vh] instructor flex justify-center text-center items-center my-auto">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  const handleAssignmentClick = () => router.push(`/instructor/group-assignment-dashboard?assignmentID=${assignment.assignmentID}`);
  const handleCourseClick = () => router.push(`/instructor/course-dashboard?courseId=${courseData?.courseID}`);
  const handleHomeClick = () => router.push("/instructor/dashboard");

  return (
    <>
      <InstructorNavbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{assignment.title || "Assignment Name- Details"}</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem onClick={handleCourseClick}>{courseData?.courseName}</BreadcrumbItem>
            <BreadcrumbItem onClick={handleAssignmentClick}>{assignment.title}</BreadcrumbItem>
            <BreadcrumbItem>
              {`Group ${groupDetails?.groupID}` || "Group Submission Feedback"}
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.assignmentsSection}>
            <Card className={styles.assignmentCard}>
                <CardBody>
                <h2 className={styles.assignmentTitle}>{assignment.title}</h2>
                <p className={styles.assignmentDescription}>{assignment.descr}</p>
                <p className={styles.assignmentDeadline}>Deadline: {assignment.deadline}</p>
                </CardBody>
            </Card>
          {isSubmitted ? (
            <div>
              <p className={isLateSubmission ? "text-primary-900 text-large font-bold bg-danger-200 my-2 p-1" : "text-primary-900 text-large font-bold bg-success-300 my-2 p-1"}>
                {isLateSubmission
                  ? "Assignment Submitted Late"
                  : "Assignment Submitted"}
              </p>
              {submittedFileName && <p className="text-left text-small">Submitted file: {submittedFileName}</p>}
            </div>
          ) : (
            <p className="text-primary-900 text-large font-bold bg-danger-500 my-2 p-1">Assignment Not Submitted</p>
          )}
          <br /><br />
          {groupDetails && (
            <InstructorGroupDetails
              groupID={groupDetails.groupID}
              students={groupDetails.students}
              feedbacks={feedback}
            />
          )}
        </div>
      </div>
    </>
  );
}
