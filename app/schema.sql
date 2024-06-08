-------------------------------------
 -- schema.sql
 -- script for initializing the db.
 -------------------------------------


CREATE TABLE user (
    userID INT PRIMARY KEY,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(100),
    role VARCHAR(20),
    institution VARCHAR(100)
);

CREATE TABLE student (
    userID INT PRIMARY KEY,
    phoneNumber VARCHAR(15),
    address VARCHAR(255),
    dateOfBirth DATE,
    FOREIGN KEY (userID) REFERENCES user(userID)
);

CREATE TABLE instructor (
    userID INT PRIMARY KEY,
    isAdmin BOOLEAN,
    departments VARCHAR(255),
    FOREIGN KEY (userID) REFERENCES user(userID)
);

CREATE TABLE class (
    classID INT PRIMARY KEY,
    className VARCHAR(100),
    description TEXT,
    isArchived BOOLEAN,
    instructorID INT,
    FOREIGN KEY (instructorID) REFERENCES instructor(userID)
);

CREATE TABLE assignment (
    assignmentID INT PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    rubric TEXT,
    deadline DATETIME,
    groupAssignment BOOLEAN,
    classID INT,
    FOREIGN KEY (classID) REFERENCES class(classID)
);

CREATE TABLE Submission (
    submissionID INT PRIMARY KEY,
    assignmentID INT,
    content TEXT,
    studentID INT,
    FOREIGN KEY (assignmentID) REFERENCES assignment(assignmentID),
    FOREIGN KEY (studentID) REFERENCES student(userID)
);

CREATE TABLE Feedback (
    feedbackID INT PRIMARY KEY,
    assignmentID INT,
    content TEXT,
    otherStudentID INT,
    FOREIGN KEY (assignmentID) REFERENCES assignment(assignmentID),
    FOREIGN KEY (otherStudentID) REFERENCES student(userID)
);

CREATE TABLE Enrollment (
    studentID INT,
    classID INT,
    PRIMARY KEY (studentID, classID),
    FOREIGN KEY (studentID) REFERENCES student(userID),
    FOREIGN KEY (classID) REFERENCES class(classID)
);
