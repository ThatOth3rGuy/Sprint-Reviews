import React from 'react';
import { useRouter } from 'next/router';
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react';
import style from '../../../styles/student-components.module.css';

interface StudentAssignmentCardProps {
  courseID: number;
  courseName: string;
  assignmentName: string;
  color: string;
  deadline: string;
}

const StudentAssignmentCard: React.FC<StudentAssignmentCardProps> = ({ courseID, courseName, assignmentName, color, deadline }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/student/assignment-dashboard?assignmentID=${courseID}`);
  };

  return (
    <Card shadow="sm" className={`${style.outerCard}`} isPressable onPress={handleClick}>
      <CardBody className="overflow-visible p-2 rounded-sm" style={{ backgroundColor: color }}>
        <p>{assignmentName}</p>
      </CardBody>
      <CardFooter className="text-small justify-between p-1" >
        <b>{courseName}</b>
        <p>{deadline}</p>
      </CardFooter>
    </Card>
  );
};

export default StudentAssignmentCard;