import React from 'react';
import { useRouter } from 'next/router';
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react';
import style from '../../../styles/instructor-components.module.css';

interface InstructorAssignmentCardProps {
  courseID: number;
  courseName: string;
  color: string;
  
}

const InstructorAssignmentCard: React.FC<InstructorAssignmentCardProps> = ({ courseID, courseName, color }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/instructor/assignment-dashboard?assignmentID=${courseID}`);
  };

  return (
    <Card shadow="sm" className={`${style.outerCard}`} isPressable onPress={handleClick}>
      <CardBody className="overflow-visible p-0">
        
      </CardBody>
      <CardFooter className="text-small justify-between" style={{ backgroundColor: color }}>
        <b>{courseName}</b>
      </CardFooter>
    </Card>
  );
};

export default InstructorAssignmentCard;