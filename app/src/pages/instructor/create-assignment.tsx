import type { NextPage } from "next";
import styles from "../../styles/instructor-assignments-creation.module.css";
import { useRouter } from "next/router";

import { Card, SelectItem, Select, Listbox, ListboxItem, AutocompleteItem, Autocomplete, Textarea, Button, Breadcrumbs, BreadcrumbItem, Divider, Checkbox, CheckboxGroup, Progress, Input, Spinner } from "@nextui-org/react";
import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import React, { ChangeEvent, useCallback, useState, useEffect } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import toast from "react-hot-toast";

interface CourseData {
  courseID: string;
  courseName: string;
}

const Assignments: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const { courseId } = router.query;

  useSessionValidation("instructor", setLoading, setSession);

  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [groupAssignment, setGroupAssignment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>([]);
  const [courseName, setCourseName] = useState<string>("");


  // Declare the groups and students variables here
  const groups = ["Group A", "Group B", "Group C"];
  const students = ["Student 1", "Student 2", "Student 3", "Student 4"];

  const [courseData, setCourseData] = useState<CourseData | null>(null);


  // useEffect(() => {
   
  //   if (courseId) {
  //     fetch(`/api/courses/${courseId}`)
  //       .then((response) => response.json())
  //       .then((data: CourseData) => {
  //         console.log("Fetched course data:", data);
  //         setCourseData(data);
  //       })
  //       .catch((error) => console.error("Error fetching course data:", error));
  //   }

  // };



  //get course name or assignment page for breadcrumbs
  useEffect(() => {
    const { source, courseId } = router.query;

    if (source === 'course' && courseId) {
      // Fetch course name
      fetchCourseName(courseId as string);
    }
  }, [router.query]);

  const fetchCourseName = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setCourseName(data.courseName);
      }
    } catch (error) {
      console.error('Error fetching course name:', error);
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
    setError(null);

    if (!title.trim()) {
      setError("Please enter the assignment title.");
      return;
    }
    if (!dueDate.trim()) {
      setError("Please select a due date.");
      return;
    }
    if (allowedFileTypes.length === 0) {
      setError("Please select at least one allowed file type.");
      return;
    }
    if (!courseId) {
      setError("Course ID is missing.");
      return;
    }
    const selectedDueDate = new Date(dueDate);
    const now = new Date();
    if (selectedDueDate <= now) {
      setError("Due date cannot be in the past. Please select a future date and time.");
      return;
    }
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
        courseID: Number(courseId),
        file: fileContent,
        groupAssignment,
        allowedFileTypes,
        instructorID: session.user.userID,
      }),
    });

    if (response.ok) {
      toast.success("Assignment created successfully!")
      router.push(`/instructor/course-dashboard?courseId=${courseId}`);

    } else {
      const errorData = await response.json();
      setError(errorData.message || "An error occurred while creating the assignment");
      toast.error(errorData.message)
    }
  }, [title, description, dueDate, courseId, fileContent, groupAssignment, allowedFileTypes, router, session]);

  

  if (loading) {
    return <div className='w-[100vh=w] h-[100vh] instructor flex justify-center text-center items-center my-auto'>
    <Spinner color='primary' size="lg" />
</div>;
  }

  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return null;
  }
  const isAdmin = session.user.role === 'admin';

  function handleHomeClick(): void {
    router.push("/instructor/dashboard");
  }

  function handleCourseDashboardClick(): void {
    router.push(`/instructor/course-dashboard?courseId=${courseId}`);
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

  const handleBackClick = () => { //redirect to course dashboard or all assignments
    const { source } = router.query;
    if (source === 'course') {
      router.push(`/instructor/course-dashboard?courseId=${router.query.courseId}`);
    } else {
      router.push('/instructor/assignments');
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
          <h1>Create Assignment for {router.query.source === 'course' ? courseName : 'Course'}</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>

            <BreadcrumbItem onClick={handleBackClick}>{router.query.source === 'course' ? (courseName || 'Course Dashboard') : 'Assignments'}</BreadcrumbItem>
            <BreadcrumbItem>Create Assignment</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.mainContent}>
          <div className="flex-col bg-white p-[1.5%] w-[86%] m-[.8%] ml-auto mt-auto h-fit">
            <h2>Create Assignment For Student Submission</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Input
              size="sm"
              type="text"
              label="Title"
              className={styles.textbox}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              size="sm"
              placeholder="Assignment Description"
              className={styles.textbox}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <h3 className={styles.innerTitle}>Select Due Date:</h3>
            <Input
              size="sm"
              type="datetime-local"
              className={styles.textbox}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
            <br />
            <h3 className={styles.innerTitle}>Group Assignment:</h3>
  
            <Checkbox
              className={styles.innerTitle}
              isSelected={groupAssignment}
              onValueChange={setGroupAssignment}
            >
              Group Assignment
            </Checkbox>
            <br/><div>
              <CheckboxGroup
                size="sm"
                color="primary"
                value={allowedFileTypes}
                onValueChange={setAllowedFileTypes}
              >
                <h3 className={styles.innerTitle}>Allowed file types:</h3>
                <Checkbox value="txt">Text (.txt)</Checkbox>
                <Checkbox value="pdf">PDF (.pdf)</Checkbox>
                <Checkbox value="docx">Word (.docx)</Checkbox>
                <Checkbox value="zip">ZIP (.zip)</Checkbox>
              </CheckboxGroup>
            </div>
            <Button color="success" variant="solid" className="cursor-pointer m-2 mx-auto p-4 text-white w-[100%]" onClick={onCreateAssignmentButtonClick}>Create Assignment</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Assignments;