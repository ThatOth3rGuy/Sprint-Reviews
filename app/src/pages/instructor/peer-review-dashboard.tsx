import { useRouter } from "next/router";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import ReviewDetailCard from '../components/instructor-components/instructor-review-details'; // Import the new component
import AdminNavbar from "../components/admin-components/admin-navbar";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import styles from "../../styles/AssignmentDetailCard.module.css";
import { Button, Breadcrumbs, BreadcrumbItem, Spinner } from "@nextui-org/react";

interface Review {
  reviewID: number;
  assignmentID: number;
  assignmentName: string;
  isGroupAssignment: boolean;
  allowedFileTypes: string;
  deadline: string;
  reviewCriteria: { criteriaID: number; criterion: string; maxMarks: number }[];
}

interface CourseData {
  courseID: string;
  courseName: string;
}

interface ReviewDashboardProps {
  courseId: string;
}

export default function ReviewDashboard({ courseId }: ReviewDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const { reviewID } = router.query;

  const [review, setReview] = useState<Review | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  useSessionValidation('instructor', setLoading, setSession);

  useEffect(() => {
    if (reviewID) {
      // Fetch review data
      fetch(`/api/reviews/${reviewID}`)
        .then((response) => response.json())
        .then((data: Review) => {
          console.log("Fetched review data:", data);
          setReview(data);
        })
        .catch((error) => console.error('Error fetching review data:', error));

      // Fetch course data
      fetch(`/api/courses/${courseId}`)
        .then((response) => response.json())
        .then((data: CourseData) => {
          console.log("Fetched course data:", data);
          setCourseData(data);
        })
        .catch((error) => console.error('Error fetching course data:', error));
    }
  }, [reviewID]);

  if (!review || loading) {
    return <div className='w-[100vh=w] h-[100vh] instructor flex justify-center text-center items-center my-auto'>
    <Spinner color='primary' size="lg" />
</div>;
  }

  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return null;
  }

  const isAdmin = session.user.role === 'admin';

  const handleBackClick = async () => {
    router.back();
  };

  const handleHomeClick = async () => {
    router.push("/instructor/dashboard");
  };

  return (
    <>
      {isAdmin ? <AdminNavbar /> : <InstructorNavbar />}
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{review.reviewID ? `Review ${review.reviewID} Details` : "Review Details"}</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem onClick={handleBackClick}>{courseData ? courseData.courseName : "Course Dashboard"}</BreadcrumbItem>
            <BreadcrumbItem>{review.reviewID ? `Review ${review.reviewID}` : "Review"}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.assignmentsSection}>
        {review && (
  <ReviewDetailCard
    title={`Review ${review.reviewID}`}
    description={`Assignment: ${review.assignmentName}`}
    deadline={review.deadline}
  />
)}

        </div>
      </div>
    </>
  );
}
