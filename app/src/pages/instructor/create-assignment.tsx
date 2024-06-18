import React, { ChangeEvent, useState } from "react"; // Import React

import InstructorHeader from "../home/instructor-components/instructor-header";
import InstructorNavbar from "../home/instructor-components/instructor-navbar";

export default function Page() {
  const [file, setFile] = useState<File | null>(null); // Specify the type for 'file'

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return; // User canceled file selection
    }
    const selectedFile = event.target.files[0]; // Get the first selected file
    setFile(selectedFile);
  }

  async function createAssignment() {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/create-assignment", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("Assignment created successfully");
        // Handle any further actions (e.g., display a success message)
      } else {
        console.error("Error creating assignment");
        // Handle error cases (e.g., display an error message)
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle network or other errors
    }
  }

  return (
    <>
      <br />
      <br />
      <br />
      <InstructorHeader
        title="Assignments"
        addLink={[
          { href: "#", title: "Create Assignment" },
          { href: "./release-assignment", title: "Release Assignment" },
        ]}
      />
      <InstructorNavbar />

      {/* Display the file upload input */}
      <div style={{ textAlign: "center" }}>
        <p>Upload file:</p>
        <input type="file" onChange={handleFileUpload} />
        <button onClick={createAssignment}>Create Assignment</button>
      </div>
    </>
  );
}
