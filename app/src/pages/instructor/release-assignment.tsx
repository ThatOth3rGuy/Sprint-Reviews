// release-assignment.tsx
// Import necessary libraries
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/instructor-assignments-creation.module.css";
import InstructorHeader from "../home/instructor-components/instructor-header";
import InstructorNavbar from "../home/instructor-components/instructor-navbar";

// Define the structure fro assignment and Rubric items
interface Assignment {
  assignmentID: number;
  title: string;
}

interface RubricItem {
  criterion: string;
  maxMarks: number;
}

const ReleaseAssignment: React.FC = () => {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<number | "">("");
  const [rubric, setRubric] = useState<RubricItem[]>([
    { criterion: "", maxMarks: 0 },
  ]);
  const [isGroupAssignment, setIsGroupAssignment] = useState(false);
  const [allowedFileTypes, setAllowedFileTypes] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [students, setStudents] = useState<{ id: number; name: string }[]>([]);
const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
const [uniqueDueDate, setUniqueDueDate] = useState<string>("");

  // Fetch assignments when the component mounts
  useEffect(() => {
    fetchAssignments();
    fetchStudents();
  }, []);
  // Function to handle changes in the assignment selection
  const fetchAssignments = async () => {
    try {
      const response = await fetch("/api/getAssignments");
      if (response.ok) {
        const data: Assignment[] = await response.json();
        setAssignments(data);
      } else {
        console.error("Failed to fetch assignments");
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

// function to handle selecting students
  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/getStudents");
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error("Failed to fetch students");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleStudentSelection = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };
  
  const handleUniqueDueDateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/setUniqueDueDate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentID: selectedAssignment,
          studentIDs: selectedStudents,
          dueDate: uniqueDueDate,
        }),
      });
  
      if (response.ok) {
        alert("Unique due date set successfully");
        setSelectedStudents([]);
        setUniqueDueDate("");
      } else {
        console.error("Failed to set unique due date");
      }
    } catch (error) {
      console.error("Error setting unique due date:", error);
    }
  };

  const handleAssignmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAssignment(Number(e.target.value));
  };
  // Function to handle changes in the rubric
  const handleRubricChange = (
    index: number,
    field: "criterion" | "maxMarks",
    value: string
  ) => {
    const updatedRubric = [...rubric];
    if (field === "maxMarks") {
      updatedRubric[index][field] = Number(value);
    } else {
      updatedRubric[index][field] = value;
    }
    setRubric(updatedRubric);
  };
  // Function to add a new rubric item
  const addRubricItem = () => {
    setRubric([...rubric, { criterion: "", maxMarks: 0 }]);
  };
  // Function to remove a rubric item
  const removeRubricItem = (index: number) => {
    const updatedRubric = rubric.filter((_, i) => i !== index);
    setRubric(updatedRubric);
  };
  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/releaseAssignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentID: selectedAssignment,
          rubric,
          isGroupAssignment,
          allowedFileTypes,
          deadline,
        }),
      });

      if (response.ok) {
        router.push("/instructor-dashboard");
      } else {
        console.error("Failed to release assignment");
      }
    } catch (error) {
      console.error("Error releasing assignment:", error);
    }
  };
  // Render the component
  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <InstructorHeader
        title="Assignments"
        addLink={[
          { href: "./create-assignment", title: "Create Assignment" },
          { href: "./release-assignment", title: "Release Assignment" },
        ]}
      />
      <InstructorNavbar />
      <div className={styles.rectangle}>
        <h1>Release Assignment For Peer Review</h1>
        <form onSubmit={handleSubmit}>
          <select
            className={styles.textbox}
            value={selectedAssignment}
            onChange={handleAssignmentChange}
            required
          >
            <option value="">Select an assignment</option>
            {assignments.map((assignment) => (
              <option
                key={assignment.assignmentID}
                value={assignment.assignmentID}
              >
                {assignment.title}
              </option>
            ))}
          </select>

          <div className={styles.rubricContainer}>
            <h2>Review Criteria</h2>
            {rubric.map((item, index) => (
              <div key={index} className={styles.rubricItem}>
                <input
                  type="text"
                  value={item.criterion}
                  onChange={(e) =>
                    handleRubricChange(index, "criterion", e.target.value)
                  }
                  placeholder="Review criterion"
                  className={styles.textbox}
                  required
                />
                <br />
                <label>Enter the maximum number of marks allowed:</label>
                <input
                  type="number"
                  value={item.maxMarks}
                  onChange={(e) =>
                    handleRubricChange(index, "maxMarks", e.target.value)
                  }
                  placeholder="Max marks"
                  className={styles.textbox}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeRubricItem(index)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
                <hr />
              </div>
            ))}
            <button
              type="button"
              onClick={addRubricItem}
              className={styles.criterion}
            >
              Add Criterion
            </button>
          </div>

          {/* handle rubric upload  here*/}
          
          {/* <input
            type="text"
            value={allowedFileTypes}
            onChange={(e) => setAllowedFileTypes(e.target.value)}
            placeholder="Allowed file types (e.g., pdf,docx,txt)"
            className={styles.textbox}
            required
          /> */}
          <br />
          <label>Enter Due Date:</label>
          <br />
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className={styles.textbox}
            required
          />
          <details>
            <summary>Advanced Options</summary>
            <details className={styles.innerAdvanced}>
              <summary>Change Student Groups</summary>
              <p className={styles.innerAdvanced}>
                List of Students in Course By Group
              </p>
            </details>
            <details className={styles.innerAdvanced}>
  <summary>Unique Due Date</summary>
  <form onSubmit={handleUniqueDueDateSubmit}>
    <div className={styles.studentList}>
      {students.map((student) => (
        <div key={student.id}>
          <input
            type="checkbox"
            id={`student-${student.id}`}
            checked={selectedStudents.includes(student.id)}
            onChange={() => handleStudentSelection(student.id)}
          />
          <label htmlFor={`student-${student.id}`}>{student.name}</label>
        </div>
      ))}
    </div>
    <input
      type="datetime-local"
      value={uniqueDueDate}
      onChange={(e) => setUniqueDueDate(e.target.value)}
      className={styles.textbox}
      required
    />
    <button type="submit" className={styles.setDueDate}>Set Unique Due Date</button>
  </form>
</details>
          </details>
          <br />
          <button type="submit" className={styles.release}>
            <b>Release</b>
          </button>
        </form>
      </div>
    </>
  );
};

export default ReleaseAssignment;