import StudentNavbar from "../components/student-components/student-navbar";
import styles from '../../styles/instructor-course-dashboard.module.css';
import { Breadcrumbs, BreadcrumbItem, Spinner, Card, CardBody, CardHeader, Divider, Button, Input } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSessionValidation } from "../api/auth/checkSession";

interface Assignment {
  assignmentID: number;
  title: string;
  descr: string;
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
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [reviewCriteria, setReviewCriteria] = useState<ReviewCriterion[]>([]);
  const [submissionsToReview, setSubmissionsToReview] = useState<Submission[]>([]);
  const [reviewGrades, setReviewGrades] = useState<{ [key: number]: string }>({});
  const router = useRouter();
  const { assignmentID } = router.query;
  const [error, setError] = useState<string | null>(null)
  const [reviewData, setReviewData] = useState(null); 
  useSessionValidation('student', setLoading, setSession);

  useEffect(() => {
    const fetchData = async () => {
      if (!router.isReady || !session) return;
      const userID = session.user?.userID;   
    
      if (!assignmentID || !userID) {
        setError('Missing assignmentID or userID');
        setLoading(false);
        return;
      }

      try {
        const reviewResponse = await fetch(`/api/review-dashboard/${assignmentID}?userID=${userID}`);
        if (!reviewResponse.ok) {
          throw new Error(`Failed to fetch review data: ${await reviewResponse.text()}`);
        }
        const data = await reviewResponse.json();
        console.log('Review data:', data);
        setReviewCriteria(data.reviewCriteria);
        setSubmissionsToReview(data.submissions);
      } catch (error) {
        setError((error as any).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, assignmentID, session]);

  if (loading) {
    return (
      <div className="w-[100vh=w] h-[100vh] student flex justify-center text-center items-center my-auto">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleHomeClick = () => router.push("/student/dashboard");
  const handleGradeChange = (criteriaID: number, value: string) => {
    setReviewGrades(prev => ({ ...prev, [criteriaID]: value }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the review data to your backend
    console.log("Submitting review:", reviewGrades);
    // Add your API call to submit the review here
  };

  return (
    <>
      <StudentNavbar />
      <div className={`student text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>{courseData?.courseName}</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem>{courseData?.courseName}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={`w-[100%] ${styles.assignmentsSection}`}>
          <h2>Review Assignment: {assignment?.title} FOR </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <Card className="flex-1">
              <CardHeader>Review Criteria</CardHeader>
              <Divider />
              <CardBody>
                <form onSubmit={handleSubmitReview}>
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
                        value={reviewGrades[criterion.criteriaID] || ''}
                        onChange={(e) => handleGradeChange(criterion.criteriaID, e.target.value)}
                        max={criterion.maxMarks}
                        min={0}
                      />
                    </div>
                  ))}
                  <Button type="submit" color="primary" className="mt-4">
                    Submit Review
                  </Button>
                </form>
              </CardBody>
            </Card>
            <div className={styles.notificationsSection}>{submissionsToReview.map((submission) => (
              <div key={submission.submissionID}>
                <h2>Submission {submission.submissionID}</h2>
                <p>File Name: {submission.fileName}</p>
                <p>File Type: {submission.fileType}</p>
                <p>Submission Date: {new Date(submission.submissionDate).toLocaleString()}</p>
                {submission.studentName && <p>Student Name: {submission.studentName}</p>}
              </div>
            ))}</div>
            {submissionsToReview.map((submission) => (
              <div key={submission.submissionID}>
                <h2>Submission {submission.submissionID}</h2>
                <p>File Name: {submission.fileName}</p>
                <p>File Type: {submission.fileType}</p>
                <p>Submission Date: {new Date(submission.submissionDate).toLocaleString()}</p>
                {submission.studentName && <p>Student Name: {submission.studentName}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
