// create-assignment.tsx
import type { NextPage } from "next";
import styles from "../../styles/instructor-assignments-creation.module.css";
import { useRouter } from "next/router";
import { Card, SelectItem, Select, Listbox, ListboxItem, AutocompleteItem, Autocomplete, Textarea, Button, Breadcrumbs, BreadcrumbItem, Divider, Checkbox, CheckboxGroup, Progress, Input } from "@nextui-org/react";
import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import React, { ChangeEvent, useCallback, useState, useEffect } from "react";
import { useSessionValidation } from '../api/auth/checkSession';

interface Course {
  courseID: number;
  courseName: string;
}

const Assignments: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation("instructor", setLoading, setSession);

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

  // Declare the groups and students variables here
  const groups = ["Group A", "Group B", "Group C"];
  const students = ["Student 1", "Student 2", "Student 3", "Student 4"];

  useEffect(() => {
    if (session && session.user && session.user.userID) {
      fetchCourses(session.user.userID);
    }


  }, [session]);
  const fetchCourses = async (instructorID: number) => {
    try {
      const response = await fetch(`/api/getCourse4Instructor?instructorID=${instructorID}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };
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
    // Reset error state
    setError(null);

    // Check if all required fields are filled
    if (!title.trim()) {
      setError("Please enter the assignment title.");
      return;
    }
    if (!dueDate.trim()) {
      setError("Please select a due date.");
      return;
    }
    if (!courseID.trim()) {
      setError("Please select a course.");
      return;
    }
    if (allowedFileTypes.length === 0) {
      setError("Please select at least one allowed file type.");
      return;
    }

    // Convert the date to ISO format
    const isoDate = new Date(dueDate).toISOString();

    const response = await fetch("/api/addNew/createAssignment", {
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
      router.push({
        pathname: '/instructor/dashboard',
      });
    } else {
      const errorData = await response.json();
      setError(errorData.message || "An error occurred while creating the assignment");
    }
  }, [title, description, dueDate, courseID, fileContent, groupAssignment, allowedFileTypes, router]);


  if (loading) {
    return <p>Loading...</p>;
  }

  // If the session exists, check if the user is an admin
  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return;
  }
  const isAdmin = session.user.role === 'admin';

  function handleHomeClick(): void {
    router.push("/instructor/dashboard");
  }
  const handleAssignmentClick = async () => {
    router.push('/instructor/assignments');
  }

  const handleCreateAssignmentClick = () => {
    router.push('/instructor/create-assignment');
  };
  const handleCreatePeerReviewAssignmentClick = () => {
    router.push('/instructor/release-assignment');
  };
  const handleCreateGroupPeerReviewAssignmentClick = () => {
    router.push('/instructor/create-groups');
  };
  /**
   * Handles the action based on the key provided.
   * @param {any} key - The key representing the action to be performed.
   */
  const handleAction = (key: any) => {
    switch (key) {
      case "create":
        handleCreateAssignmentClick();
        break;
      case "peer-review":
        handleCreatePeerReviewAssignmentClick();
        break;
      case "group-review":
        handleCreateGroupPeerReviewAssignmentClick();
        break;
      case "delete":
        // Implement delete course functionality
        console.log("Delete course");
        break;
      default:
        console.log("Unknown action:", key);
    }
  };
  /**
     * Renders the instructor course dashboard page.
     * @returns {JSX.Element} The instructor course dashboard page.
     */
  return (
    <>
      {isAdmin ? <AdminNavbar/> : <InstructorNavbar />}
      <div className={`instructor text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>Create Assignment</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem onClick={handleAssignmentClick}>Assignments</BreadcrumbItem>
            <BreadcrumbItem>Create Assignment</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.rectangle}>
            <h2>Create Assignment For Student Submission</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Input
            size="sm"
              type="text"
              label="Title"
              // placeholder="Assignment Title"
              className={styles.textbox}
              value={title}
              onChange={(e) => setTitle(e.target.value)}/>
            <Textarea
            size="sm"
              placeholder="Assignment Description"
              className={styles.textbox}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Textarea>
            <Input
            size="sm"
              type="datetime-local"
              className={styles.textbox}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}/>
            <Select
            size="sm"
              label="Select a Course"
              className={styles.textbox}
              value={courseID}
              onChange={(e) => setCourseID(e.target.value)}>
              {courses.map((courseItem) => (
                <SelectItem
                  key={courseItem.courseID}
                  value={courseItem.courseID.toString()}>
                  {courseItem.courseName}
                </SelectItem>
              ))}
            </Select>
            <br />
            <div >
              <Checkbox
                className={styles.innerTitle}
                checked={groupAssignment}
                onChange={(e) => setGroupAssignment(e.target.checked)}>
                Group Assignments
              </Checkbox>
              {groupAssignment && (
                <Card className={styles.courseCard} >
                  <div className="flex">
                    <Select
                      label="Select a Group"
                      placeholder="Select a group"
                      selectionMode="multiple"
                      className="max-w-xs flex items-start">
                      {groups.map((group, index) => (
                        <SelectItem key={index}>{group}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="Select Students"
                      placeholder="Select a group"
                      selectionMode="multiple"
                      className="max-w-xs flex items-end">
                      {students.map((student, index) => (
                        <SelectItem key={index}>{student}</SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Button color="primary" variant="ghost"> Confirm groups  </Button>
                  </div>
                </Card>
              )}</div>
            <div>
              <br />
              <CheckboxGroup
              size="sm"
                color="primary"
                value={allowedFileTypes}
              ><h3 className={styles.innerTitle}>Allowed file types:</h3>
                <Checkbox value="txt" onChange={(e) => handleFileTypeChange("txt", e.target.checked)}>Text (.txt)</Checkbox>
                <Checkbox value="pdf" onChange={(e) => handleFileTypeChange("pdf", e.target.checked)}>PDF (.pdf)</Checkbox>
                <Checkbox value="docx" onChange={(e) => handleFileTypeChange("docx", e.target.checked)}>Word (.docx)</Checkbox>
                <Checkbox value="zip" onChange={(e) => handleFileTypeChange("zip", e.target.checked)}>ZIP (.zip)</Checkbox>
              </CheckboxGroup>
            </div>
            <Button color="success" variant="solid" className="cursor-pointer m-3 p-4 text-white" onClick={onCreateAssignmentButtonClick}>Create Assignment</Button>
          </div>
          <div className={styles.notificationsSection}>
            <div className={styles.actionButtons}>
              <Listbox aria-label="Actions" onAction={handleAction}>
                <ListboxItem key="create">Create Assignment</ListboxItem>
                <ListboxItem key="peer-review">Create Peer Review</ListboxItem>
                <ListboxItem key="group-review">Create Student Groups</ListboxItem>
                <ListboxItem key="delete" className="text-danger" color="danger">
                  Archive Course
                </ListboxItem>
              </Listbox>
            </div>
            <hr />
            <h2 className="my-3">Notifications</h2>
            <div className={styles.notificationsContainer}>
              <div className={styles.notificationCard}>Dummy Notification</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Assignments;
