import { useRouter } from "next/router";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import ReviewDetailCard from '../components/instructor-components/instructor-review-details';
import AdminNavbar from "../components/admin-components/admin-navbar";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import styles from "../../styles/AssignmentDetailCard.module.css";

import { Breadcrumbs,Input,ModalFooter, BreadcrumbItem,ModalContent, Spinner, Card, CardBody, Button, Checkbox, Modal, ModalBody, ModalHeader } from "@nextui-org/react";
import { randomizePeerReviewGroups } from "../api/addNew/randomizationAlgorithm";
import toast from "react-hot-toast";

interface Review {
  reviewID: number;
  assignmentID: number;
  assignmentName: string;
  isGroupAssignment: boolean;
  allowedFileTypes: string;
  startDate: string;
  endDate: string;
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

interface StudentDetails {
  studentID: number;
  firstName: string;
  lastName: string;
}

interface ReviewGroup {
  reviewee?: StudentDetails;
  reviewers: StudentDetails[];
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
  const [courseName, setCourseName] = useState<string>("");
  const [autoRelease, setAutoRelease] = useState<boolean>(false);
  const [newDueDate, setNewDueDate] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newAnonymous, setNewAnonymous] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    const { source, courseId } = router.query;

    if (source === 'course' && courseId) {
      // Fetch course name
      fetchCourseName(courseId as string);
    }
  }, [router.query]);

  const fetchCourseName = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setCourseName(data.courseName);
      }
    } catch (error) {
      console.error('Error fetching course name:', error);
    }
  };

  useEffect(() => {
    if (reviewID) {
      // Fetch review data
      fetch(`/api/reviews/${reviewID}`)
        .then((response) => response.json())
        .then((data: Review) => {
          setReview(data);
        })
        .catch((error) => console.error('Error fetching review data:', error));
    }
  }, [reviewID]);

  useEffect(() => {
    if (review) {
      fetch(`/api/groups/${review.assignmentID}`)
        .then((response) => response.json())
        .then((data) => {
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

  const handleBackClick = () => { //redirect to course dashboard or all assignments
    const { source } = router.query;
    if (source === 'course') {
      router.push(`/instructor/course-dashboard?courseId=${router.query.courseId}`);
    } else {
      router.push('/instructor/dashboard');
    }
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

  const handleRelease = async () => {
    try {
      const response = await fetch('/api/reviews/releaseReviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignmentID: review?.assignmentID }),
      });

      if (response.ok) {
        toast.success("Review Released successfully!");
        router.back();
      } else {
        console.error('Failed to release assignment for reviews');
      }
    } catch (error) {
      console.error('Error releasing assignment for reviews:', error);
    }
  };

//handle auto-release of assignment on start date
const handleAutoReleaseChange = async (checked: boolean) => { 
  setAutoRelease(checked);
  if (checked) {
    try {
      const response = await fetch('/api/reviews/scheduleAutoRelease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignmentID: review?.assignmentID, startDate: review?.startDate }),
      });

      if (response.ok) {
        toast.success("Auto-release scheduled successfully!");
      } else {
        console.error('Failed to schedule auto-release');
      }
    } catch (error) {
      console.error('Error scheduling auto-release:', error);
    }
  }
};


const handleEditAssignmentClick = () => {
  setIsModalOpen(true);
}

const handleAssignmentsUpdate = async () => {
    try {
      const response = await fetch(`/api/updateTable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          table: 'reviewDates',
          data: {
            reviewID: reviewID,            
            startDate: newStartDate,
            endDate: newEndDate,
            dueDate: newDueDate,
            
          }
        })
      }); if (response.ok) {
        console.log("Assignment updated successfully");
        toast.success("Assignment updated successfully");
        setIsModalOpen(false);
        router.reload();
      } else {
        console.error("Failed to update assignment");
        toast.error("Failed to update assignment");
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast.error("Error updating assignment");
    }
  };

  return (
    <>
      {isAdmin ? <AdminNavbar /> : <InstructorNavbar />}
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{review.reviewID ? `Review For ${review.assignmentName}` : "Review Details"}</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem onClick={handleBackClick}>{router.query.source === 'course' ? (courseName || 'Course Dashboard') : 'Course Dashboard'}</BreadcrumbItem>
            <BreadcrumbItem>{review.reviewID ? `Review ${review.assignmentName}` : "Review"}</BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <div className={styles.assignmentsSection}>
          <Button color="secondary" variant="ghost" onClick={handleRandomizeClick}>Randomize Review Groups</Button>
        <Button color='primary' variant='ghost' onClick={handleEditAssignmentClick} >Edit Review Dates</Button>

          {review && (
            <ReviewDetailCard
              title={`Review ${review.assignmentName}`}
              description={`Assignment: ${review.assignmentName}`}
              deadline={review.deadline}
              startDate={review.startDate}
              endDate = {review.endDate}
            />
          )}
          <div className={styles.assignmentsSection}>
            <h2>Total Review Groups: {reviewGroups.length}</h2>
            {reviewGroups.map((group, groupIndex) => (
              <div key={groupIndex} className={styles.courseCards}>
                <Card className={styles.assignmentCard}>
                  <CardBody>
                    {group.reviewee ? (
                      <>
                        <h3 className={styles.assignmentTitle}>{`Student: ${group.reviewee.firstName} ${group.reviewee.lastName}`}</h3>
                        <div className={styles.assignmentDescription}>
                          {group.reviewers.map((reviewer, reviewerIndex) => (
                            <p key={reviewerIndex}>
                              Assigned submission for: {reviewer.firstName} {reviewer.lastName}, ({reviewer.studentID})
                            </p>
                          ))}
                        </div>
                        <p>Total students in this group: {group.reviewers.length}</p>
                      </>
                    ) : (
                      <p>Group data is not available.</p>
                    )}
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
          <div className={styles.notificationsSection}>
          <Checkbox
          isSelected={autoRelease}
          onChange={(e) => handleAutoReleaseChange(e.target.checked)}
        >
          Auto Release on Start Date
        </Checkbox>
            <Button color="primary" variant="ghost" onClick={handleRelease}>Release Assignment for Reviews</Button>
          </div>
          <Modal
            className='z-20'
            backdrop="blur"
            isOpen={isModalOpen}
            onOpenChange={(open) => setIsModalOpen(open)}
          >
            <ModalContent>
            <ModalHeader>Edit Assignment Details</ModalHeader>
              <ModalBody>
              <h3>Select New Start Date:</h3>
                <Input
                  color="success"
                  variant="underlined"
                  size="sm"
                  type="datetime-local"
                  className={styles.textbox}
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <h3>Select New Due Date:</h3>
                <Input
                  color="warning"
                  variant="underlined"
                  size="sm"
                  type="datetime-local"
                  className={styles.textbox}
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <h3>Select New End Date:</h3>
                <Input
                  color="danger"
                  variant="underlined"
                  size="sm"
                  type="datetime-local"
                  className={styles.textbox}
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <Checkbox
          isSelected={newAnonymous}
          onChange={(e) => setNewAnonymous(e.target.checked)}
        >
          Anonymous
        </Checkbox>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={() => setIsModalOpen(false)}>
                  Close
                </Button>
                <Button color="primary" onPress={handleAssignmentsUpdate}>
                  Update
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </>
  );
}
