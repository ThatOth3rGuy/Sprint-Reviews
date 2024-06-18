-- init.sql
-- script for initializing the db.
CREATE DATABASE IF NOT EXISTS mydb;
USE mydb;

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

-- Table for storing student, connected to the user table
CREATE TABLE IF NOT EXISTS student (
    userID INT PRIMARY KEY,
    studentID INT,
    phoneNumber VARCHAR(15),
    homeAddress VARCHAR(255),
    dateOfBirth DATE,
    FOREIGN KEY (userID) REFERENCES user(userID)
);

-- Table for storing instructor information, connected to the user table
CREATE TABLE IF NOT EXISTS instructor (
    userID INT PRIMARY KEY,
    isAdmin BOOLEAN,
    departments VARCHAR(255),
    FOREIGN KEY (userID) REFERENCES user(userID)
);

-- Table for storing classes
CREATE TABLE IF NOT EXISTS class (
    classID INT PRIMARY KEY,
    className VARCHAR(100),
    description TEXT,
    isArchived BOOLEAN,
    instructorID INT,
    FOREIGN KEY (instructorID) REFERENCES instructor(userID)
);

-- Table for storing assignment information
CREATE TABLE IF NOT EXISTS assignment (
    assignmentID INT PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    rubric TEXT,
    deadline DATETIME,
    groupAssignment BOOLEAN,
    classID INT,
    FOREIGN KEY (classID) REFERENCES class(classID)
);

-- Table for storing submission information between students and assignments
CREATE TABLE IF NOT EXISTS Submission (
    submissionID INT PRIMARY KEY,
    assignmentID INT,
    content TEXT,
    studentID INT,
    FOREIGN KEY (assignmentID) REFERENCES assignment(assignmentID),
    FOREIGN KEY (studentID) REFERENCES student(userID)
);

-- Table for storing feedback information between students and assignments
CREATE TABLE IF NOT EXISTS Feedback (
    feedbackID INT PRIMARY KEY,
    assignmentID INT,
    content TEXT,
    otherStudentID INT,
    FOREIGN KEY (assignmentID) REFERENCES assignment(assignmentID),
    FOREIGN KEY (otherStudentID) REFERENCES student(userID)
);

-- Table for storing enrollment information to connect students to classes
CREATE TABLE IF NOT EXISTS Enrollment (
    studentID INT,
    classID INT,
    PRIMARY KEY (studentID, classID),
    FOREIGN KEY (studentID) REFERENCES student(userID),
    FOREIGN KEY (classID) REFERENCES class(classID)
);

-- Insert a sample user (student) into the user table
INSERT INTO user (firstName, lastName, email, pwd, userRole, institution)
VALUES ('John', 'Doe', 'john.doe@example.com', 'password123', 'student', 'Example University');

-- Insert a sample user (instructor) into the user table
INSERT INTO user (firstName, lastName, email, pwd, userRole, institution)
VALUES ('Admin', 'Admin', 'admin@example.com', 'password', 'instructor', 'Example University');

-- Get the userID of the newly inserted instructor
SET @userID = LAST_INSERT_ID();

-- Insert the instructor into the instructor table with isAdmin set to true
INSERT INTO instructor (userID, isAdmin, departments)
VALUES (@userID, true, 'Computer Science');
