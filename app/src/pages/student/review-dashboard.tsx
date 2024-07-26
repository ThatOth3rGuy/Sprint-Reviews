import StudentNavbar from "../components/student-components/student-navbar";
import styles from '../../styles/instructor-course-dashboard.module.css';
import { Breadcrumbs, BreadcrumbItem, Spinner, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ReviewCriteria from "../components/student-components/review-criteria";
import SubmissionToReview from "../components/student-components/submission-to-review";

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
  const router = useRouter();
  const { assignmentID } = router.query;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
        <div className={styles.content}>
          <h2>Review Assignment: {assignment?.title}</h2>
          <ReviewCriteria criteria={reviewCriteria} />
          <SubmissionToReview submission={submissionToReview} />
        </div>
      </div>
    </>
  );
}