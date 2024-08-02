
import React, { useState } from 'react';
import { Button, Card, CardBody, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useRouter } from 'next/router';
import styles from "../../../styles/AssignmentDetailCard.module.css";
import router from 'next/router';
import toast from 'react-hot-toast';

interface AssignmentDetailCardProps {
  assignmentID: number;
  title: string;
  description: string;
  deadline: string;

  isGroupAssignment: boolean;
  submittedEntities: { studentID: number; name: string; fileName: string }[] | { groupID: number; groupName: string; members: { studentID: number; name: string; fileName: string }[] }[];
  remainingEntities: { studentID: number; name: string }[] | { groupID: number; groupName: string; members: { studentID: number; name: string }[] }[];


const AssignmentDetailCard: React.FC<AssignmentDetailCardProps> = ({
  assignmentID,
  title,
  description,
  deadline,


=======
  isGroupAssignment,
  submittedEntities = [],
  remainingEntities = [],
}) => {
  const router = useRouter();

  const handleNavigation = (id: number, isGroup: boolean) => {
    const page = isGroup ? 'group-submission-feedback' : 'submission-feedback';
    router.push(`/instructor/${page}/?assignmentID=${assignmentID}&studentID=${id}`);
  };

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
          <h3 className="text-lg font-semibold mb-2 text-black">
            {isGroupAssignment ? "Submitted Groups" : "Submitted Students"}
          </h3>
          {isGroupAssignment ? (
            <Accordion>
              {(submittedEntities as { groupID: number; groupName: string; members: { studentID: number; userID: number; name: string; fileName: string }[] }[]).map((group) => (
                <AccordionItem key={group.groupID} title={group.groupName}>
                  <Listbox>
                    {group.members.map((member) => (
                      <ListboxItem key={member.studentID} onClick={() => handleNavigation(member.userID, true)}>
                        {member.name}
                      </ListboxItem>
                    ))}
                  </Listbox>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Listbox>
              {(submittedEntities as { studentID: number; userID: number; name: string; fileName: string }[]).map((student) => (
                <ListboxItem key={student.studentID} onClick={() => handleNavigation(student.userID, false)}>
                  {student.name}
                </ListboxItem>
              ))}
            </Listbox>
          )}
        </div>

        
      </div> */}

        <div>
          <h3 className="text-lg font-semibold mb-2 text-black">
            {isGroupAssignment ? "Remaining Groups" : "Remaining Students"}
          </h3>
          {isGroupAssignment ? (
            <Accordion>
              {(remainingEntities as { groupID: number; groupName: string; members: { studentID: number; userID: number; name: string }[] }[]).map((group) => (
                <AccordionItem key={group.groupID} title={group.groupName}>
                  <Listbox>
                    {group.members.map((member) => (
                      <ListboxItem key={member.studentID} onClick={() => handleNavigation(member.userID, true)}>
                        {member.name}
                      </ListboxItem>
                    ))}
                  </Listbox>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Listbox>
              {(remainingEntities as { studentID: number; userID: number; name: string }[]).map((student) => (
                <ListboxItem key={student.studentID} onClick={() => handleNavigation(student.userID, false)}>
                  {student.name}
                </ListboxItem>
              ))}
            </Listbox>
          )}
        </div>
      </div>

    </div>
  );
};

export default AssignmentDetailCard;
