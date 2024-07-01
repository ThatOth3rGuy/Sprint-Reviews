-- init.sql
-- script for initializing the db.
CREATE DATABASE IF NOT EXISTS mydb;
USE mydb;


DROP TABLE IF EXISTS user;
-- Table for storing users, which are separated into students and instructors
CREATE TABLE IF NOT EXISTS user (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    email VARCHAR(100),
    pwd VARCHAR(100),
    userRole VARCHAR(20),
    institution VARCHAR(100)
);

DROP TABLE IF EXISTS student;
-- Table for storing student, connected to the user table
CREATE TABLE IF NOT EXISTS student (
    userID INT PRIMARY KEY,
    studentID INT,
    phoneNumber VARCHAR(15),
    homeAddress VARCHAR(255),
    dateOfBirth DATE,
    FOREIGN KEY (userID) REFERENCES user(userID)
);

DROP TABLE IF EXISTS instructor;
-- Table for storing instructor information, connected to the user table
CREATE TABLE IF NOT EXISTS instructor (
    userID INT PRIMARY KEY,
    isAdmin BOOLEAN,
    departments VARCHAR(255),
    FOREIGN KEY (userID) REFERENCES user(userID)
);

DROP TABLE IF EXISTS course;
-- Table for storing courses
CREATE TABLE IF NOT EXISTS course (
    courseID INT AUTO_INCREMENT PRIMARY KEY,
    courseName VARCHAR(100),
    isArchived BOOLEAN,
    instructorID INT,
    FOREIGN KEY (instructorID) REFERENCES instructor(userID)
);

DROP TABLE IF EXISTS assignment;
-- Table for storing assignment information
CREATE TABLE IF NOT EXISTS assignment (
    assignmentID INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    rubric TEXT,
    deadline DATETIME,
    groupAssignment BOOLEAN,
    courseID INT,
    allowedFileTypes VARCHAR(255),
    FOREIGN KEY (courseID) REFERENCES course(courseID)
);

DROP TABLE IF EXISTS submission;
CREATE TABLE IF NOT EXISTS submission (
    submissionID INT AUTO_INCREMENT PRIMARY KEY,
    assignmentID INT,
    studentID INT,
    fileName VARCHAR(255),
    fileContent LONGBLOB,
    fileType VARCHAR(100),
    submissionDate DATETIME,
    FOREIGN KEY (assignmentID) REFERENCES assignment(assignmentID),
    FOREIGN KEY (studentID) REFERENCES student(userID)
);
-- Review creation table for instrcutor
DROP TABLE IF EXISTS review_criteria;
CREATE TABLE IF NOT EXISTS review_criteria (
    criteriaID INT AUTO_INCREMENT PRIMARY KEY,
    assignmentID INT,
    criterion VARCHAR(255),
    maxMarks INT,
    FOREIGN KEY (assignmentID) REFERENCES assignment(assignmentID)
);
DROP TABLE IF EXISTS feedback;
-- Table for storing feedback information between students and assignments
CREATE TABLE IF NOT EXISTS feedback (
    feedbackID INT AUTO_INCREMENT PRIMARY KEY,
    assignmentID INT,
    content TEXT,
    otherStudentID INT,
    FOREIGN KEY (assignmentID) REFERENCES assignment(assignmentID),
    FOREIGN KEY (otherStudentID) REFERENCES student(userID)
);

DROP TABLE IF EXISTS enrollment;
-- Table for storing enrollment information to connect students to courses
CREATE TABLE IF NOT EXISTS enrollment (
    studentID INT,
    courseID INT,
    PRIMARY KEY (studentID, courseID),
    FOREIGN KEY (studentID) REFERENCES student(userID),
    FOREIGN KEY (courseID) REFERENCES course(courseID)
);


-- Insert a sample user (student) into the user table
INSERT INTO user (firstName, lastName, email, pwd, userRole, institution)
VALUES ('John', 'Doe', 'john.doe@example.com', 'password123', 'student', 'Example University');

-- Insert a sample user (instructor) into the user table
INSERT INTO user (firstName, lastName, email, pwd, userRole, institution)
VALUES ('Admin', 'Instructor', 'admin@gmail.com', 'password', 'instructor', 'Example University');

-- Get the userID of the newly inserted instructor
SET @userID = LAST_INSERT_ID();

-- Insert the instructor into the instructor table with isAdmin set to true
INSERT INTO instructor (userID, isAdmin, departments)
VALUES (@userID, true, 'Computer Science');