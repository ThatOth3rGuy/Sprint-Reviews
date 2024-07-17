import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import StudentHeader from "../../components/student-components/student-header";
import StudentNavbar from "../../components/student-components/student-navbar";
import style from "../../../styles/student-components.module.css"
import Modal from 'react-modal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Assignment ID:", id); // Log the ID
    if (id) {
      fetch(`/api/assignments/getAssignmentForStudentView?id=${id}`)
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

  const isBeforeDeadline = (deadline: string) => {
    return new Date(deadline) > new Date();
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setUploadedFile(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const isFileTypeAllowed = (file: File | null) => {
    if (!file || !assignment?.allowedFileTypes) return false;
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return assignment.allowedFileTypes.some(type => 
      type.toLowerCase() === `.${fileExtension}` || type.toLowerCase() === fileExtension
    );
  };

  const handleSubmit = async () => {
    if (uploadedFile && isFileTypeAllowed(uploadedFile)) {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('assignmentID', id as string);
      // Assuming you have the studentID stored in the session or context
      formData.append('studentID', 'YOUR_STUDENT_ID_HERE');

      try {
        const response = await fetch('/api/assignments/submitAssignment', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log('File uploaded successfully');
          closeModal();
        } else {
          throw new Error('File upload failed');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setFileError('Failed to upload file. Please try again.');
      }
    }
  };

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
         {isBeforeDeadline(assignment.deadline) && (
          <button className={style.submitButton} onClick={openModal}>
            Submit Assignment
          </button>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Submit Assignment"
      >
        <h2>Submit Assignment</h2>
        <input type="file" onChange={handleFileUpload} />
        {fileError && <p style={{color: 'red'}}>{fileError}</p>}
        {uploadedFile && (
          <div>
            <p>Selected file: {uploadedFile.name}</p>
          </div>
        )}
        <button 
           
          disabled={!uploadedFile || !isFileTypeAllowed(uploadedFile)}
        >
          Submit
        </button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </>
  );
}

export default AssignmentDetails;