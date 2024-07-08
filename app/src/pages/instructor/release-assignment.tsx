// release-assignment.tsx
// Import necessary libraries
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSessionValidation } from '../api/auth/checkSession';        
import styles from "../../styles/instructor-assignments-creation.module.css";
import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import Modal from "react-modal";
import Select from 'react-select';

// Define the structure fro assignment and Rubric items
interface Assignment {
  assignmentID: number;
  title: string;
}

interface RubricItem {
  criterion: string;
  maxMarks: number;
}
interface ReleaseAssignmentProps {
  courseID: string;
}

interface Student {
  id: string;
  name: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('instructor', setLoading, setSession);

  if (loading) {
    return <p>Loading...</p>;
  }
  //handle open and close for modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Fetch assignments ans students in course when the component mounts
  useEffect(() => {
    fetchAssignments();  
  },[]);
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
  // const fetchStudents = async () => {
  //   try {
  //     const response = await fetch("/api/getStudents");
  //     if (response.ok) {
  //       const data = await response.json();
  //       setStudents(data);
  //     } else {
  //       console.error("Failed to fetch students");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching students:", error);
  //   }
  // };
 // release-assignment.tsx

 const fetchStudents = async (courseID: undefined) => {
  try {
    const response = await fetch(`/api/getStudentsInCourse?courseID=${courseID}`);
    if (response.ok) {
      const students = await response.json();
      setStudents(students);
    } else {
      console.error("Failed to fetch students");
    }
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};



  const handleStudentSelection = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // const handleStudentSelection = (studentId: number) => {
  //   setSelectedStudents((prev) =>
  //     prev.includes(studentId)
  //       ? prev.filter((id) => id !== studentId)
  //       : [...prev, studentId]
  //   );
  // };

  // const handleUniqueDueDateSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch("/api/setUniqueDueDate", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         assignmentID: selectedAssignment,
  //         studentIDs: selectedStudents,
  //         dueDate: uniqueDueDate,
  //       }),
  //     });

  //     if (response.ok) {
  //       alert("Unique due date set successfully");
  //       setSelectedStudents([]);
  //       setUniqueDueDate("");
  //     } else {
  //       console.error("Failed to set unique due date");
  //     }
  //   } catch (error) {
  //     console.error("Error setting unique due date:", error);
  //   }
  // };
  const handleStudentSelectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/selectStudentsForAssignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentID: selectedAssignment,
          studentIDs: selectedStudents,
          uniqueDeadline: uniqueDueDate,
        }),
      });
  
      if (response.ok) {
        alert("Students selected successfully");
        setSelectedStudents([]);
        setUniqueDueDate("");
      } else {
        console.error("Failed to select students");
      }
    } catch (error) {
      console.error("Error selecting students:", error);
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
  const options = students.map((student) => ({
    value: student.id,
    label: student.name,
  }));
  // Render the component

  // If the session exists, check if the user is an admin
  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return;
  }
  const isAdmin = session.user.role === 'admin';

  return (
    <>
      <br />
      <br />
      <br />
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
          <button onClick={openModal} className={styles.advancedButton}>Advanced Options</button>

          <Modal isOpen={isModalOpen} onRequestClose={closeModal} className={styles.advancedOptions}>
            <h2>Advanced Options</h2>
            <div className={styles.innerAdvanced}>
              <h3>Select Students: </h3>
              <p className={styles.innerAdvanced}>
              {/* todo */}
                <Select
                  options={options}
                  isMulti
                  onChange={(selectedOptions) => {
                    const selectedStudentIds = selectedOptions.map((option) => option.value);
                    setSelectedStudents(selectedStudentIds);
                  }}
                />
              </p>
            </div>
            <div className={styles.innerAdvanced}>
              <h3>Unique Due Date</h3>
              <form onSubmit={handleStudentSelectionSubmit}>
                <div className={styles.studentList}>
                  {students.map((student) => (
                    <div key={student.id}>
                      <input
                        type="checkbox"
                        id={`student-${student.id}`}
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleStudentSelection(student.id)}
                      />
                      <label htmlFor={`student-${student.id}`}>
                        {student.name}
                      </label>
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
                <button type="submit" className={styles.setDueDate}>
                  Set Unique Due Date
                </button>
              </form>
              <button onClick={closeModal} className={styles.closeModal}>Close</button>
            </div>
          </Modal>
          <br />
          <button type="submit" className={styles.release}>
            <b>Release</b>
          </button>
        </form>
      </div>
      {isAdmin ? (
        <>
          <AdminHeader title="Assignments"
          addLink={[{href: "./create-assignment", title: "Create Assignment"}, {href: "#", title: "Release Assignment"}]}/>
          <AdminNavbar />
        </>
      ) : (
        <>
          <InstructorHeader title="Assignments"
          addLink={[{href: "./create-assignment", title: "Create Assignment"}, {href: "#", title: "Release Assignment"}]}/>
          <InstructorNavbar />
        </>
      )}
    </>
  );
};

export default ReleaseAssignment;
