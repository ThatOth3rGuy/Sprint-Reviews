import React from 'react';
import { useRouter } from 'next/router';
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react';
import style from '../../../styles/instructor-components.module.css';

interface InstructorAssignmentCardProps {
  courseID: number;
  courseName: string;
  assignmentName: string;
  color: string;
  deadline: string;

}

const InstructorAssignmentCard: React.FC<InstructorAssignmentCardProps> = ({ courseID, courseName, assignmentName, deadline, color }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/instructor/assignment-dashboard?assignmentID=${courseID}`);
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

export default InstructorAssignmentCard;