// components/student-components/student-group-details.tsx
import React from 'react';
import { Card, CardBody } from "@nextui-org/react";

interface StudentGroupDetailsProps {
    groupID: number;
    students: { studentID: number; firstName: string; lastName: string }[];
}

const StudentGroupDetails: React.FC<StudentGroupDetailsProps> = ({ groupID, students }) => {
    return (
        <Card>
            <CardBody>
                <h3>Group: {groupID}</h3>
                <br />
                <h3>Group Members:</h3>
                <ul>
                    {students.map((student) => (
                        <li key={student.studentID}>
                            {student.firstName} {student.lastName}
                        </li>
                    ))}
                </ul>
            </CardBody>
        </Card>
    );
}

export default StudentGroupDetails;
