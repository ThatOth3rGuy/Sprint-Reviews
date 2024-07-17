// admin-course-options.tsx
/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import ConfirmDeleteCourse from "./confirm-delete-course";
import PortalPopup from "../portal-popup";
import styles from '../../../styles/admin-course-options.module.css';

export type AdminCourseOptionsType = {
  className?: string;
  courseID: number;
  onClose(): void;
}

const AdminCourseOptions: NextPage<AdminCourseOptionsType> = ({ className = "", courseID, onClose }) => {
  const [isConfirmDeleteCourseOpen, setConfirmDeleteCourseOpen] = useState(false);
  const router = useRouter();

  const openConfirmDeleteCourse = useCallback(() => {
    setConfirmDeleteCourseOpen(true);
  }, []);

  const closeConfirmDeleteCourse = useCallback(() => {
    setConfirmDeleteCourseOpen(false);
  }, []);

  const onArchiveContainerClick = useCallback(async () => {
    try {
      const response = await fetch('/api/courses/archiveCourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseID }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle archive status');
      }

      // Handle successful response
      onClose(); // Close the popup after archiving
      router.reload(); // Reload the page to refresh the state
    } catch (error) {
      console.error('Error toggling archive status:', error);
    }
  }, [courseID, onClose, router]);

  return (
    <>
      <div className={[styles.adminCourseOptions, className].join(' ')}>
        <div className={styles.archive} onClick={onArchiveContainerClick}>
          <div className={styles.archiveChild} />
          <b className={styles.archiveCourse}>Toggle Archive Status</b>
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
          <ConfirmDeleteCourse onClose={closeConfirmDeleteCourse} courseID={courseID} />
        </PortalPopup>
      )}
    </>
  );
};

export default AdminCourseOptions;
