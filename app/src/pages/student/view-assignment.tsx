import { useState, useEffect } from 'react';
import StudentHeader from "../home/student-components/student-header";
import StudentNavbar from "../home/student-components/student-navbar";
import Link from 'next/link';

interface Assignment {
  assignmentID: number;
  title: string;
  description: string;
  deadline: string;
  rubric: string;
  file: string;
}

const ViewAssignments = () => {
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

  return (
    <>
      <StudentHeader title="Course Name"
        addLink={[
          { href: "./all-assignments", title: "View All" },
          { href: "./peer-eval-assignments", title: "Peer Evaluations" }
        ]}
      />
      <StudentNavbar />
      <div>
        <h1>Assignments</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment.assignmentID}>
              <Link href={`/student/assignment/${assignment.assignmentID}`}>
                <a><h2>{assignment.title}</h2></a>
              </Link>
              <p>{assignment.description}</p>
              <p>Due date: {formatDate(assignment.deadline)}</p>
              {assignment.rubric && <p>Rubric: {assignment.rubric}</p>}
              {assignment.file && <p>Instructor file: <a href={assignment.file} download>Download</a></p>}
              <Link href={`/student/submit-assignment/${assignment.assignmentID}`}>
                <a>Submit Assignment</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default ViewAssignments;