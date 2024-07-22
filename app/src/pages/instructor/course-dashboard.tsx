import { useRouter } from "next/router";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import { useEffect, useState, useCallback } from "react";
import { useSessionValidation } from "../api/auth/checkSession";
import styles from "../../styles/instructor-course-dashboard.module.css";
import InstructorAssignmentCard from "../components/instructor-components/instructor-assignment-card";
import {
  Button,
  Breadcrumbs,
  BreadcrumbItem,
  Listbox,
  ListboxItem,
  Divider,
  Checkbox,
  CheckboxGroup,
  Spinner,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from "@nextui-org/react";
import InstructorReviewCard from "../components/instructor-components/instructor-PR-card";

interface CourseData {
  courseID: string;
  courseName: string;
}

interface Assignment {
  assignmentID: number;
  linkedAssignmentID: number;
  title: string;
  description: string;
  deadline: string;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [peerReviewAssignments, setPeerReviewAssignments] = useState<Assignment[]>([]);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  const router = useRouter();
  const { courseId } = router.query;

  useSessionValidation("instructor", setLoading, setSession);

  useEffect(() => {
    if (courseId) {
      fetchAssignments(courseId);
      fetchPeerReviewAssignments(courseId);
      fetch(`/api/courses/${courseId}`)
        .then((response) => response.json())
        .then((data: CourseData) => {
          console.log("Fetched course data:", data);
          setCourseData(data);
        })
        .catch((error) => console.error("Error fetching course data:", error));
    }
  }, [courseId]);

  const handleHomeClick = async () => {
    router.push("/instructor/dashboard");
  };

  const fetchAssignments = async (courseID: string | string[]) => {
    try {
      const response = await fetch(
        `/api/assignments/getAssignments4CoursesInstructor?courseID=${courseID}`
      );
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.courses);
      } else {
        console.error("Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchPeerReviewAssignments = async (courseID: string | string[]) => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(
        `/api/reviews/getReviewsByCourseId?courseID=${courseID}&t=${timestamp}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched peer review assignments:", data);
        setPeerReviewAssignments(data.reviews || []);
      } else {
        console.error("Failed to fetch peer review assignments");
      }
    } catch (error) {
      console.error("Error fetching peer review assignments:", error);
    }
  };

  const archiveCourse = useCallback(async () => {
    try {
      const response = await fetch('/api/courses/archiveCourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseID: courseId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle archive status');
      }

      router.push("/instructor/dashboard");
    } catch (error) {
      console.error('Error toggling archive status:', error);
    }
  }, [courseId, router]);

  if (!courseData || loading) {
    return (
      <div className='w-[100vw] h-[100vh] instructor flex justify-center text-center items-center my-auto'>
        <Spinner color='primary' size="lg" />
      </div>
    );
  }

  if (!session || !session.user || !session.user.userID) {
    console.error("No user found in session");
    return null;
  }

  const isAdmin = session.user.role === "admin";

  const handleCreateAssignmentClick = () => {
    router.push("/instructor/create-assignment");
  };

  const handleCreatePeerReviewAssignmentClick = () => {
    router.push("/instructor/release-assignment");
  };

  const handleCreateGroupPeerReviewAssignmentClick = () => {
    router.push("/instructor/create-groups");
  };

  const handleAction = (key: any) => {
    switch (key) {
      case "create":
        handleCreateAssignmentClick();
        break;
      case "peer-review":
        handleCreatePeerReviewAssignmentClick();
        break;
      case "group-review":
        handleCreateGroupPeerReviewAssignmentClick();
        break;
      case "archive":
        setIsArchiveModalOpen(true);
        break;
      default:
        console.log("Unknown action:", key);
    }
  };

  return (
    <>
      {isAdmin ? <AdminNavbar /> : <InstructorNavbar />}
      <div className={`instructor text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>{courseData.courseName}</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem>{courseData.courseName}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.assignmentsSection}>
            <CheckboxGroup
              label="Select assignment type:"
              orientation="horizontal"
              color="primary"
              size="sm"
              className="text-left flex-row mb-2 text-primary-900 "
            >
              <Checkbox value="assignments">All Assignments</Checkbox>
              <Checkbox value="peerReviews">Peer Reviews</Checkbox>
              <Checkbox value="peerEvaluations">Peer Evaluations</Checkbox>
            </CheckboxGroup>
            <h3 className={styles.innerTitle}>Assignments Created</h3>
            <br /> <Divider className="instructor bg-secondary" /> <br />
            <div className={styles.courseCard}>
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <div
                    key={assignment.assignmentID}
                    className={styles.courseCard}
                  >
                    <InstructorAssignmentCard 
                      courseID={assignment.assignmentID}
                      courseName={assignment.title}
                      color="#9fc3cf"
                    />
                  </div>
                ))
              ) : (
                <p>No assignments found for this course.</p>
              )}
            </div>
            <h3 className={styles.innerTitle}>Peer Reviews Created</h3>
            <br />
            <Divider className="instructor bg-secondary" />
            <br />
            <div className={`w-100% ${styles.courseCard}`}>
              {peerReviewAssignments && peerReviewAssignments.length > 0 ? (
                peerReviewAssignments.map((assignment) => (
                  <div
                    key={assignment.assignmentID}
                    className={`w-100% ${styles.courseCard}`}
                  >
                    <InstructorReviewCard
                      reviewID={assignment.assignmentID}
                      linkedAssignmentID={assignment.linkedAssignmentID}
                      color="#9fc3cf"
                    />
                  </div>
                ))
              ) : (
                <p>No peer review assignments found for this course.</p>
              )}
            </div>
          </div>
          <div className={styles.notificationsSection}>
            <div className={styles.actionButtons}>
              <Listbox aria-label="Actions" onAction={handleAction}>
                <ListboxItem key="create">Create Assignment</ListboxItem>
                <ListboxItem key="peer-review">Create Peer Review</ListboxItem>
                <ListboxItem key="group-review">Create Student Groups</ListboxItem>
                {isAdmin ? (
                  <ListboxItem key="archive" 
                  className="text-danger"
                  color="danger"
                  >
                    Archive Course
                  </ListboxItem>
                ) : null}
              </Listbox>
            </div>
            <hr />
            <h2 className="my-3">Notifications</h2>
            <div className={styles.notificationsContainer}>
              <div className={styles.notificationCard}>Dummy Notification</div>
            </div>
          </div>
        </div>

        {/* Archive Course Confirmation Modal */}
        <Modal 
          className='z-20' 
          backdrop="blur" 
          isOpen={isArchiveModalOpen} 
          onOpenChange={(open) => setIsArchiveModalOpen(open)}
        >
          <ModalContent>
            <ModalHeader>Archive Course</ModalHeader>
            <ModalBody>
              <p>Are you sure you want to archive this course? This action can be undone.</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={() => setIsArchiveModalOpen(false)}>
                Close
              </Button>
              <Button color="danger" onClick={archiveCourse}>
                Archive
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
