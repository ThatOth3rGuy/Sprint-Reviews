/* eslint-disable @next/next/no-img-element */
import styles from '../../../styles/admin-course.module.css';
import { useState, useCallback } from 'react';
import AdminCourseOptions from "./admin-course-options";
import PortalPopup from "../../components/portal-popup";

interface AdminCourseCardProps {
  courseName: string;
  instructor: string;
  averageGrade: number | null;
}

const AdminCourseCard: React.FC<AdminCourseCardProps> = ({ courseName, instructor, averageGrade }) => {
  const [isAdminCourseOptionsOpen, setAdminCourseOptionsOpen] = useState(false);

  const openAdminCourseOptions = useCallback(() => {
    setAdminCourseOptionsOpen(true);
  }, []);

  const closeAdminCourseOptions = useCallback(() => {
    setAdminCourseOptionsOpen(false);
  }, []);

  return (
    <div className={styles.courseAdmin}>
      <img className={styles.courseAdminChild} alt="" src="/Images/Course-Card outline.svg" />
      <b className={styles.assignment1}>{courseName}</b>
      <i className={styles.instructor}>{instructor}</i>
      <i className={styles.gradePendingRelease}>Avg: {averageGrade !== null && averageGrade !== undefined ? averageGrade.toFixed(2) : 'N/A'}%</i>
      <img className={styles.moreIcon} alt="" src="/Images/More.png" onClick={openAdminCourseOptions} />
      
      {isAdminCourseOptionsOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeAdminCourseOptions}
        >
          <AdminCourseOptions onClose={closeAdminCourseOptions} />
        </PortalPopup>
      )}
    </div>
  );
};

export default AdminCourseCard;
