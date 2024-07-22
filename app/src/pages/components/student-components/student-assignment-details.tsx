import React from 'react';
import { Card, CardBody } from "@nextui-org/react";

interface StudentAssignmentViewProps {
    // title: string;
    description: string;
    deadline: string;
    allowedFileTypes: string;
  }

const StudentAssignmentView: React.FC<StudentAssignmentViewProps> = ({description, deadline, allowedFileTypes}) =>{
    return (
        <div>
            <Card>
                <CardBody>
                    {/* <h2>{title}</h2> */}
                    <h3>Description:</h3>
                    <p>{description}</p>
                    <br />
                    <h3>Due Date:</h3>
                    <p>{deadline}</p>
                    <br />
                    <h3>Upload Restrictions</h3>
                    <p>{allowedFileTypes}</p>
                </CardBody>
            </Card>
        </div>
    );
}

export default StudentAssignmentView;