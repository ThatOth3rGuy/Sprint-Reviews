import { useRouter } from "next/router";
import StudentNavbar from "../components/student-components/student-navbar";
import { useEffect, useState } from "react";
import { useSessionValidation } from "../api/auth/checkSession";
import StudentAssignmentView from "../components/student-components/student-assignment-details";
import styles from "../../styles/AssignmentDetailCard.module.css";
import { Button, Breadcrumbs, BreadcrumbItem, Spinner, Modal, useDisclosure, ModalContent, ModalBody, ModalFooter, ModalHeader, Input } from "@nextui-org/react";
import toast from "react-hot-toast";

interface Assignment {
  assignmentID: number;
  title: string;
  descr: string;
  startDate: string,
  endDate: string,
  deadline: string;
  allowedFileTypes: string;
  courseID: string; 
}

interface CourseData {
  courseID: string;
  courseName: string;
}

interface Feedback {
  feedbackID: number;
  submissionID: number;
  reviewerID: number;
  feedbackDetails: string;
  feedbackDate: string;
  lastUpdated: string;
  comment: string;
  grade: number | null;
  feedbackType: 'peer' | 'instructor';
}

export default function AssignmentDashboard() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const { assignmentID } = router.query;
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLateSubmission, setIsLateSubmission] = useState(false);
  const [submittedFileName, setSubmittedFileName] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [submissionType, setSubmissionType] = useState<'file' | 'link'>('file');
  const [linkSubmission, setLinkSubmission] = useState('');

  useSessionValidation("student", setLoading, setSession);

  useEffect(() => {
    if (!router.isReady || !session) return;

    const { assignmentID } = router.query;

    const fetchData = async () => {
      if (assignmentID && session?.user?.userID) {
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

            // Fetch feedbacks for this assignment and student
            const feedbacksResponse = await fetch(`/api/peer-reviews/${assignmentID}/${session.user.userID}`);
            if (feedbacksResponse.ok) {
              const feedbacksData: Feedback[] = await feedbacksResponse.json();
              setFeedbacks(feedbacksData);
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
  }, [router.isReady, session, router.query]);

    //useEffect for assignment information
  useEffect(() => {
    if (assignmentID && session?.user?.userID) {
      fetch(`/api/assignments/${assignmentID}`)
        .then((response) => response.json())
        .then((data: Assignment) => {
          setAssignment(data);
          return fetch(`/api/courses/${data.courseID}`);
        })
        .then((response) => response.json())
        .then((data: CourseData) => {
          setCourseData(data);
          checkSubmissionStatus();
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [assignmentID, session]);

  const checkSubmissionStatus = async () => {
    if (assignmentID && session?.user?.userID) {
      try {
        const response = await fetch(`/api/submissions/checkSubmission?assignmentID=${assignmentID}&userID=${session.user.userID}`);
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
const handleSubmissionTypeChange = (type: 'file' | 'link') => {
    setSubmissionType(type);
    setUploadedFile(null);
    setLinkSubmission('');
    setFileError(null);
  };

  const isLinkTypeAllowed = () => {
    if (!assignment?.allowedFileTypes) return false;
    const allowedTypes = assignment.allowedFileTypes.split(",");
    return allowedTypes.some(type => ['link', 'github', 'googledocs'].includes(type.trim().toLowerCase()));
  };

  const handleSubmit = async () => {
    if (uploadedFile && isFileTypeAllowed(uploadedFile) && session?.user?.userID) {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('assignmentID', assignment?.assignmentID?.toString() ?? '');
      formData.append('studentID', session.user.userID.toString());

      try {
        const response = await fetch('/api/assignments/submitAssignment', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          if (result.success) {
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
    } else if (submissionType === 'link' && linkSubmission && isLinkTypeAllowed() && session?.user?.userID) {
      try {
        const response = await fetch('/api/assignments/submitAssignment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assignmentID: assignment?.assignmentID,
            studentID: session.user.userID,
            link: linkSubmission,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          toast.success('Link submitted successfully!');
          onOpenChange();
          setIsSubmitted(true);
          setSubmittedFileName(linkSubmission);
          setIsLateSubmission(result.isLate);
          checkSubmissionStatus();
        } else {
          throw new Error(result.message || 'Link submission failed');
        }
      } catch (error) {
        console.error('Error submitting link:', error);
        setFileError('Failed to submit link. Please try again.');
        toast.error('Failed to submit link. Please try again.');
      }
    }else {
      console.error('Invalid submission attempt:', { 
        uploadedFile: !!uploadedFile, 
        isFileTypeAllowed: isFileTypeAllowed(uploadedFile), 
        userID: session?.user?.userID 
    });
      toast.error('Invalid submission. Please check your file and try again.');
    }
  };

  if (!assignment || loading) {
    return (
      <div className="w-[100vh=w] h-[100vh] student flex justify-center text-center items-center my-auto">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }




  const handleBackClick = () => router.push(`/student/course-dashboard?courseId=${courseData?.courseID}`);

  const handleHomeClick = () => router.push("/student/dashboard");

  return (
    <>
      <StudentNavbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{assignment.title || "Assignment Name- Details"}</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem onClick={handleBackClick}>{courseData?.courseName}</BreadcrumbItem>
            <BreadcrumbItem>
              {assignment.title || "Assignment Name"}
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.assignmentsSection}>
          {assignment && (
            <StudentAssignmentView
              description={assignment.descr || "No description available"}
              deadline={assignment.deadline || "No deadline set"}
              allowedFileTypes={assignment.allowedFileTypes}
            />
          )}
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
            <Button onClick={onOpen}>Submit Assignment</Button>
          )}
          <Modal
            className="student"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Submit Assignment
                  </ModalHeader>
                  <ModalBody>
                  {isLinkTypeAllowed() && (
                  <div>
                    <Button onClick={() => handleSubmissionTypeChange('file')}>File Submission</Button>
                    <Button onClick={() => handleSubmissionTypeChange('link')}>Link Submission</Button>
                  </div>
                )}
                {submissionType === 'file' ? (
                  <input type="file" onChange={handleFileUpload} />
                ) : (
                  <Input
                    type="url"
                    label="Submission Link"
                    placeholder="Enter your submission link"
                    value={linkSubmission}
                    onChange={(e) => setLinkSubmission(e.target.value)}
                  />
                )}
                {fileError && <p style={{ color: "red" }}>{fileError}</p>}
                {uploadedFile && (
                  <div>
                    <p>Selected file: {uploadedFile.name}</p>
                  </div>
                )}
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => {
                        setUploadedFile(null);
                        setFileError(null);
                        onClose();
                      }}
                    >
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
          <div className={styles.feedbackSection}>
            <h2>Feedback</h2>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback, index) => (
                <div key={feedback.feedbackID} className={styles.assignmentsSection}>
                  <p><strong>Feedback {index + 1}:</strong></p>
                  <p><strong>Details:</strong> {feedback.feedbackDetails}</p>
                  <p><strong>Comment:</strong> {feedback.comment}</p>
                  <p><strong>Date:</strong> {new Date(feedback.feedbackDate).toLocaleString()}</p>
                  <p><strong>Grade:</strong> 0</p> {/* Placeholder grade */}
                </div>
              ))
            ) : (
              <p>No feedback available yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
