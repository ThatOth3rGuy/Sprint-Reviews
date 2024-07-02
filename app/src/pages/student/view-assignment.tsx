import { useEffect, useState } from "react";
import StudentHeader from "../home/student-components/student-header";
import StudentNavbar from "../home/student-components/student-navbar";
import styles from "../../styles/student-assignment.module.css";

export default function Page() {
  const [feedback, setFeedback] = useState("");

  const handleFeedbackChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFeedback(event.target.value);
  };

  const getReviewCriteriaData = async (assignmentId: number) => {
    // Replace with your actual API endpoint
    const response = await fetch(
      `/api/getReviewCriteria?assignmentID=${assignmentId}`
    );

    if (!response.ok) {
      throw new Error("Failed to get review criteria");
    }

    const data = await response.json();
    return data;
  };

  const [reviewCriteriaData, setReviewCriteriaData] = useState<
    ReviewCriteria[]
  >([]);

  useEffect(() => {
    const fetchReviewCriteriaData = async () => {
      try {
        const data = await getReviewCriteriaData(YOUR_ASSIGNMENT_ID_HERE);
        setReviewCriteriaData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchReviewCriteriaData();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // TODO: Replace with your actual API endpoint and student ID
    const response = await fetch("/api/submitFeedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assignmentID:
          "YOUR_ASSIGNMENT_ID_HERE" /* TODO: update to store assignment and student id */,
        studentID: "YOUR_STUDENT_ID_HERE",
        content: feedback,
      }),
    });

    if (response.ok) {
      console.log("Feedback submitted successfully");
      setFeedback("");
    } else {
      console.error("Failed to submit feedback");
    }
  };

  return (
    <>
      <br />
      <br />
      <br />
      <StudentHeader
        title="Course Name"
        addLink={[
          { href: "./all-assignments", title: "View All" },
          { href: "./peer-eval-assignments", title: "Peer Evaluations" },
        ]}
      />
      <StudentNavbar />

      {/* TODO: Replace with your actual criteria */}
      <div className={styles.reviewForm}>
        <h2>Criteria</h2>
        <p>Criterion 1: ...</p>
        <p>Criterion 2: ...</p>
        <p>Criterion 3: ...</p>

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
