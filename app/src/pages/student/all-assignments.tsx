// pages/student/view-assignments.tsx
import { useState, useEffect } from 'react';
import StudentHeader from "../home/student-components/student-header";
import StudentNavbar from "../home/student-components/student-navbar";

interface Assignment {
  assignmentID: number;
  title: string;
  description: string;
  deadline: string;
}

const ViewAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    fetch('/api/getAssignments')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setAssignments(data);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }, []);

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
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment.assignmentID}>
              <h2>{assignment.title}</h2>
              <p>{assignment.description}</p>
              <p>Due date: {new Date(assignment.deadline).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default ViewAssignments;
