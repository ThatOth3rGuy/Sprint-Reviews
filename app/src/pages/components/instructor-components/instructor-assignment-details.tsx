import React from 'react';
import { Card, CardBody, Accordion, AccordionItem } from "@nextui-org/react";
import styles from "../../../styles/AssignmentDetailCard.module.css";

interface AssignmentDetailCardProps {
  title: string;
  description: string;
  deadline: string;
  isGroupAssignment: boolean;
  submittedEntities: { name: string; fileName: string }[] | { groupID: number; groupName: string; members: { name: string; fileName: string }[] }[];
  remainingEntities: string[] | { groupID: number; groupName: string; members: string[] }[];
}

const AssignmentDetailCard: React.FC<AssignmentDetailCardProps> = ({
  title,
  description,
  deadline,
  isGroupAssignment,
  submittedEntities,
  remainingEntities,
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
          {isGroupAssignment ? (
            <Accordion>
              {(submittedEntities as { groupID: number; groupName: string; members: { name: string; fileName: string }[] }[]).map((group, index) => (
                <AccordionItem key={index} aria-label={group.groupName} title={group.groupName}>
                  {group.members.map((member, i) => (
                    <div key={i} className={styles.memberItem}>
                      {member.name} - {member.fileName}
                    </div>
                  ))}
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <ul>
              {(submittedEntities as { name: string; fileName: string }[]).map((student, index) => (
                <li key={index} className={styles.memberItem}>
                  {student.name} - {student.fileName}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-black">
            {isGroupAssignment ? "Remaining Groups" : "Remaining Students"}
          </h3>
          {isGroupAssignment ? (
            <Accordion>
              {(remainingEntities as { groupID: number; groupName: string; members: string[] }[]).map((group, index) => (
                <AccordionItem key={index} aria-label={group.groupName} title={group.groupName}>
                  {group.members.map((member, i) => (
                    <div key={i} className={styles.memberItem}>
                      {member}
                    </div>
                  ))}
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <ul>
              {(remainingEntities as string[]).map((student, index) => (
                <li key={index} className={styles.memberItem}>
                  {student}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailCard;
