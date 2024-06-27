import type { NextPage } from 'next';
import { useCallback } from 'react';
import styles from '../../../styles/confirm-delete-course.module.css';

export type ConfirmDeleteCourseType = {
  className?: string;
  onClose: () => void;
}

const ConfirmDeleteCourse: NextPage<ConfirmDeleteCourseType> = ({ className = "", onClose }) => {

  const onInstructorButtonContainerClick = useCallback(() => {
    // Add your code here
  }, []);

  return (
    <div className={[styles.confirmDeleteCourse, className].join(' ')}>
      <img className={styles.multiplyIcon} alt="" src="/Images/Close.png" onClick={onClose} />
      <i className={styles.confirmDelete}>Confirm Delete</i>
      <b className={styles.onceYouConfirm}>Once you confirm delete, the change will be made permanent. Confirm below to continue.</b>
      <div className={styles.instructorButton} onClick={onInstructorButtonContainerClick}>
        <div className={styles.instructorButtonChild} />
        <b className={styles.createAssignment}>Delete</b>
      </div>
    </div>
  );
};

export default ConfirmDeleteCourse;
