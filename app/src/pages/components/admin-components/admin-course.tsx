// /components/admin-components/admin-course.tsx
import styles from '../../../styles/admin-course.module.css';

interface AdminCourseCardProps {
  courseName: string;
  instructor: string;
  averageGrade: number | null;
}

const AdminCourseCard: React.FC<AdminCourseCardProps> = ({ courseName, instructor, averageGrade }) => {
  return (
    <div className={styles.courseAdmin}>
      <img className={styles.courseAdminChild} alt="" src="/Images/Course-Card outline.svg" />
      <b className={styles.assignment1}>{courseName}</b>
      <i className={styles.instructor}>{instructor}</i>
      <i className={styles.gradePendingRelease}> Avg: {' '}
        {averageGrade !== null && averageGrade !== undefined ? averageGrade.toFixed(2) : 'N/A'}
       %</i>
      <img className={styles.moreIcon} alt="" src="/Images/More.png" />
    </div>
  );
};

export default AdminCourseCard;
