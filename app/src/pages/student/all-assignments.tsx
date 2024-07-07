// pages/student/view-assignments.tsx
import { useState, useEffect } from "react";
import StudentHeader from "../components/student-components/student-header";
import StudentNavbar from "../components/student-components/student-navbar";
import style from "../../styles/student-components.module.css";
import Link from "next/link";

import { useSessionValidation } from '../api/auth/checkSession';

interface Assignment {
  assignmentID: number;
  title: string;
  description: string;
  deadline: string;
}

const ViewAssignments = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('student', setLoading, setSession);

  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    fetch("/api/getAssignments")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setAssignments(data);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <StudentHeader
        title="Assignments"
        addLink={[
          { href: "./all-assignments", title: "View All" },
          { href: "./peer-eval-assignments", title: "Peer Evaluations" },
        ]}
      />
      <StudentNavbar />
      <div className={style.assignment}>
        <h1>Assignments</h1>
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment.assignmentID}>
              <Link href={`/student/assignment/${assignment.assignmentID}`}>
                <h2>{assignment.title}</h2>
              </Link>
              <p>{assignment.description}</p>
              <p>
                Due date: {new Date(assignment.deadline).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ViewAssignments;
