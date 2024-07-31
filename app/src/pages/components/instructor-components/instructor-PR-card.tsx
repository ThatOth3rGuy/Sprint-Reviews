import { useRouter } from "next/router";
import React from 'react';
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import styles from "../../../styles/AssignmentDetailCard.module.css";


interface InstructorReviewCardProps {
    reviewID: number;
    linkedAssignmentID: string;
    color: string;
  }
  
  export default function InstructorReviewCard({ reviewID, linkedAssignmentID, color }: InstructorReviewCardProps) {
    const router = useRouter();
  
    const handleClick = () => {
      router.push(`/instructor/peer-review-dashboard?reviewID=${reviewID}`);
    };
  
    return (
        <Card shadow="sm" className={`${styles.outerCard}`}  isPressable onPress={handleClick}>
        <CardBody className="overflow-visible p-2">
  <p>Review ID: {reviewID}</p>
</CardBody>
        <CardFooter className="text-small justify-between" style={{ backgroundColor: color }}>
  <b>{`Linked to Assignment ${linkedAssignmentID}`}</b>
</CardFooter>
      </Card>
    );
  }
  