import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import StudentHeader from "../../home/student-components/student-header";
import StudentNavbar from "../../home/student-components/student-navbar";
import style from "../../../styles/student-components.module.css"

interface Assignment {
  assignmentID: number;
  title: string;
  description: string;
  deadline: string;
  rubric: string | null;
  groupAssignment: boolean;
  courseID: number;
  allowedFileTypes?: string[];
}

const AssignmentDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Assignment ID:", id); // Log the ID
    if (id) {
      fetch(`/api/getAssignmentForStudentView?id=${id}`)
        .then(response => {
          console.log("API Response:", response); // Log the response
          if (!response.ok) {
            throw new Error('Failed to fetch assignment');
          }
          return response.json();
        })
        .then(data => {
          console.log("Assignment Data:", data); // Log the data
          setAssignment(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error:', error);
          setError('Failed to load assignment details');
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!assignment) return <div>Assignment not found</div>;

  return (
    <>
    <br />
    <br />
    <br />
    <br />
    <br />

      <StudentHeader title="Assignment Details" />
      <StudentNavbar />
      <div className={style.assignment}>
        <h1>{assignment.title}</h1>
        <p>Description: {assignment.description}</p>
        <p>Due date: {new Date(assignment.deadline).toLocaleString()}</p>
        <p>Group Assignment: {assignment.groupAssignment ? 'Yes' : 'No'}</p>
        <p>Course ID: {assignment.courseID}</p>
        {assignment.allowedFileTypes && assignment.allowedFileTypes.length > 0 && (
  <p>Allowed File Types: {assignment.allowedFileTypes.join(', ')}</p>
)}
        {assignment.rubric && (
          <div>
            <h2>Rubric</h2>
            <pre>{assignment.rubric}</pre>
          </div>
        )}
        {/* Add more assignment details here as needed */}
      </div>
    </>
  );
}

export default AssignmentDetails;