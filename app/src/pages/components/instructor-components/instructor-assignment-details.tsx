import React from 'react';
import { Card, CardBody } from "@nextui-org/react";
import styles from "../../../styles/AssignmentDetailCard.module.css";

interface AssignmentDetailCardProps {
  title: string;
  description: string;
  deadline: string;
  isGroupAssignment: boolean;
  submittedEntities: { name: string, fileName: string }[];
  remainingEntities: string[];
}

const AssignmentDetailCard: React.FC<AssignmentDetailCardProps> = ({
  title,
  description,
  deadline,
  isGroupAssignment,
  submittedEntities,
  remainingEntities
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
          <h3 className="text-lg font-semibold mb-2 text-black">
            {isGroupAssignment ? "Submitted Groups" : "Submitted Students"}
          </h3>
          {submittedEntities.map((entity, index) => (
            <Card key={index} className={styles.studentsCard}>
              <CardBody>
                <p>{entity.name}</p>
              </CardBody>
            </Card>
          ))}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-black">
            {isGroupAssignment ? "Remaining Groups" : "Remaining Students"}
          </h3>
          {remainingEntities.map((entity, index) => (
            <Card key={index} className={styles.studentsCard}>
              <CardBody>
                <p>{entity}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailCard;
