import { useState, useEffect } from 'react';
import StudentHeader from "../home/student-components/student-header";
import StudentNavbar from "../home/student-components/student-navbar";
import InstructorHeader from '../home/instructor-components/instructor-header';
import InstructorNavbar from '../home/instructor-components/instructor-navbar';

interface Assignment {
  assignmentID: number;
  title: string;
  description: string;
  deadline: string;
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
      <InstructorHeader title="Course Name"
        addLink={[
          { href: "./all-assignments", title: "View All" },
          { href: "./peer-eval-assignments", title: "Peer Evaluations" }
        ]}
      />
      <InstructorNavbar />
      <div>
        <h1>Assignments</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment.assignmentID}>
              <h2>{assignment.title}</h2>
              <p>{assignment.description}</p>
              <p>Due date: {formatDate(assignment.deadline)}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default ViewAssignments;
// import { useState, useEffect } from 'react';
// import InstructorHeader from '../home/instructor-components/instructor-header';
// import InstructorNavbar from '../home/instructor-components/instructor-navbar';

// interface Assignment {
//   assignmentID: number;
//   title: string;
//   description: string;
//   deadline: string;
//   rubric: string;
//   file: string;
//   submissions: Submission[];
// }

// interface Submission {
//   studentID: number;
//   submissionDate: string;
//   file: string;
// }

// const ViewAssignments = () => {
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetch('/api/getAssignmentsWithSubmissions')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         console.log('Received assignments:', data);
//         setAssignments(data);
//       })
//       .catch(error => {
//         console.error('There has been a problem with your fetch operation:', error);
//         setError('Failed to fetch assignments. Please try again later.');
//       });
//   }, []);

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
//   };

//   return (
//     <>
//       <InstructorHeader title="Course Name"
//         addLink={[
//           { href: "./all-assignments", title: "View All" },
//           { href: "./peer-eval-assignments", title: "Peer Evaluations" }
//         ]}
//       />
//       <InstructorNavbar />
//       <div>
//         <h1>Assignments</h1>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <ul>
//           {assignments.map((assignment) => (
//             <li key={assignment.assignmentID}>
//               <h2>{assignment.title}</h2>
//               <p>{assignment.description}</p>
//               <p>Due date: {formatDate(assignment.deadline)}</p>
//               {assignment.rubric && <p>Rubric: {assignment.rubric}</p>}
//               {assignment.file && <p>Instructor file: <a href={assignment.file} download>Download</a></p>}
//               <h3>Submissions:</h3>
//               <ul>
//                 {assignment.submissions.map((submission, index) => (
//                   <li key={index}>
//                     <p>Student ID: {submission.studentID}</p>
//                     <p>Submission Date: {formatDate(submission.submissionDate)}</p>
//                     <p>File: <a href={submission.file} download>Download</a></p>
//                   </li>
//                 ))}
//               </ul>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// }

// export default ViewAssignments;