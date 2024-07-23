import { useRouter } from "next/router";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import ReviewDetailCard from '../components/instructor-components/instructor-review-details'; // Import the new component
import AdminNavbar from "../components/admin-components/admin-navbar";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import styles from "../../styles/AssignmentDetailCard.module.css";
import { Listbox,ListboxItem,Breadcrumbs, BreadcrumbItem, Spinner, Card, CardBody } from "@nextui-org/react";
import { group } from "console";

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
interface SubmissionGroups{
  submissions: {submissionID: string, studentID: string}[];
}

export default function ReviewDashboard({ courseId }: ReviewDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const { reviewID } = router.query;

  const [review, setReview] = useState<Review | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [submissionGroups , setsubmissionGroups ] = useState<SubmissionGroups | null>(null);

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
      fetch(`/api/courses/${3}`)
        .then((response) => response.json())
        .then((data: CourseData) => {
          console.log("Fetched course data:", data);
          setCourseData(data);
        })
        .catch((error) => console.error('Error fetching course data:', error));
      }
      }, [reviewID]);
    useEffect(() => {
     if (review) { 
      fetch(`/api/groups/${review.assignmentID}`)
      .then((response) => response.json())
      .then((data: SubmissionGroups) => {
        console.log("Fetched group data:", data);
        setsubmissionGroups(data);
      })
      .catch((error) => console.error('Error fetching group data:', error));  
    }
  } , [review]);

  if (!review || loading) {
    return <Spinner color='primary' size="lg" className='instructor' />;
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
  console.log(submissionGroups?.submissions[0].studentID);
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
        <div className={styles.assignmentsSection}>
          {submissionGroups?.submissions.map((group, groupIndex) => (
            <div key={groupIndex} className={styles.courseCards}>
              <Card className={styles.assignmentCard}>
                <CardBody>
                  <h2 className={styles.assignmentTitle}>{`Submission Group: ${group.submissionID}`}</h2>
                  <div className={styles.assignmentDescription}>
                    <p>Student IDs:</p>
                    <ul>
                      {submissionGroups?.submissions.map((submission: { submissionID: string; studentID: string }) => (
                        <li key={submission.studentID}>{submission.studentID}</li>
                      ))}
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
}