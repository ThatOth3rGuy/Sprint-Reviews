//pages/isntructor/release-assignment.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSessionValidation } from '../api/auth/checkSession';
import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import styles from "../../styles/instructor-assignments-creation.module.css";

import {
  Card, SelectItem, Listbox, ListboxItem, AutocompleteItem, Autocomplete, Textarea, Button, Breadcrumbs,
  BreadcrumbItem, Divider, Checkbox, CheckboxGroup, Progress, Input, Select, Modal, ModalContent, ModalHeader,
  ModalBody, ModalFooter, useDisclosure,
  Spinner
} from "@nextui-org/react";
import { randomizePeerReviewGroups } from "../api/addNew/randomizationAlgorithm";
import toast from "react-hot-toast";

// Define the structure for assignment and Rubric items
interface Assignment {
  assignmentID: number;
  linkedAssignmentID: string;
  title: string;
  description: string;
  deadline: string;
  groupAssignment: boolean;
}

interface RubricItem {
  criterion: string;
  maxMarks: number;
}

interface Student {
  id: string;
  name: string;
}

// Main component for releasing an assignment for peer review
const ReleaseAssignment: React.FC = () => {
  const router = useRouter();
  const { source, courseId } = router.query;
  const [courseName, setCourseName] = useState<string>("");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<number | "">("");
  const [rubric, setRubric] = useState<RubricItem[]>([{ criterion: "", maxMarks: 0 }]);
  const [isGroupAssignment, setIsGroupAssignment] = useState(false);
  const [allowedFileTypes, setAllowedFileTypes] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [students, setStudents] = useState<{ id: number; name: string }[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [uniqueDueDate, setUniqueDueDate] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [reviewsPerAssignment, setReviewsPerAssignment] = useState<number>(4);
  const [anonymous, setAnonymous] = useState(false);
  const [autoRelease, setAutoRelease] = useState(false);
  // Use the session validation hook to check if the user is logged in
  useSessionValidation('instructor', setLoading, setSession);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
   
  // Fetch assignments and students in the course when the component mounts
  useEffect(() => {
    if ( courseId) {
      fetchAssignments(courseId as string);
      fetchStudents(courseId as string);
      fetchCourseName(courseId as string);
    }
  }, [session,courseId]);

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

  // Function to fetch assignments
  const fetchAssignments = async (courseID: string | string[]) => {
    try {
      const response = await fetch(
        `/api/assignments/getAssignments4CoursesInstructor?courseID=${courseID}`
      );
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.courses);
      } else {
        console.error("Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  // Function to fetch students in the course
  const fetchStudents = async (courseID: string) => {
    try {
      //courseID = '3';
      const response = await fetch(`/api/courses/getCourseList?courseID=${courseID}`);
      if (response.ok) {
        const students = await response.json();
        setStudents(students);
      } else {
        console.error("Failed to fetch students");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Handle student selection
  const handleStudentSelection = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Handle student selection submission
  const handleStudentSelectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/selectStudentsForAssignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentID: selectedAssignment,
          studentIDs: selectedStudents,
          uniqueDeadline: uniqueDueDate,
        }),
      });

      if (response.ok) {
        alert("Students selected successfully");
        setSelectedStudents([]);
        setUniqueDueDate("");
      } else {
        console.error("Failed to select students");
      }
    } catch (error) {
      console.error("Error selecting students:", error);
    }
  };

  // Handle assignment change
  const handleAssignmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAssignment(Number(e.target.value));
  };

  // Handle rubric change
  const handleRubricChange = (
    index: number,
    field: "criterion" | "maxMarks",
    value: string
  ) => {
    const updatedRubric = [...rubric];
    if (field === "maxMarks") {
      updatedRubric[index][field] = Number(value);
    } else {
      updatedRubric[index][field] = value;
    }
    setRubric(updatedRubric);
  };

  // Add new rubric item
  const addRubricItem = () => {
    setRubric([...rubric, { criterion: "", maxMarks: 0 }]);
  };

  // Remove rubric item
  const removeRubricItem = (index: number) => {
    const updatedRubric = rubric.filter((_, i) => i !== index);
    setRubric(updatedRubric);
  };
 const isValidFormData = () => {
    // Add your validation logic here. For example:
    if (!selectedAssignment ||  !startDate || !endDate || !deadline || !students) {
      return false;
    }
    // If all fields are filled
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

     // Validate form data
  if (!isValidFormData()) {
    toast.error("Error: Invalid form data");
    return;
  }
    try {
      // Ensure submissions are fetched correctly
      const assignmentID = Number(selectedAssignment);

      const responseReleaseAssignment = await fetch("/api/assignments/releaseAssignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentID,
          rubric,
          isGroupAssignment,
          allowedFileTypes,
          startDate,
          endDate,
          deadline,
          anonymous,
          students,
        }),
      });

      if (!responseReleaseAssignment.ok) {
        throw new Error("Failed to release assignment for review");

      }

      // Second API call to release randomized peer reviews
      const responseReleasePeerReviews = await fetch("/api/addNew/releaseRandomizedPeerReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewsPerAssignment,
          students,
          assignmentID,
        }),
      });


      if (!responseReleasePeerReviews.ok) {
        throw new Error("Failed to release randomized peer reviews");
      }

      // If both requests are successful
      toast.success("Assignment created successfully!")
      router.push(`/instructor/course-dashboard?courseId=${courseId}`);


    } catch (error) {
      toast.error("Error releasing assignment or peer reviews for review");
      console.error("Error releasing assignment or peer reviews for review:", error);
    }
  };
 
  
  const options = students.map((student) => ({
    value: student.id,
    label: student.name,
  }));

  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return <p>No user found in session</p>;
  }

  const isAdmin = session?.user?.role === 'admin';

  if (loading) {
    return <div className='w-[100vh=w] h-[100vh] instructor flex justify-center text-center items-center my-auto'>
      <Spinner color='primary' size="lg" />
    </div>;
  }

  function handleHomeClick(): void {
    router.push("/instructor/dashboard");
  }

  function handleAssignmentClick(): void {
    router.push("/instructor/assignments");
  }


  const handleBackClick = () => { //redirect to course dashboard or all assignments
    const { source } = router.query;
    if (source === 'course') {
      router.push(`/instructor/course-dashboard?courseId=${router.query.courseId}`);
    } else {
      router.push('/instructor/assignments');
    }
  };
  return (
    <>
      {isAdmin ? <AdminNavbar /> : <InstructorNavbar />}
      <div className={`overflow-y-auto instructor text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>Release Peer Review</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem onClick={handleBackClick}>{router.query.source === 'course' ? (courseName || 'Course Dashboard') : 'Assignments'}</BreadcrumbItem>
            <BreadcrumbItem>Release Peer Review</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className={styles.mainContent}>
          <div className="flex-col w-[85%] bg-white p-[1.5%] pt-[1%] shadow-sm overflow-auto m-auto mr-[1%] text-left ">
            <h2>Release Assignment for Peer Review</h2>
            
            <br />
            <form onSubmit={handleSubmit}>
              <Select
                label="Select Assignment"
                color="primary"
                variant="bordered"
                className="m-2"
                value={selectedAssignment}
                onChange={handleAssignmentChange}
                required
              >{assignments.map((assignment) => (
                <SelectItem
                  key={assignment.assignmentID}
                  value={assignment.assignmentID}
                >
                  {assignment.title}
                </SelectItem>
              ))}
              </Select>
              <div >
                <div className={styles.rubric}>
                  <h3>Review Criteria</h3>
                  <br />
                  {rubric.map((item, index) => (
                    <div key={index} className={styles.rubricItem}>
                      <Input
                        size="sm"
                        label="Review Criterion"
                        variant="bordered"
                        type="text"
                        value={item.criterion}
                        onChange={(e) =>
                          handleRubricChange(index, "criterion", e.target.value)
                        }
                        required
                      />
                      <br />
                      <Input
                        label="Maximum Marks for Criterion"
                        variant="bordered"
                        type="number"
                        value={item.maxMarks.toString()}
                        onChange={(e) =>
                          handleRubricChange(index, "maxMarks", e.target.value)
                        }
                        required
                        min = {1}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        color="danger"
                        type="button"
                        onClick={() => removeRubricItem(index)}
                        className="m-3 "
                      >
                        Remove
                      </Button>
                      <hr />
                    </div>
                  ))}
                  <br />
                  <Button
                    variant="ghost"
                    color="success"
                    onClick={addRubricItem}
                  >Add Criterion
                  </Button>
                </div>
              </div>
              <Checkbox
                isSelected={anonymous}
                onValueChange={setAnonymous}
                color="primary"
              >
                Anonymous Review
              </Checkbox>

              <br />
              <Input
                label="Number of Reviews per Assignment"
                type="number"
                min="1"
                value={reviewsPerAssignment.toString()} // Convert number to string
                onChange={(e) => setReviewsPerAssignment(Number(e.target.value))}
                required
              />
              <br />
              <div className="flex justify-evenly m-1">
                <div className="text-left w-1/3 p-2 pt-0">
                  <h3>Enter a Start Date</h3>
                  <Input
                    variant="underlined"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    color="success"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div className="text-left w-1/3 p-2 pt-0">
                  <h3>Enter a Due Date:</h3>
                  <Input
                    variant="underlined"
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    color="warning"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                
                <div className="text-left w-1/3 p-2 pt-0">
                  <h3>Enter an end Date</h3>
                  <Input
                    variant="underlined"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    color="danger"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>

              <Button onClick={handleSubmit} color="primary" variant="solid" className="float-right m-4" size="sm">
                <b>Draft Release</b>
              </Button>
              {/* <Button variant="bordered" onPress={onOpen} color="primary" className="float-left m-4 ml-0" size="sm">
                Advanced Options</Button> */}
              <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="instructor">
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader>Advanced Options</ModalHeader>
                      <ModalBody>
                        <div >
                          <p className="text-left p-0 m-0 mb-2">Assign a unique due date to select students:</p>
                          <p>
                            <Select
                              size="sm"
                              label="Select Students"
                              selectionMode="multiple"
                              onChange={(selectedValues) => {
                                setSelectedStudents((selectedValues as unknown) as number[]);
                              }}
                            >
                              {students.map((student) => (
                                <SelectItem key={student.id} value={student.id.toString()}>
                                  {student.name}
                                </SelectItem>
                              ))}
                            </Select>
                          </p>
                        </div>
                        <div >
                          <form onSubmit={handleStudentSelectionSubmit}>
                            <div >
                              {students.map((student) => (
                                <div key={student.id}>
                                  <Input
                                    type="checkbox"
                                    id={`student-${student.id}`}
                                    checked={selectedStudents.includes(student.id)}
                                    onChange={() => handleStudentSelection(student.id)}
                                  />
                                  <label htmlFor={`student-${student.id}`}>
                                    {student.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                            <Input
                              type="datetime-local"
                              value={uniqueDueDate}
                              onChange={(e) => setUniqueDueDate(e.target.value)}
                              required
                              min={new Date().toISOString().slice(0, 16)}
                            />
                            <br />
                            <Button variant="ghost" type="submit" color="primary">
                              Set Unique Due Date
                            </Button>
                          </form>
                        </div>
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
              </Modal>
              <br />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReleaseAssignment;
