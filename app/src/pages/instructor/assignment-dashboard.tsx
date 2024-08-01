import { useRouter } from "next/router";
import InstructorNavbar from "../components/instructor-components/instructor-navbar";
import AdminNavbar from "../components/admin-components/admin-navbar";
import { useEffect, useState } from "react";
import { useSessionValidation } from '../api/auth/checkSession';
import AssignmentDetailCard from '../components/instructor-components/instructor-assignment-details';
import styles from "../../styles/AssignmentDetailCard.module.css";
import { Breadcrumbs, CheckboxGroup, BreadcrumbItem, Spinner, Button, Modal, ModalContent, ModalHeader, ModalBody, Input, ModalFooter, Textarea, Checkbox, Table, TableHeader, TableBody, TableRow, TableCell, TableColumn } from "@nextui-org/react";
import type { NextPage } from "next";
import toast from 'react-hot-toast';
interface Assignment {
  assignmentID: number;
  title: string;
  descr: string;
  deadline: string;
  courseID: number;
  submissions: Submission[];

}

interface CourseData {
  courseID: number;
  courseName: string;
}
interface Submission {
  submissionID: number;
  studentID: number;
  fileName: string;
  fileContent: string; // Base64 encoded file content
  fileType: string;
  submissionDate: string;
  grade: number | null;
  firstName: string;
  lastName: string;
}
const AssignmentDashboard: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAssignmentName, setNewAssignmentName] = useState('');
  const [newAssignmentDesc, setNewAssignmentDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newGroupAssignment, setnewGroupAssignment] = useState(false);
  const [newAllowedFileTypes, setNewAllowedFileTypes] = useState<string[]>([]);;
  const [newAllowLinks, setNewAllowLinks] = useState(false);
  const [newLinkTypes, setNewLinkTypes] = useState<string[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<Submission | null>(null);
  useSessionValidation('instructor', setLoading, setSession);

  useEffect(() => {
    if (!router.isReady) return;

    const { assignmentID } = router.query;

    const fetchData = async () => {
      if (assignmentID) {
        try {
          const assignmentResponse = await fetch(`/api/assignments/${assignmentID}`);

          if (assignmentResponse.ok) {
            const assignmentData: Assignment = await assignmentResponse.json();
            setAssignment(assignmentData);

            // Assuming the assignment data includes a courseID
            if (assignmentData.courseID) {
              const courseResponse = await fetch(`/api/courses/${assignmentData.courseID}`);
              if (courseResponse.ok) {
                const courseData: CourseData = await courseResponse.json();
                console.log(courseData)
                setCourseData(courseData);
              }
            }
          } else {
            // Handle error response
            const errorData = await assignmentResponse.json();
            setError(errorData.message || 'Error fetching assignment data');
            toast.error(errorData.message);
          }
        } catch (error) {
          // Handle network or other errors
          setError('An error occurred. Please try again.');
          toast.error("An error occurred. Please try again.")
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, router.query]);

  if (loading || !assignment) {
    return (
      <div className='w-[100vh=w] h-[100vh] instructor flex justify-center text-center items-center my-auto'>
        <Spinner color='primary' size="lg" />
      </div>
    );
  }

  if (!session || !session.user || !session.user.userID) {
    console.error('No user found in session');
    return null;
  }

  const isAdmin = session.user.role === 'admin';

  const handleBackClick = () => router.push(`/instructor/course-dashboard?courseId=${courseData?.courseID}`);

  const handleHomeClick = () => {
    router.push("/instructor/dashboard")
  }
  const handleAssignmentNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAssignmentName(event.target.value);
  };


  const handleAssignmentDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAssignmentDesc(event.target.value);
  }

  const handleAssignmentsUpdate = async () => {
    const { assignmentID } = router.query;
    try {
      // Update assignment name and description
      await fetch(`/api/updateTable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          table: 'assignmentName',
          data: {
            assignmentID: assignmentID,
            title: newAssignmentName,
            description: newAssignmentDesc,
          }
        })
      });

      // Prepare allowed file types
      let finalAllowedTypes = [...newAllowedFileTypes];
      if (newAllowLinks) {
        if (newLinkTypes.length === 0) {
          finalAllowedTypes.push('link');
        } else {
          finalAllowedTypes = [...finalAllowedTypes, ...newLinkTypes];
        }
      }

      // Update assignment info
      const response = await fetch(`/api/updateTable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          table: 'assignmentInfo',
          data: {
            assignmentID: assignmentID,
            isGroupAssignment: newGroupAssignment,
            allowedFileTypes: finalAllowedTypes.join(','), // Join array into comma-separated string
            startDate: newStartDate,
            endDate: newEndDate,
            dueDate: newDueDate,
          }
        })
      });

      if (response.ok) {
        console.log("Assignment updated successfully");
        toast.success("Assignment updated successfully");
        setIsModalOpen(false);
        router.reload();
      } else {
        console.error("Failed to update assignment");
        toast.error("Failed to update assignment");
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast.error("Error updating assignment");
    }
  };
  function handleEditAssignmentClick(): void {
    setIsModalOpen(true);
  }
  const handleDownload = (submission: Submission) => {
    const blob = base64ToBlob(submission.fileContent, submission.fileType);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = submission.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleView = (submission: Submission) => {
    setCurrentFile(submission);
    setViewerOpen(true);
  };

  const base64ToBlob = (base64: string, type: string) => {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: type });
  };

  const FileViewer = ({ file }: { file: Submission }) => {
    if (file.fileType.startsWith('image/')) {
      return <img src={`data:${file.fileType};base64,${file.fileContent}`} alt={file.fileName} style={{ maxWidth: '100%' }} />;
    } else if (file.fileType === 'application/pdf') {
      return <iframe src={`data:${file.fileType};base64,${file.fileContent}`} width="100%" height="500px" />;
    } else if (file.fileType === 'text/plain') {
      return <pre>{atob(file.fileContent)}</pre>;
    } else {
      return <p>Preview not available for this file type.</p>;
    }
  };



  return (
    <>
      {isAdmin ? <AdminNavbar /> : <InstructorNavbar />}
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{assignment.title || "Assignment Name- Details"}</h1>          

          <br />          

          <Breadcrumbs>
            <BreadcrumbItem onClick={handleHomeClick}>Home</BreadcrumbItem>
            <BreadcrumbItem onClick={handleBackClick}>
              {courseData ? courseData.courseName : "Course Dashboard"}
            </BreadcrumbItem>
            <BreadcrumbItem>{assignment.title}</BreadcrumbItem>
          </Breadcrumbs>
        </div><Button size='sm' color="primary" variant='ghost' className='self-end text-right' onClick={handleEditAssignmentClick}>Edit Assignment</Button>
        <div className={styles.assignmentsSection}>         

          <AssignmentDetailCard
            title={assignment.title}
            description={assignment.descr || "No description available"}
            deadline={new Date(assignment.deadline).toLocaleString() || "No deadline set"}

          /> <h2>Submissions</h2>
           <Table aria-label="Submissions table">
          <TableHeader>
            <TableColumn>Student Name</TableColumn>
            <TableColumn>File Name</TableColumn>
            <TableColumn>Submission Date</TableColumn>
            <TableColumn>Grade</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {assignment.submissions.map((submission) => (
              <TableRow key={submission.submissionID}>
                <TableCell>{`${submission.firstName} ${submission.lastName}`}</TableCell>
                <TableCell>{submission.fileName}</TableCell>
                <TableCell>{new Date(submission.submissionDate).toLocaleString()}</TableCell>
                <TableCell>{submission.grade || 'Not graded'}</TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    onClick={() => handleDownload(submission)}
                    disabled={!submission.fileContent}
                  >
                    Download
                  </Button>
                  {['image/', 'application/pdf', 'text/plain'].some(type => submission.fileType.startsWith(type)) && (
                    <Button 
                      size="sm" 
                      onClick={() => handleView(submission)}
                      disabled={!submission.fileContent}
                    >
                      View
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
          <Modal isOpen={viewerOpen} onClose={() => setViewerOpen(false)}>
            <ModalContent>
              <ModalHeader>{currentFile?.fileName}</ModalHeader>
              <ModalBody>
                {currentFile && <FileViewer file={currentFile} />}
              </ModalBody>
              <ModalFooter>
                <Button onClick={() => setViewerOpen(false)}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>


          <Modal
            className='z-20'
            backdrop="blur"
            isOpen={isModalOpen}
            onOpenChange={(open) => setIsModalOpen(open)}
          >
            <ModalContent>
              <ModalHeader>Edit Assignment Details</ModalHeader>
              <ModalBody>
                <Input
                  isClearable
                  fullWidth

                  label="Enter new title"
                  value={newAssignmentName}
                  onChange={handleAssignmentNameChange}
                />
                <Textarea
                  size="sm"

                  placeholder="Assignment Description"
                  value={newAssignmentDesc}
                  onChange={handleAssignmentDescriptionChange}
                />
                <h3>Select New Start Date:</h3>
                <Input
                  color="success"
                  variant="underlined"
                  size="sm"
                  type="datetime-local"
                  className={styles.textbox}
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <div >
                  <h3>Select New Due Date:</h3>
                  <Input
                    color="warning"
                    variant="underlined"
                    size="sm"
                    type="datetime-local"
                    className={styles.textbox}
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div>
                  <h3>Select New End Date:</h3>
                  <Input
                    color="danger"
                    variant="underlined"
                    size="sm"
                    type="datetime-local"
                    className={styles.textbox}
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div className="flex">
                  <h3 className={styles.innerTitle}>Group Assignment:</h3>

                  <Checkbox
                    className={styles.innerTitle}
                    isSelected={newGroupAssignment}
                    onValueChange={setnewGroupAssignment}
                  >
                    Group Assignment
                  </Checkbox>
                </div>
                <div className="flex-row align-top items-start justify-start">
                  <CheckboxGroup
                    size="sm"
                    color="primary"
                    value={newAllowedFileTypes}
                    onValueChange={setNewAllowedFileTypes}
                    orientation="horizontal"
                  >
                    <h3 className={styles.innerTitle}>Allowed file types:</h3>
                    <Checkbox value="txt">Text (.txt)</Checkbox>
                    <Checkbox value="pdf">PDF (.pdf)</Checkbox>
                    <Checkbox value="docx">Word (.docx)</Checkbox>
                    <Checkbox value="zip">ZIP (.zip)</Checkbox>
                    <div className="flex-col">
                      <Checkbox
                        isSelected={newAllowLinks}
                        onValueChange={setNewAllowLinks}
                      >
                        Allow link submissions
                      </Checkbox>

                      <br />
                    </div>
                  </CheckboxGroup>{newAllowLinks && (
                    <div>
                      <br />
                      <CheckboxGroup
                        size="sm"
                        color="primary"
                        value={newLinkTypes}
                        onValueChange={setNewLinkTypes}
                        orientation="vertical"
                      >
                        <h3 className={styles.innerTitle}>Allowed link types:</h3>
                        <Checkbox value="github">GitHub</Checkbox>
                        <Checkbox value="googledocs">Google Docs</Checkbox>
                        <Checkbox value="link">Any link</Checkbox>
                      </CheckboxGroup>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={() => setIsModalOpen(false)}>
                  Close
                </Button>
                <Button color="primary" onPress={handleAssignmentsUpdate}>
                  Update
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>

      </div>
    </>
  );
}

export default AssignmentDashboard;
function setIsModalOpen(arg0: boolean) {
  throw new Error("Function not implemented.");
}

