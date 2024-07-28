import StudentNavbar from "../components/student-components/student-navbar";
import styles from '../../styles/instructor-course-dashboard.module.css';
import { Breadcrumbs, BreadcrumbItem, Spinner, Card, CardBody, CardHeader, Divider, Button,Input } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

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
  fileName: string;
  fileContent: string;
  fileType: string;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [reviewCriteria, setReviewCriteria] = useState<ReviewCriterion[]>([]);
  const [submissionToReview, setSubmissionToReview] = useState<Submission | null>(null);
  const [reviewGrades, setReviewGrades] = useState<{[key: number]: string}>({});
  const router = useRouter();
  const { assignmentID } = router.query;

  useEffect(() => {
    if (!router.isReady) return;

    const fetchData = async () => {
      if (assignmentID) {
        try {
          // Fetch assignment and course data
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

            // Fetch review criteria and submission to review
            const reviewResponse = await fetch(`/api/review-dashboard/${assignmentID}`);
            if (reviewResponse.ok) {
              const reviewData = await reviewResponse.json();
              setReviewCriteria(reviewData.reviewCriteria);
              setSubmissionToReview(reviewData.submission);
            } else {
              console.error('Failed to fetch review data');
            }
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [router.isReady, assignmentID]);

  if (loading) {
    return (
      <div className="w-[100vh=w] h-[100vh] student flex justify-center text-center items-center my-auto">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  const handleHomeClick = () => router.push("/student/dashboard");
  const handleGradeChange = (criteriaID: number, value: string) => {
    setReviewGrades(prev => ({...prev, [criteriaID]: value}));
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
          <h2>Review Assignment: {assignment?.title}</h2>
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
            <Card className="flex-1">
              <CardHeader>Submission to Review</CardHeader>
              <Divider />
              <CardBody>
                {submissionToReview ? (
                  <>
                    <p>File Name: {submissionToReview.fileName}</p>
                    <p>File Type: {submissionToReview.fileType}</p>
                    <Divider className="my-2" />
                    <p>File Content:</p>
                    <pre className="whitespace-pre-wrap">{submissionToReview.fileContent}</pre>
                  </>
                ) : (
                  <p>No submission to review.</p>
                )}
              </CardBody>
            </Card>
          </div>
          
        </div>
      </div>
    </>
  );
}