// instructor/submission-feedback.tsx
import { useRouter } from "next/router";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import { useEffect, useState } from "react";
import { useSessionValidation } from "../api/auth/checkSession";
import AssignmentDetailCard from "../components/student-components/student-assignment-details";
import styles from "../../styles/AssignmentDetailCard.module.css";
import { Button, Breadcrumbs, BreadcrumbItem, Spinner, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@nextui-org/react";
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
  feedbackType: 'peer' | 'instructor';
}

interface Submission {
  studentName: string;
  submissionID: number;
  assignmentID: number;
  studentID: number;
  fileName: string;
  submissionDate: string;
  autoGrade: number;
  grade: number;
  isLate: boolean;
  isSubmitted: boolean;
}

export default function AssignmentDashboard() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const { assignmentID, studentID } = router.query;
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGrade, setNewGrade] = useState<number>(0);

  useSessionValidation("instructor", setLoading, setSession);

  useEffect(() => {
    if (!router.isReady || !studentID) return;

    checkSubmissionStatus();

    const fetchData = async () => {
      if (assignmentID && studentID) {
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
            const feedbacksResponse = await fetch(`/api/peer-reviews/${assignmentID}/${studentID}`);
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
  }, [router.isReady, studentID, assignmentID]);

  const checkSubmissionStatus = async () => {
    if (assignmentID && studentID) {
      try {
        const response = await fetch(`/api/submissions/checkSubmission?assignmentID=${assignmentID}&userID=${studentID}`);
        if (!response.ok) {
          throw new Error('Failed to check submission status');
        }
        const data = await response.json();

        setSubmission(data);
        setNewGrade(data.grade ?? data.autoGrade);
        console.log('Submission data:', data);
      } catch (error) {
        console.error('Error checking submission status:', error);
        toast.error('Error checking submission status. Please refresh the page.');
      }
    }
  };

  const handleEditGrade = () => {
    setIsModalOpen(true);
  };

  const handleSaveGrade = async (newGrade: number) => {
    try {
      const response = await fetch('/api/updateTable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: 'submission',
          data: {
            grade: newGrade,
            submissionID: submission?.submissionID,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update grade');
      }

      setSubmission((prev) => prev ? { ...prev, grade: newGrade } : null);
      toast.success('Grade updated successfully');
    } catch (error) {
      console.error('Error updating grade:', error);
      toast.error('Error updating grade. Please try again.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!assignment || loading) {
    return (
      <div className="w-[100vh=w] h-[100vh] instructor flex justify-center text-center items-center my-auto">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  const handleAssignmentClick = () => router.push(`/instructor/assignment-dashboard?assignmentID=${assignment.assignmentID}`);
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
              {submission?.studentName || "Assignment Name"}
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.assignmentsSection}>
          {assignment && (
            <AssignmentDetailCard
                description={assignment.descr || "No description available"}
                startDate={assignment.startDate || "No start date set"}
                endDate={assignment.endDate || "No end date set"}
                deadline={assignment.deadline || "No deadline set"}
                allowedFileTypes={assignment.allowedFileTypes}
            />
          )}
          {submission && submission.isSubmitted ? (
            <div>
              <p className={submission.isLate ? "text-primary-900 text-large font-bold bg-danger-200 my-2 p-1" : "text-primary-900 text-large font-bold bg-success-300 my-2 p-1"}>
                {submission.isLate
                  ? `${submission?.studentName} - Assignment Submitted Late`
                  : `${submission?.studentName} - Assignment Submitted`}
              </p>
              {submission.fileName && <p className="text-left text-small">Submitted file: {submission.fileName}</p>}
            </div>
          ) : (
            <p className="text-primary-900 text-large font-bold bg-danger-500 my-2 p-1">{submission?.studentName} - Assignment Not Submitted</p>
          )}
          <div className={styles.feedbackSection}>
            <h2>Feedback</h2>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback, index) => (
                <div key={feedback.feedbackID} className={styles.assignmentsSection}>
                  <p><strong>Feedback {index + 1}:</strong></p>
                  <p><strong>Details:</strong> {feedback.feedbackDetails}</p>
                  <p><strong>Comment:</strong> {feedback.comment}</p>
                  <p><strong>Date:</strong> {new Date(feedback.feedbackDate).toLocaleString()}</p>
                  <p><strong>Grade:</strong> {feedback.grade !== null ? feedback.grade : "Not graded yet"}</p>
                </div>
              ))
            ) : (
              <p>No feedback available yet.</p>
            )}
          </div>
          <p className="text-primary-900 text-large font-bold bg-primary-100 my-2 p-1">
            {submission?.grade ? 'Adjusted Grade:' : 'Average Grade:'} {submission?.grade ?? submission?.autoGrade}
            <br />
            <Button className="text-primary-900 text-small font-bold bg-primary-200 my-2 p-0.5" onClick={handleEditGrade}>Edit Grade</Button>
          </p>
        </div>
      </div>
      <Modal
        className='z-20'
        backdrop="blur"
        isOpen={isModalOpen}
        onOpenChange={(open) => setIsModalOpen(open)}
      >
        <ModalContent>
          <ModalHeader>Edit Grade</ModalHeader>
          <ModalBody>
            <Input
              type="number"
              fullWidth
              label="New Grade"
              value={newGrade?.toString()}
              onChange={(e) => setNewGrade(Number(e.target.value))}
              min={0}
              max={100}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" variant="light" onPress={closeModal}>
              Cancel
            </Button>
            <Button color="primary" onPress={() => { handleSaveGrade(newGrade); closeModal(); }}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}