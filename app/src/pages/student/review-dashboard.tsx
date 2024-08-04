import StudentNavbar from "../components/student-components/student-navbar";
import styles from '../../styles/instructor-course-dashboard.module.css';
import { Breadcrumbs, BreadcrumbItem, Spinner, Card, CardBody, CardHeader, Divider, Button, Input, Pagination } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSessionValidation } from "../api/auth/checkSession";
import submitReviews from "../api/reviews/submitReviews";
import dayjs from "dayjs";
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

interface ReviewCriterion {
  criteriaID: number;
  criterion: string;
  maxMarks: number;
}

interface Submission {
  submissionID: number;
  assignmentID: number;
  studentID: number;
  fileName: string;
  fileType: string;
  submissionDate: string;
  studentName?: string;
  deadline:string;
}

export default function ReviewDashboard() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [courseName, setCourseName] = useState<string>("");
  const [reviewCriteria, setReviewCriteria] = useState<ReviewCriterion[]>([]);
  const [submissionsToReview, setSubmissionsToReview] = useState<Submission[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewGrades, setReviewGrades] = useState<{ [key: number]: { [key: number]: string } }>({});
  const [reviewComments, setReviewComments] = useState<{ [key: number]: string }>({});
  const router = useRouter();
  const { assignmentID } = router.query;
  const [error, setError] = useState<string | null>(null);
  const [deadlinePassed, setDeadlinePassed] = useState<boolean>(false);

  useSessionValidation('student', setLoading, setSession);

  useEffect(() => {
    if (!router.isReady || !session) return;
    const fetchData = async () => {
      const userID = session.user?.userID;
      if (!assignmentID || !userID) {
        setError('Missing assignmentID or userID');
        setLoading(false);
        return;
      }

      try {
        const [assignmentResponse, reviewResponse] = await Promise.all([
          fetch(`/api/assignments/${assignmentID}`),
          fetch(`/api/review-dashboard/${assignmentID}?userID=${userID}`)
        ]);

        if (assignmentResponse.ok && reviewResponse.ok) {
          const [assignmentData, reviewData] = await Promise.all([
            assignmentResponse.json(),
            reviewResponse.json()
          ]);

          setAssignment(assignmentData);
          setReviewCriteria(reviewData.reviewCriteria);
          setSubmissionsToReview(reviewData.submissions);

          if (assignmentData.courseID) {
            const courseResponse = await fetch(`/api/courses/${assignmentData.courseID}`);
            if (courseResponse.ok) {
              const courseData = await courseResponse.json();
              setCourseData(courseData);
              setCourseName(courseData.courseName);
            }
          }

          // Initialize reviewGrades and reviewComments state
          const initialGrades = reviewData.submissions.reduce((acc: any, submission: Submission) => {
            acc[submission.submissionID] = {};
            return acc;
          }, {});
          setReviewGrades(initialGrades);

          const initialComments = reviewData.submissions.reduce((acc: any, submission: Submission) => {
            acc[submission.submissionID] = '';
            return acc;
          }, {});
          setReviewComments(initialComments);

          // Check if deadline has passed
          const assignmentDeadline = currentSubmission ? dayjs(currentSubmission.deadline) : null;
          const currentDate = dayjs();
          //const assignmentDeadline = dayjs(currentSubmission.deadline);
          setDeadlinePassed(currentDate.isAfter(assignmentDeadline));

        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, session, assignmentID]);

  const handleHomeClick = () => router.push("/student/dashboard");

  const handleBackClick = () => {
    const { source } = router.query;
    if (source === 'course') {
      router.push(`/student/course-dashboard?courseId=${assignment?.courseID}`);
    } else {
      router.push('/student/dashboard');
    }
  };

  const handleGradeChange = (submissionID: number, criteriaID: number, value: string) => {
    setReviewGrades(prev => ({
      ...prev,
      [submissionID]: {
        ...prev[submissionID],
        [criteriaID]: value
      }
    }));
  };

  const handleCommentChange = (submissionID: number, value: string) => {
    setReviewComments(prev => ({
      ...prev,
      [submissionID]: value
    }));
  };

  const submitReviews = async (assignmentID: number | undefined, reviews: { submissionID: number; feedbackDetails: { criteriaID: number; grade: number; }[]; comment: string; }[]) => {
    try {
      const response = await fetch('/api/reviews/submitReviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentID,
          reviews,
          userID: session.user?.userID,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit reviews');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting reviews:', error);
      throw error;
    }
  };
  
  // Usage in your component
  const handleSubmitAllReviews = async () => {
    const assignmentID = assignment?.assignmentID;
    const reviews = submissionsToReview.map(submission => ({
      submissionID: submission.submissionID,
      feedbackDetails: reviewCriteria.map(criterion => ({
        criteriaID: criterion.criteriaID,
        grade: Number(reviewGrades[submission.submissionID][criterion.criteriaID])
      })),
      comment: reviewComments[submission.submissionID]
    }));
  
    try {
      const result = await submitReviews(assignmentID, reviews);
      console.log(result.message); // 'Reviews submitted successfully'
      // Handle successful submission (e.g., show success message, redirect)
      toast.success(result.message);
      router.push('/student/dashboard');
    } catch (error) {
      console.error('Failed to submit reviews:', error);
      toast.error(`Error submitting reviews: ${(error as Error).message}`);
    }
  };

  if (loading) {
    return (
      <div className="w-[100vh=w] h-[100vh] student flex justify-center text-center items-center my-auto">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  const checkSubmissionStatus = (submissionDate: string, deadline: string) => {
    const submission = dayjs(submissionDate);
    const dueDate = dayjs(deadline);
    return submission.isBefore(dueDate) ? 'Submitted on time' : 'Submitted late';
  };

  const downloadSubmission = async (assignmentID: number, studentID: number) => {
    try {
      const response = await fetch(`/api/assignments/downloadSubmission?assignmentID=${assignmentID}&studentID=${studentID}`);
      
      if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        
        if (contentType === 'application/json') {
          // Handle link submission
          const data = await response.json();
          window.open(data.link, '_blank');
        } else {
          // Handle file submission
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentSubmission = submissionsToReview[currentPage - 1];

  return (
    <>
      <StudentNavbar />
      <div className={`student text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h2>Reviewing Assignment: {assignment?.title || "Assignment Details"}</h2>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem onClick={handleBackClick}>{courseName}</BreadcrumbItem>
            <BreadcrumbItem>
              Review for {assignment?.title || "Assignment Name"}
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={`w-[100%] flex flex-col ${styles.assignmentsSection}`}>
          {currentSubmission && (
            <>
              <Card className="mb-4">
                <CardHeader>Submission {currentSubmission.submissionID}</CardHeader>
                <Divider />
                <CardBody>
                  <p>File Name: {currentSubmission.fileName}</p>
                  <p>File Type: {currentSubmission.fileType}</p>
                  <p>Submission Deadline: {new Date(currentSubmission.deadline).toLocaleString()}</p>
                  <p>Student Name: {currentSubmission.studentName}</p>
                </CardBody>
              </Card>
              <Button onClick={() => downloadSubmission(assignmentID, session.user.userID)}>
          Download Submitted File
        </Button>
        
              <Card>
                <CardHeader>Review Criteria</CardHeader>
                <Divider />
                <CardBody>
                  {reviewCriteria.map((criterion) => (
                    <div key={criterion.criteriaID} className="flex flex-col mb-4">
                      <div className="flex justify-between mb-2">
                        <span>{criterion.criterion}</span>
                        <span>Max marks: {criterion.maxMarks}</span>
                      </div>
                      <Input
                        type="number"
                        label={`Grade for ${criterion.criterion}`}
                        placeholder="Enter grade"
                        value={reviewGrades[currentSubmission.submissionID]?.[criterion.criteriaID] || ''}
                        onChange={(e) => handleGradeChange(currentSubmission.submissionID, criterion.criteriaID, e.target.value)}
                        max={criterion.maxMarks}
                        min={0}
                      />
                    </div>
                  ))}
                  <div className="flex flex-col mb-4">
                    <Input
                      type="text"
                      label="Comments"
                      placeholder="Enter your comments"
                      value={reviewComments[currentSubmission.submissionID] || ''}
                      onChange={(e) => handleCommentChange(currentSubmission.submissionID, e.target.value)}
                      required={reviewCriteria.some(criterion => criterion.maxMarks === 0)}
                    />
                  </div>
                  {!deadlinePassed && (
                    <Button className={"color=primary"} onClick={handleSubmitAllReviews}>
                      Submit All Reviews
                    </Button>
                  )}
 <p>{checkSubmissionStatus(currentSubmission.submissionDate, currentSubmission.deadline)}</p>
                </CardBody>
              </Card>
            </>
          )}
          <Pagination
            total={submissionsToReview.length}
            initialPage={1}
            onChange={(page) => setCurrentPage(page)}
            current={currentPage}
          />
        </div>
      </div>
    </>
  );
}
