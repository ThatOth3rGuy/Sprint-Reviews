// release-assignment.tsx
// Import necessary libraries
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSessionValidation } from '../api/auth/checkSession';
import InstructorHeader from "../components/instructor-components/instructor-header";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import AdminHeader from "../components/admin-components/admin-header";
import styles from "../../styles/instructor-assignments-creation.module.css";
import { Card, SelectItem, Listbox, ListboxItem, AutocompleteItem, Autocomplete, Textarea, Button, Breadcrumbs, BreadcrumbItem, Divider, Checkbox, CheckboxGroup, Progress, Input, Select, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";

// Define the structure for assignment and Rubric items
interface Assignment {
  assignmentID: number;
  title: string;
}

interface RubricItem {
  criterion: string;
  maxMarks: number;
}

interface Student {
  id: string;
  name: string;
}

const ReleaseAssignment: React.FC = () => {
  const router = useRouter();
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
  const dummyassignments = ['Assignment 1', 'Assignment 2', 'Assignment 3'];

  // Dummy rubric
  const dummyrubric = [
    { criterion: 'Criterion 1', maxMarks: 10 },
    { criterion: 'Criterion 2', maxMarks: 20 },
    { criterion: 'Criterion 3', maxMarks: 30 },
  ];

  // Dummy questions
  const questions = ['Was the work clear and easy to understand?', 'Was the content relevant and meaningful?', 'Was the work well-organized and logically structured?', 'Did the author provide sufficient evidence or examples to support their arguments or points?', 'Improvements: What suggestions do you have for improving the work?'];
  // Use the session validation hook to check if the user is logged in
  useSessionValidation('instructor', setLoading, setSession);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // Handle open and close for modal
  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  // Fetch assignments and students in the course when the component mounts
  useEffect(() => {
    if (session && session.user) {
      fetchAssignments(session.user.userID);
      fetchStudents(session.user.courseID);
    }
  }, [session]);

  // Function to fetch assignments
  const fetchAssignments = async (userID: string) => {
    try {
      const response = await fetch(`/api/getAllAssignmentsInstructor?userID=${userID}`);
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.assignments);
      } else {
        console.error('Failed to fetch assignments');
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  // Function to fetch students in the course
  const fetchStudents = async (courseID: string) => {
    try {
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/assignments/releaseAssignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentID: selectedAssignment,
          rubric,
          isGroupAssignment,
          allowedFileTypes,
          deadline,
        }),
      });

      if (response.ok) {
        router.push("/instructor/dashboard");
      } else {
        console.error("Failed to release assignment");
      }
    } catch (error) {
      console.error("Error releasing assignment:", error);
    }
  };

  const options = students.map((student) => ({
    value: student.id,
    label: student.name,
  }));

  // If the session exists, check if the user is an admin
  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return <p>No user found in session</p>;
  }

  const isAdmin = session?.user?.role === 'admin';

  if (loading) {
    return <p>Loading...</p>;
  }
  function handleHomeClick(): void {
    router.push("/instructor/dashboard");
  }
  return (

    <>
      {isAdmin ? <AdminNavbar /> : <InstructorNavbar />}
      <div className={`overflow-y-auto instructor text-primary-900 ${styles.container}`}>
        <div className={styles.header}>
          <h1>Release Peer Review</h1>
          <br />
          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem>Release Peer Review</BreadcrumbItem>
          </Breadcrumbs>

        </div>
        <div className={styles.mainContent}>
          <div className={styles.rectangle}>
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
                        // placeholder="Review criterion"
                        // className={styles.textbox}
                        required
                      />
                      <br />
                      {/* <label>Enter the maximum number of marks allowed:</label> */}
                      <Input
                        label="Maximum Marks for Criterion"
                        variant="bordered"
                        type="number"
                        value={item.maxMarks.toString()}
                        onChange={(e) =>
                          handleRubricChange(index, "maxMarks", e.target.value)
                        }
                        required
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
                  // className={styles.criterion}
                  >Add Criterion
                  </Button>
                </div>
              </div>
              <br />
              <label>Enter Due Date:</label>
              <br />
              <Input
                variant="bordered"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                // className={styles.textbox}
                color="primary"
                required

              />
              <Button color="primary" variant="solid" className="float-right m-4" size="sm">
                <b>Release</b>
              </Button>
              {/* TODO: fix select students in advanced options */}
              <Button variant="bordered" onPress={onOpen} color="primary" className="float-left m-4 ml-0" size="sm">
                Advanced Options</Button>
              <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="instructor"
              // className={styles.advancedOptions}
              >
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
                              // placeholder="Select students"
                              onChange={(selectedValues) => {
                                setSelectedStudents(selectedValues.map(Number));
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
                              // className={styles.textbox}
                              required
                            />
                            <br />
                            <Button variant="ghost" type="submit" color="primary">
                              Set Unique Due Date
                            </Button>
                          </form>
                          {/* <button onClick={closeModal} className={styles.closeModal}>Close</button> */}
                        </div>
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
                {/* <h2>Advanced Options</h2> */}


              </Modal>
              <br />
              
            </form>
          </div>

          <div className={`h-50% overflow-y-auto ${styles.groupReview}`}>
            <h2> Student Groups</h2>
            {/* <div className={styles.questionCard}>
      {questions.map((question, index) => (
        <Card key={index} style={{ width: '100%' }}>
          {question}
        </Card>
      ))}
    </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReleaseAssignment;
