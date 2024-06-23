import type { NextPage } from "next";
import styles from "../../styles/instructor-assignments-creation.module.css";
import { useRouter } from "next/router";
import React, { ChangeEvent, useCallback, useState, useEffect } from "react";

import InstructorHeader from "../home/instructor-components/instructor-header";
import InstructorNavbar from "../home/instructor-components/instructor-navbar";

interface Course {
  courseID: number;
  courseName: string;
}

const Assignments: NextPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseID, setCourseID] = useState<string>("");
  const [groupAssignment, setGroupAssignment] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/getCourses4assign")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched courses:", data);
        setCourses(data);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
        setError("Failed to fetch courses. Please try again.");
      });
  }, []);

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = function (e) {
      if (e.target) {
        setFileContent(e.target.result as string);
      }
    };
    reader.readAsText(selectedFile);
  }
  const handleFileTypeChange = (fileType: string, checked: boolean) => {
    setAllowedFileTypes((prev) =>
      checked ? [...prev, fileType] : prev.filter((type) => type !== fileType)
    );
  };

  const onCreateAssignmentButtonClick = useCallback(async () => {
    setError(null);
    if (
      !title ||
      !description ||
      !dueDate ||
      !courseID ||
      allowedFileTypes.length === 0
    ) {
      setError(
        "Please fill in all fields and select at least one allowed file type"
      );
      return;
    }

    // Convert the date to ISO format
    const isoDate = new Date(dueDate).toISOString();

    const response = await fetch("/api/createAssignment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        dueDate: isoDate,
        courseID: Number(courseID),
        file: fileContent,
        groupAssignment,
        allowedFileTypes,
      }),
    });

    if (response.ok) {
      router.push("/instructor/view-assignment");
    } else {
      const errorData = await response.json();
      setError(
        errorData.message || "An error occurred while creating the assignment"
      );
    }
  }, [
    title,
    description,
    dueDate,
    courseID,
    fileContent,
    groupAssignment,
    allowedFileTypes,
    router,
  ]);

  return (
    <>
      <InstructorHeader
        title="Assignments"
        addLink={[
          { href: "./create-assignment", title: "Create Assignment" },
          { href: "./release-assignment", title: "Release Assignment" },
        ]}
      />
      <InstructorNavbar />
      <div className={styles.container}>
        <div className={styles.rectangle}>
          <i
            style={{
              width: "368px",
              position: "relative",
              fontSize: "35px",
              display: "flex",
              fontWeight: "700",
              fontFamily: "'Inria Serif'",
              color: "#04124b",
              textAlign: "left",
              alignItems: "center",
              height: "22px",
            }}
          >
            Create an Assignment
          </i>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            type="text"
            placeholder="Assignment Title"
            className={styles.textbox}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Assignment Description"
            className={styles.textbox}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <input
            type="datetime-local"
            className={styles.textbox}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <select
            className={styles.textbox}
            value={courseID}
            onChange={(e) => setCourseID(e.target.value)}
          >
            <option value="">Select a class</option>
            {courses.map((courseItem) => (
              <option
                key={courseItem.courseID}
                value={courseItem.courseID.toString()}
              >
                {courseItem.courseName}
              </option>
            ))}
          </select>
          <p>
            Upload Rubric:
            <input type="file" onChange={handleFileUpload} />
          </p>
          <input
            type="checkbox"
            checked={groupAssignment}
            onChange={(e) => setGroupAssignment(e.target.checked)}
          />
          <label>Group Assignment</label>
          <div>
            <p>Allowed file types:</p>
            <div>
              <input
                type="checkbox"
                id="txt"
                onChange={(e) => handleFileTypeChange("txt", e.target.checked)}
              />
              <label htmlFor="txt">Text (.txt)</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="pdf"
                onChange={(e) => handleFileTypeChange("pdf", e.target.checked)}
              />
              <label htmlFor="pdf">PDF (.pdf)</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="docx"
                onChange={(e) => handleFileTypeChange("docx", e.target.checked)}
              />
              <label htmlFor="docx">Word (.docx)</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="zip"
                onChange={(e) => handleFileTypeChange("zip", e.target.checked)}
              />
              <label htmlFor="zip">ZIP (.zip)</label>
            </div>
          </div>

          <div
            className={styles.button}
            onClick={onCreateAssignmentButtonClick}
          >
            <div/>
            <b>Create Assignment</b>
          </div>
        </div>
      </div>
    </>
  );
};

export default Assignments;
