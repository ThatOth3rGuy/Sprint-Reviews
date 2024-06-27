import type { NextPage } from 'next';
import { useState, useCallback } from 'react';
import AdminCourseOptions from "./admin-course-options";
import PortalPopup from "../../components/portal-popup";
import styles from '../../../styles/admin-course.module.css';


const CourseAdmin:NextPage = () => {
  	const [isAdminCourseOptionsOpen, setAdminCourseOptionsOpen] = useState(false);
  	
  	const openAdminCourseOptions = useCallback(() => {
    		setAdminCourseOptionsOpen(true);
  	}, []);
  	
  	const closeAdminCourseOptions = useCallback(() => {
    		setAdminCourseOptionsOpen(false);
  	}, []);
  	
  	return (<>
    		<div className={styles.courseAdmin}>
      			<img className={styles.courseAdminChild} alt="" src="/Images/Course-Card outline.svg" />
      			<b className={styles.assignment1}>Course</b>
      			<i className={styles.dueDate}>Instructor</i>
      			<i className={styles.gradePendingRelease}>Average Grade</i>
      			<img className={styles.moreIcon} alt="" src="/Images/More.png" onClick={openAdminCourseOptions} />
    		</div>
    		{isAdminCourseOptionsOpen && (
      			<PortalPopup
        				overlayColor="rgba(113, 113, 113, 0.3)"
        				placement="Centered"
        				
        				
        				
        				
        				
        				onOutsideClick={closeAdminCourseOptions}
        				>
        				<AdminCourseOptions onClose={closeAdminCourseOptions} />
      			</PortalPopup>
    		)}</>);
};

export default CourseAdmin;
