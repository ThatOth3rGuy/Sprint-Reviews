import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import { useState, useEffect } from 'react';
import { useSessionValidation } from '../api/auth/checkSession';
import { Card } from 'react-bootstrap';

interface Assignment {
  assignmentID: number;
  title: string;
  description: string;
  deadline: string;
  rubric?: string;
  file?: string;
  submissions?: Submission[];
}

interface Submission {
  studentID: number;
  submissionDate: string;
  file: string;
}

const ViewAssignments = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  // Use the session validation hook to check if the user is logged in
  useSessionValidation('instructor', setLoading, setSession);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/getAssignments')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Received assignments:', data);
        setAssignments(data);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        setError('Failed to fetch assignments. Please try again later.');
      });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

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
      
      <div>
        <h1>Assignments</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment.assignmentID}>
              <h2>{assignment.title}</h2>
              <p>{assignment.description}</p>
              <p>Due date: {formatDate(assignment.deadline)}</p>
              {assignment.rubric && <p>Rubric: {assignment.rubric}</p>}
              {assignment.file && <p>Instructor file: <a href={assignment.file} download>Download</a></p>}
              <h3>Submissions:</h3>
              <ul>
                {assignment.submissions?.map((submission, index) => (
                  <li key={index}>
                    <p>Student ID: {submission.studentID}</p>
                    <p>Submission Date: {formatDate(submission.submissionDate)}</p>
                    <p>File: <a href={submission.file} download>Download</a></p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      
      
    </>
  );
}

export default ViewAssignments;
