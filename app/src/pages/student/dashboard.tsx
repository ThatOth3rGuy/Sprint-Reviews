import StudentHeader from '../components/student-components/student-header';
import StudentNavbar from '../components/student-components/student-navbar';
import styles from '../../styles/student-dashboard.module.css';
import { useState, useCallback } from 'react';
import { useSessionValidation } from '../api/auth/checkSession';

function Page() {
  const [loading, setLoading] = useState(true);
  const [courseID, setCourseID] = useState('');
  const [session, setSession] = useState<any>(null);

  // Use the session validation hook to check if the user is logged in
  useSessionValidation('student', setLoading, setSession);

  const onAssignmentsContainerClick = useCallback(() => {
  // Redirect to the assignments page
  }, [courseID]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (<>
      		<div className={styles.studentHome}>
          <div className={styles.courseCard} onClick={onAssignmentsContainerClick}>
                <img className={styles.courseCardChild} alt="" src="/CourseCard-outline.svg" />
        				<div className={styles.courseCardItem} />
        				<b className={styles.course1}>Course 1</b>
        				<i className={styles.instructor}>Instructor</i>
      			</div>
      			<div className={styles.courseCard1} onClick={onAssignmentsContainerClick}>
        				<img className={styles.courseCardChild} alt="" src="/CourseCard-outline.svg" />
        				<div className={styles.courseCardItem} />
        				<b className={styles.course1}>Course 1</b>
        				<i className={styles.instructor}>Instructor</i>
      			</div>
      			<div className={styles.courseCard2} onClick={onAssignmentsContainerClick}>
            <img className={styles.courseCardChild} alt="" src="/CourseCard-outline.svg" />
        				<div className={styles.courseCardItem} />
        				<b className={styles.course1}>Course 1</b>
        				<i className={styles.instructor}>Instructor</i>
      			</div>
      			<div className={styles.courseCard3} onClick={onAssignmentsContainerClick}>
            <img className={styles.courseCardChild} alt="" src="/CourseCard-outline.svg" />
        				<div className={styles.courseCardItem} />
        				<b className={styles.course1}>Course 1</b>
        				<i className={styles.instructor}>Instructor</i>
      			</div>
            <div className={styles.pendingAssignments}>
        				<div className={styles.pendingAssignmentsChild} />
        				<div className={styles.pendingAssignmentsItem} />
        				<b className={styles.pendingAssignments1}>Pending Assignments</b>
        				<div className={styles.assignmentDetails} onClick={onAssignmentsContainerClick}>
          					<b className={styles.assignment}>Assignment</b>
          					<b className={styles.due010101}>Due: 01/01/01</b>
          					<b className={styles.course}>Course</b>
          					<img className={styles.assignmentDetailsChild} alt="" src="/Line.svg" />
        				</div>
      			</div>
      			<div className={styles.assignmentDetails1} onClick={onAssignmentsContainerClick}>
        				<b className={styles.assignment}>Assignment</b>
        				<b className={styles.due010101}>Due: 01/01/01</b>
        				<b className={styles.course}>Course</b>
        				<img className={styles.assignmentDetailsChild} alt="" src="/Line.svg" />
      			</div>
      			<b className={styles.breadcrumbs}>Breadcrumbs</b>
          </div>
      <br />
      <br />
      <br />
      <StudentHeader title="Dashboard"/>
      <StudentNavbar/>
    </>
  );
}

export default Page;