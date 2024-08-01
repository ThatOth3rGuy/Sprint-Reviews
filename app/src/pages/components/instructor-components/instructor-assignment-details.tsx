import React, { useState } from 'react';
import { Button, Card, CardBody, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import styles from "../../../styles/AssignmentDetailCard.module.css";
import router from 'next/router';
import toast from 'react-hot-toast';

interface AssignmentDetailCardProps {
  title: string;
  description: string;
  deadline: string;


}

const AssignmentDetailCard: React.FC<AssignmentDetailCardProps> = ({
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
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-black">Submitted Students</h3>
          {submittedStudents.map((student, index) => (
            <Card key={index} className={styles.studentsCard}>
              <CardBody>
                <p>{student}</p>
              </CardBody>
            </Card>
          ))}
        </div>
        
      </div> */}
    </div>
  );
};

export default AssignmentDetailCard;
