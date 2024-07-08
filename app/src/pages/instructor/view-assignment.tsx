// view-assignment.tsx
// Import necessary libraries
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "../../styles/instructor-assignments-creation.module.css";
import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import { useSessionValidation } from '../api/auth/checkSession';
        
// Define the structure fro assignment and Rubric items
interface Assignment { 
  assignmentID: number;
  title: string;
}

interface RubricItem {
  criterion: string;
  maxMarks: number;
}

const ViewAssignment: React.FC = () => {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<number | ''>('');
  const [rubric, setRubric] = useState<RubricItem[]>([{ criterion: '', maxMarks: 0 }]);
  const [isGroupAssignment, setIsGroupAssignment] = useState(false);
  const [allowedFileTypes, setAllowedFileTypes] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  const [students, setStudents] = useState<{ userID: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('instructor', setLoading, setSession);
  
// Fetch assignments when the component mounts
  useEffect(() => {
    fetchAssignments();
  }, []);

// Function to handle changes in the assignment selection
  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/getAssignments');
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      } else {
        console.error('Failed to fetch assignments');
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleAssignmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAssignment(Number(e.target.value));
  };
 // Function to handle changes in the rubric
  const handleRubricChange = (index: number, field: 'criterion' | 'maxMarks', value: string) => {
    const updatedRubric = [...rubric];
    if (field === 'maxMarks') {
      updatedRubric[index][field] = Number(value);
    } else {
      updatedRubric[index][field] = value;
    }
    setRubric(updatedRubric);
  };
// Function to add a new rubric item
  const addRubricItem = () => {
    setRubric([...rubric, { criterion: '', maxMarks: 0 }]);
  };
 // Function to remove a rubric item
  const removeRubricItem = (index: number) => {
    const updatedRubric = rubric.filter((_, i) => i !== index);
    setRubric(updatedRubric);
  };
// Function to get entered students to the assignment NEED TO ADD THIS FUNCTION TO FORM
  const findStudents = async () => {
    try {
      const response = await fetch('/api/getStudent');
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students);
      } else {
        console.error('Failed to fetch student');
      }
    } catch (error) {
      console.error('Error fetching student:', error);
    }
  };
// Function to assign students to the assignment CALL assignStudents
  const assignStudents = async () => {
    try {
      const response = await fetch('/api/assignStudent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentIDs: students.map((student) => student.userID),
          assignmentID: selectedAssignment,
        }),
      });

      if (response.ok) {
        console.log('Students assigned to assignment');
      } else {
        console.error('Failed to assign students to assignment');
      }
    } catch (error) {
      console.error('Error assigning students to assignment:', error);
    }
  };

// Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/releaseAssignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentID: selectedAssignment,
          rubric,
          isGroupAssignment,
          allowedFileTypes,
          deadline,
          // need to account for optionally added students
        }),
      });

      if (response.ok) {
        router.push('/instructor-dashboard');
      } else {
        console.error('Failed to release assignment');
      }
    } catch (error) {
      console.error('Error releasing assignment:', error);
    }
  };
        
  // If the session exists, check if the user is an admin
  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return;
  }
  const isAdmin = session.user.role === 'admin';
        
// Render the component
  return (
    <div className={styles.container}>
        {isAdmin ? (
        <>
          <AdminHeader title="Course Name"
        addLink={[
          { href: "./all-assignments", title: "View All" },
          { href: "./peer-eval-assignments", title: "Peer Evaluations" }
        ]}
      />
          <AdminNavbar />
        </>
      ) : (
        <>
          <InstructorHeader title="Course Name"
        addLink={[
          { href: "./all-assignments", title: "View All" },
          { href: "./peer-eval-assignments", title: "Peer Evaluations" }
        ]}
      />
          <InstructorNavbar />
        </>
      )}
      <div className={styles.rectangle}>
        <h1>Release Assignment</h1>
        <form onSubmit={handleSubmit}>
          <select
            className={styles.textbox}
            value={selectedAssignment}
            onChange={handleAssignmentChange}
            required
          >
            <option value="">Select an assignment</option>
            {assignments.map((assignment) => (
              <option key={assignment.assignmentID} value={assignment.assignmentID}>
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
                  onChange={(e) => handleRubricChange(index, 'criterion', e.target.value)}
                  placeholder="Review criterion"
                  className={styles.textbox}
                  required
                />
                <input
                  type="number"
                  value={item.maxMarks}
                  onChange={(e) => handleRubricChange(index, 'maxMarks', e.target.value)}
                  placeholder="Max marks"
                  className={styles.textbox}
                  required
                />
                <button type="button" onClick={() => removeRubricItem(index)} className={styles.removeButton}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addRubricItem} className={styles.addButton}>
              Add Criterion
            </button>
          </div>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={isGroupAssignment}
              onChange={(e) => setIsGroupAssignment(e.target.checked)}
            />
            Group Assignment
          </label>

          <input
            type="text"
            value={allowedFileTypes}
            onChange={(e) => setAllowedFileTypes(e.target.value)}
            placeholder="Allowed file types (e.g., pdf,docx,txt)"
            className={styles.textbox}
            required
          />

          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className={styles.textbox}
            required
          />
          {/* Need to add a way to manually add students to the assignment form */}
          {/* <input 
            type="text"
            value={students.map((student) => student.userID).join(',')}
            onChange={(e) => setStudents(e.target.value)}
            placeholder="Student ID"
            className={styles.textbox}
          /> */}
          <button type="submit" className={styles.button}>
            <div></div>
            <b>Release Assignment</b>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ViewAssignment;
