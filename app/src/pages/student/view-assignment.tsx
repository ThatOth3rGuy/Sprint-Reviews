import { useEffect, useState } from "react";
import StudentHeader from "../home/student-components/student-header";
import StudentNavbar from "../home/student-components/student-navbar";
import styles from "../../styles/student-assignment.module.css";
import { useRouter } from 'next/router';

interface Assignment {
  assignmentID: number;
  title: string;
  description: string;
  deadline: string;
  // Add other fields as necessary
}

interface ReviewCriteria {
  criteriaID: number;
  criterion: string;
  maxMarks: number;
}

export default function Page() {
  const [feedback, setFeedback] = useState("");
  const [reviewCriteriaData, setReviewCriteriaData] = useState<ReviewCriteria[]>([]);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const router = useRouter();
  const { assignmentId } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      if (typeof assignmentId !== 'string') return;

      try {
        // Fetch assignments
        const assignmentsResponse = await fetch('/api/getAssignments');
        if (!assignmentsResponse.ok) throw new Error('Failed to fetch assignments');
        const assignments: Assignment[] = await assignmentsResponse.json();
        
        // Find the specific assignment
        const currentAssignment = assignments.find(a => a.assignmentID === parseInt(assignmentId));
        if (!currentAssignment) throw new Error('Assignment not found');
        setAssignment(currentAssignment);

        // Fetch review criteria 
        const criteriaResponse = await fetch(`/api/getReviewCriteria?assignmentId=${assignmentId}`);
        if (!criteriaResponse.ok) throw new Error('Failed to fetch review criteria');
        const criteriaData = await criteriaResponse.json();
        setReviewCriteriaData(criteriaData);

        // Fetch student ID 
        const userID = "1"; // Replace with actual user ID
        const studentResponse = await fetch(`/api/getStudentId?userID=${userID}`);
        if (!studentResponse.ok) throw new Error('Failed to fetch student ID');
        const studentData = await studentResponse.json();
        setStudentId(studentData.studentId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (assignmentId) {
      fetchData();
    }
  }, [assignmentId]);

  const handleFeedbackChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!assignmentId || !studentId) {
      console.error("Missing assignment ID or student ID");
      return;
    }

    try {
      const response = await fetch("/api/submitFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentID: assignmentId,
          studentID: studentId,
          content: feedback,
        }),
      });

      if (response.ok) {
        console.log("Feedback submitted successfully");
        setFeedback("");
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  if (!assignment) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <br />
      <br />
      <br />
      <StudentHeader
        title="Course Name" //TODO: fetch course name
        addLink={[
          { href: "./all-assignments", title: "View All" },
          { href: "./peer-eval-assignments", title: "Peer Evaluations" },
        ]}
      />
      <StudentNavbar />

      <div className={styles.reviewForm}>
        <h2>{assignment.title}</h2>
        <p>{assignment.description}</p>
        <p>Due: {new Date(assignment.deadline).toLocaleString()}</p>

        <h3>Review Criteria</h3>
        {reviewCriteriaData.map((criteria) => (
          <div key={criteria.criteriaID}>
            <h4>{criteria.criterion}</h4>
            <p>Max Marks: {criteria.maxMarks}</p>
          </div>
        ))}

        <form onSubmit={handleSubmit}>
          <label>
            Feedback:
            <textarea value={feedback} onChange={handleFeedbackChange} />
          </label>
          <button type="submit">Submit Feedback</button>
        </form>
      </div>
    </>
  );
}