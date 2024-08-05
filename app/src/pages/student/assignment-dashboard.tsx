// pages/student/assignment-dashboard.tsx
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
  startDate: string;
  endDate: string;
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
  feedbackType: 'instructor';
}
interface Comment {
  feedbackID: number;
  comment: string;
  feedbackDate: string;
  lastUpdated: string;
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

  const [comments, setComments] = useState<Comment[]>([]);

  const [studentID, setStudentID] = useState<number | null>(null);


  useSessionValidation("student", setLoading, setSession);

  useEffect(() => {
    const fetchStudentID = async () => {
      if (session?.user?.userID) {
        try {
          const response = await fetch(`/api/userInfo/student-user-details?userID=${session.user.userID}`);
          if (response.ok) {
            const data = await response.json();
            setStudentID(data.studentID);
          } else {
            throw new Error("Failed to fetch student details");
          }
        } catch (error) {
          console.error("Error fetching student details:", error);
          toast.error("Error fetching student details. Please refresh the page.");
        }
      }
    };

    const fetchData = async () => {
      if (!router.isReady || !session?.user?.userID || !assignmentID || !studentID) return;

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


          const feedbacksResponse = await fetch(`/api/peer-reviews/${assignmentID}/${studentID}`);
          if (feedbacksResponse.ok) {
            const feedbacksData: Feedback[] = await feedbacksResponse.json();
            setFeedbacks(feedbacksData);
          }

          await checkSubmissionStatus();
        } else {
          console.error('Error fetching assignment data');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchComments = async () => {
      if (assignmentID && session?.user?.userID) {
        try {
          const response = await fetch(`/api/studentComments/${assignmentID}/${session.user.userID}`);
          if (response.ok) {
            const commentsData: Comment[] = await response.json();
            setComments(commentsData);
            console.log(commentsData)
          } else {
            console.error('Error fetching comments');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };


    fetchComments();
    fetchData();
  }, [router.isReady, session, assignmentID]);

  const checkSubmissionStatus = async () => {
    if (assignmentID && session?.user?.userID) {
      
      try {
        const response = await fetch(`/api/submissions/checkSubmission?assignmentID=${assignmentID}&userID=${session.user.userID}`);
        if (!response.ok) throw new Error('Failed to check submission status');
        
        const data = await response.json();
        setIsSubmitted(data.isSubmitted);
        setSubmittedFileName(data.fileName);
        setIsLateSubmission(data.isLate);
      } catch (error) {
        console.error('Error checking submission status:', error);
        toast.error('Error checking submission status. Please refresh the page.');
      }

    if (router.isReady && session && !studentID) {
      fetchStudentID();
    }

    if (studentID) {
      fetchData();

    }
  }, [router.isReady, session, assignmentID, studentID]);

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
    if ((uploadedFile && isFileTypeAllowed(uploadedFile)) || (submissionType === 'link' && linkSubmission && isLinkTypeAllowed())) {
      const formData = new FormData();
      formData.append('assignmentID', assignment?.assignmentID?.toString() ?? '');
      formData.append('userID', session.user.userID.toString());

      if (uploadedFile) {
        formData.append('file', uploadedFile);
      } else if (linkSubmission) {
        formData.append('link', linkSubmission);
      }

      try {
        const response = await fetch('/api/assignments/submitAssignment', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (response.ok && result.success) {
          toast.success(result.message);
          onOpenChange();
          setIsSubmitted(true);
          setSubmittedFileName(uploadedFile ? uploadedFile.name : linkSubmission);
          setIsLateSubmission(result.isLate);
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (error) {
        console.error('Error submitting assignment:', error);
        setFileError('Failed to submit. Please try again.');
        toast.error('Failed to submit. Please try again.');
      }
    } else {
      toast.error('Invalid submission. Please check your file or link and try again.');
    }
  };

  const checkSubmissionStatus = async () => {
    if (assignmentID && session?.user?.userID && studentID) {
      try {
        const response = await fetch(`/api/submissions/checkSubmission?assignmentID=${assignmentID}&userID=${studentID}`);
        if (!response.ok) throw new Error('Failed to check submission status');

        const data = await response.json();
        setIsSubmitted(data.isSubmitted);
        setSubmittedFileName(data.fileName);
        setIsLateSubmission(data.isLate);
      } catch (error) {
        console.error('Error checking submission status:', error);
        toast.error('Error checking submission status. Please refresh the page.');
      }
    }
  };

  const isWithinSubmissionPeriod = () => {
    if (!assignment) return false;
    const currentDate = new Date();
    const startDate = new Date(assignment.startDate);
    const endDate = new Date(assignment.endDate);
    return currentDate >= startDate && currentDate <= endDate;
  };

  const downloadSubmission = async (assignmentID: number, studentID: number) => {
    try {
      const response = await fetch(`/api/assignments/downloadSubmission?assignmentID=${assignmentID}&studentID=${studentID}`);

      if (response.ok) {
        const contentType = response.headers.get('Content-Type');

        if (contentType === 'application/json') {
          const data = await response.json();
          window.open(data.link, '_blank');
        } else {
          const blob = await response.blob();
          const contentDisposition = response.headers.get('Content-Disposition');
          const fileName = contentDisposition?.split('filename=')[1] || 'downloaded_file';

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', decodeURIComponent(fileName));

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        throw new Error('Failed to download submission');
      }
    } catch (error) {
      console.error('Error downloading submission:', error);
      toast.error('Error downloading submission. Please try again.');
    }
  };

  const handleBackClick = () => router.push(`/student/course-dashboard?courseId=${courseData?.courseID}`);

  const handleHomeClick = () => router.push("/student/dashboard");

  if (!assignment || loading) {
    return (
      <div className="w-[100vh=w] h-[100vh] student flex justify-center text-center items-center my-auto">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

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
            <BreadcrumbItem>{assignment.title || "Assignment Name"}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.assignmentsSection}>
          {assignment && (
            <StudentAssignmentView
              description={assignment.descr || "No description available"}
              deadline={new Date(assignment.deadline).toLocaleString() || "No deadline Date"}
              allowedFileTypes={assignment.allowedFileTypes}
              startDate={new Date(assignment.startDate).toLocaleString() || "No start Date"}
              endDate={new Date(assignment.endDate).toLocaleString() || "No End Date"}
            />
          )}
          {isSubmitted ? (
            <div>
              <p className={isLateSubmission ? "text-primary-900 text-large font-bold bg-danger-200 my-2 p-1" : "text-primary-900 text-large font-bold bg-success-300 my-2 p-1"}>
                {isLateSubmission ? "Assignment Submitted Late" : "Assignment Submitted"}
              </p>
              {submittedFileName && <p className="text-left text-small">Submitted: {submittedFileName} <Button onClick={() => downloadSubmission(Number(assignmentID), session.user.userID)}>Download Submitted File</Button></p>}
              {isWithinSubmissionPeriod() && <Button onClick={onOpen}>Resubmit Assignment</Button>}
            </div>
          ) : (
            isWithinSubmissionPeriod() && <Button onClick={onOpen}>Submit Assignment</Button>
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
                  <ModalHeader className="flex flex-col gap-1">Submit Assignment</ModalHeader>
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
                    {uploadedFile && <p>Selected file: {uploadedFile.name}</p>}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={() => {
                      setUploadedFile(null);
                      setFileError(null);
                      onClose();
                    }}>Cancel</Button>
                    <Button color="primary" onPress={handleSubmit}>Submit</Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <div className={styles.feedbackSection}>
            <br />
            <hr />
            <h2> Feedback</h2>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback, index) => (
                <div key={feedback.feedbackID} className={styles.assignmentsSection}>
                  <p><strong>Feedback {index + 1}:</strong></p>
                  <p><strong>Details:</strong> {feedback.feedbackDetails}</p>
                  <p><strong>Comment:</strong> {feedback.comment}</p>
                  <p><strong>Date:</strong> {new Date(feedback.feedbackDate).toLocaleString()}</p>
                  <p><strong>Grade:</strong> {feedback.grade ?? 'Not graded yet'}</p>
                </div>
              ))
            ) : (
              <p>No feedback available yet.</p>
            )}
          </div>
          <div className={styles.commentsSection}>
          <h2>Comments</h2>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.feedbackID} className={styles.comment}>
                <p>{comment.comment}</p>
                <p>Date: {new Date(comment.feedbackDate).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No comments available yet.</p>
          )}
        </div>
        </div>
      </div>
    </>
  );
}
