import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import StudentHeader from "../../home/student-components/student-header";
import StudentNavbar from "../../home/student-components/student-navbar";

const SubmitAssignment = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignmentID', id as string);

    try {
      const response = await fetch('/api/submitAssignment', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit assignment');
      }

      router.push('/student/view-assignments');
    } catch (error) {
      setError('Failed to submit assignment. Please try again.');
    }
  };

  return (
    <>
      <StudentHeader title="Submit Assignment" addLink={[]} />
      <StudentNavbar />
      <div>
        <h1>Submit Assignment</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Submit Assignment</button>
        </form>
      </div>
    </>
  );
};

export default SubmitAssignment;