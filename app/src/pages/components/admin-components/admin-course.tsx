// admin-course.tsx
/* eslint-disable @next/next/no-img-element */
import styles from '../../../styles/admin-course.module.css';
import { useState, useCallback } from 'react';
import AdminCourseOptions from "./admin-course-options";
import PortalPopup from "../../components/portal-popup";
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Popover, PopoverContent, PopoverTrigger, Tooltip } from '@nextui-org/react';
import { color } from 'framer-motion';
// import style from 'styled-jsx/style';
import style from '../../../styles/instructor-components.module.css';
import { useRouter } from 'next/router';

interface AdminCourseCardProps {
  courseName: string;
  instructor: string;
  averageGrade: number | null;
  courseID: number;
  img: string;
}

const AdminCourseCard: React.FC<AdminCourseCardProps> = ({ courseName, instructor, averageGrade, courseID, img }) => {
  // const [isAdminCourseOptionsOpen, setAdminCourseOptionsOpen] = useState(false);

  // const openAdminCourseOptions = useCallback(() => {
  //   setAdminCourseOptionsOpen(true);
  // }, []);

  // const closeAdminCourseOptions = useCallback(() => {
  //   setAdminCourseOptionsOpen(false);
  // }, []);

  

  const router = useRouter();

  const handleClick = () => {
    router.push(`/instructor/course-dashboard?courseId=${courseID}`);
  };

  return (
    <Card shadow="sm" className={`${style.outerCard}`} isPressable onPress={handleClick}>
      
      <CardBody className="overflow-visible p-0">
      <AdminCourseOptions courseID={courseID} />
      {/* <img className="ml-auto w-[5%]" alt="More" src="/Images/More.png" onClick={(e) => { e.stopPropagation(); openAdminCourseOptions(); }} /> */}
      {/* <Popover placement="right-end" showArrow={true}>
        <PopoverTrigger>
          <img className="ml-auto w-[5.5%]" alt="More" src="/Images/More.png"  />
        </PopoverTrigger>
        <PopoverContent>
          <AdminCourseOptions courseID={courseID}/>
        </PopoverContent>
      </Popover> */}
      <Image
        shadow="sm"
        radius="lg"
        width="100%"
        alt={courseName}
        className="w-full object-cover h-[140px]"
        src={img}
      />
      </CardBody>
      <CardFooter className="text-small justify-between" >
        <b>{courseName}</b>
        <b>{instructor}</b>
        <i >
          Avg: {averageGrade !== null && averageGrade !== undefined ? averageGrade.toFixed(2) : 'N/A'}%
        </i>
      </CardFooter>
    </Card>

  );
};

export default AdminCourseCard;
