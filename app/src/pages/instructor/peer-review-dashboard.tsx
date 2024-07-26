import { useRouter } from "next/router";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import ReviewDetailCard from '../components/instructor-components/instructor-review-details';
import AdminNavbar from "../components/admin-components/admin-navbar";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import styles from "../../styles/AssignmentDetailCard.module.css";
import { Breadcrumbs, BreadcrumbItem, Spinner, Card, CardBody, Button, ListboxItem, Listbox } from "@nextui-org/react";
import { randomizePeerReviewGroups } from "../api/addNew/randomizationAlgorithm";

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

interface ReviewGroup {
  studentID: number;
  submissionID: number;
  assignedSubmissionId: number;
  groupData: any; // You may want to define a more specific type based on the actual data structure
}

export default function ReviewDashboard({ courseId }: ReviewDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const { reviewID } = router.query;

  const [review, setReview] = useState<Review | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [reviewGroups, setReviewGroups] = useState<ReviewGroup[][]>([]);
  const [randomizedReviewGroups, setRandomizedReviewGroups] = useState<ReviewGroup[][]>([]);

  useSessionValidation('instructor', setLoading, setSession);

  useEffect(() => {
    if (session && session.user && session.user.userID) {
      fetchCourses(session.user.userID);
    }
  }, [session]);

  const fetchCourses = async (instructorID: number) => {
    try {
      const response = await fetch(`/api/getCourse4Instructor?instructorID=${instructorID}`);
      if (response.ok) {
        const data = await response.json();
        setCourseData(data.courses);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    if (reviewID) {
      // Fetch review data
      fetch(`/api/reviews/${reviewID}`)
        .then((response) => response.json())
        .then((data: Review) => {
          console.log("Fetched review data:", data);
          setReview(data);
          console.log("Review data: ", data);
        })
        .catch((error) => console.error('Error fetching review data:', error));
    }
  }, [reviewID]);

  useEffect(() => {
    if (review) {
      fetch(`/api/groups/${review.assignmentID}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched group data:", data);
          if (data.groups && Array.isArray(data.groups)) {
            setReviewGroups(data.groups);
          } else {
            console.error('Unexpected data structure:', data);
          }
        })
        .catch((error) => console.error('Error fetching group data:', error));
    }
  }, [review]);

  if (!review || loading) {
    return (
      <div className='w-[100vh=w] h-[100vh] instructor flex justify-center text-center items-center my-auto'>
        <Spinner color='primary' size="lg" />
      </div>
    );
  }

  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return null;
  }

  const isAdmin = session.user.role === 'admin';

  const handleBackClick = () => {
    router.back();
  };

  const handleHomeClick = () => {
    router.push("/instructor/dashboard");
  };
  const handleRandomizeClick = async () => {
    // // TODO: Call the randomizer API and update the reviewGroups state with the randomized data
    // try {
    //   // Fetch all student submissions
    //   const response = await fetch(`/api/assignments/getSubmissionsList`);
    //   if (!response.ok) {
    //     throw new Error("Failed to fetch student submissions");
    //   }
    //   const studentSubmissions = await response.json();
  
    //   // Randomize the student submissions
    //   const reviewGroups = randomizePeerReviewGroups(studentSubmissions, 4); // 4 reviews per assignment
  
    //   // Set the randomized review groups state
    //   setRandomizedReviewGroups(reviewGroups);
    // } catch (error) {
    //   console.error("Error randomizing review groups:", error);
    // }
    console.log("Randomize button clicked");
  };
  function handleRelease(): void {
    router.push("/instructor/dashboard");
  }

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
            <BreadcrumbItem>{review.reviewID ? `Review ${review.assignmentName}` : "Review"}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.assignmentsSection}>
        
        <Button color="secondary" variant="ghost" onClick={handleRandomizeClick}>Randomize Review Groups</Button>
       

          {review && (
            <ReviewDetailCard
              title={`Review ${review.assignmentName}`}
              description={`Assignment: ${review.assignmentName}`}
              deadline={review.deadline}
            />
          )}
          <div className={styles.assignmentsSection}>
            <h2>Total Review Groups: {reviewGroups.length}</h2>
            {reviewGroups.map((group, groupIndex) => (
              <div key={groupIndex} className={styles.courseCards}>
                <Card className={styles.assignmentCard}>
                  <CardBody>
                    <h3 className={styles.assignmentTitle}>{`Student ID: ${group[0].studentID}`}</h3>
                    <div className={styles.assignmentDescription}>
                      {group.map((student, studentIndex) => (
                        <p key={studentIndex}>
                          Assigned  Submission ID: {student.submissionID},
                          
                        </p>
                      ))}
                    </div>
                    <p>Total students in this group: {group.length}</p>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
          <div className={styles.notificationsSection}>
          <Button color="primary" variant="ghost" onClick={handleRelease}>Release Assignment for Reviews</Button>
          </div>
        </div>
      </div>
    </>
  );
}