import type { NextPage } from 'next';
import { useState, useCallback } from 'react';
import ConfirmDeleteCourse from "./confirm-delete-course";
import PortalPopup from "../portal-popup";
import styles from '../../../styles/admin-course-options.module.css';

export type AdminCourseOptionsType = {
  className?: string;
  onClose(): void;
}

const AdminCourseOptions: NextPage<AdminCourseOptionsType> = ({ className = "" }) => {
  const [isConfirmDeleteCourseOpen, setConfirmDeleteCourseOpen] = useState(false);

  const openConfirmDeleteCourse = useCallback(() => {
    setConfirmDeleteCourseOpen(true);
  }, []);

  const closeConfirmDeleteCourse = useCallback(() => {
    setConfirmDeleteCourseOpen(false);
  }, []);

  const onArchiveContainerClick = useCallback(() => {
    // Add your code here
  }, []);

  return (
    <>
      <div className={[styles.adminCourseOptions, className].join(' ')}>
        <div className={styles.archive} onClick={onArchiveContainerClick}>
          <div className={styles.archiveChild} />
          <b className={styles.archiveCourse}>Archive Course</b>
        </div>
        <div className={styles.delete} onClick={openConfirmDeleteCourse}>
          <div className={styles.deleteChild} />
          <b className={styles.archiveCourse}>Delete Course</b>
        </div>
        <div className={styles.arrow}>
          <img className={styles.arrowChild} alt="" src="/Images/Triangle.svg" />
          <div className={styles.arrowItem} />
        </div>
      </div>
      {isConfirmDeleteCourseOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeConfirmDeleteCourse}
        >
          <ConfirmDeleteCourse onClose={closeConfirmDeleteCourse} />
        </PortalPopup>
      )}
    </>
  );
};

export default AdminCourseOptions;
