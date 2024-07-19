import React from 'react';
import { Card, CardBody } from "@nextui-org/react";
import styles from "../../../styles/AssignmentDetailCard.module.css";

interface ReviewDetailProps {
  title: string;
  description: string;
  deadline: string;
  //Something to have the review criteria shown here 
}

const ReviewDetailCard: React.FC<ReviewDetailProps> = ({
  title,
  description,
  deadline,

}) => {
  return (
    
    <div className={styles.courseCards}>
      <Card className={styles.assignmentCard}>
        <CardBody>
          <h2 className={styles.assignmentTitle}>{title}</h2>
          <p className={styles.assignmentDescription}>{description}</p>
          <p className={styles.assignmentDeadline}>Deadline: {deadline}</p>
        </CardBody>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailCard;
