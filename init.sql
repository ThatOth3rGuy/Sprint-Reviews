-- init.sql
-- script for initializing the db.
CREATE DATABASE IF NOT EXISTS mydb;
USE mydb;

DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS instructor;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS assignment;
DROP TABLE IF EXISTS submission;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS enrollment;
DROP TABLE IF EXISTS selected_students;
DROP TABLE IF EXISTS review_criteria;

-- Table for storing users, which are separated into students and instructors
CREATE TABLE IF NOT EXISTS user (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    pwd VARCHAR(100),
    userRole VARCHAR(20) CHECK (userRole IN ('student', 'instructor'))
);

-- Table for storing student, connected to the user table
CREATE TABLE IF NOT EXISTS student (
    studentID INT PRIMARY KEY,
    userID INT NOT NULL,
    phoneNumber VARCHAR(15),
    homeAddress VARCHAR(255),
    dateOfBirth DATE,
    FOREIGN KEY (userID) REFERENCES user(userID) ON DELETE CASCADE
);

-- Table for storing instructor information, connected to the user table
CREATE TABLE IF NOT EXISTS instructor (
    instructorID INT PRIMARY KEY,
    userID INT NOT NULL,
    isAdmin BOOLEAN,
    departments VARCHAR(255),
    FOREIGN KEY (userID) REFERENCES user(userID) ON DELETE CASCADE
);

-- Table for storing courses
CREATE TABLE IF NOT EXISTS course (
    courseID INT AUTO_INCREMENT PRIMARY KEY,
    courseName VARCHAR(100),
    isArchived BOOLEAN,
    instructorID INT,
    FOREIGN KEY (instructorID) REFERENCES instructor(instructorID) ON DELETE SET NULL
);

-- Table for storing assignment information
CREATE TABLE IF NOT EXISTS assignment (
    assignmentID INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    descr TEXT,
    rubric TEXT,
    deadline DATETIME,
    groupAssignment BOOLEAN,
    courseID INT NOT NULL,
    allowedFileTypes VARCHAR(255),
    FOREIGN KEY (courseID) REFERENCES course(courseID) ON DELETE CASCADE
);

-- Table for storing submission information between students and assignments
CREATE TABLE IF NOT EXISTS submission (
    submissionID INT AUTO_INCREMENT PRIMARY KEY,
    assignmentID INT NOT NULL,
    studentID INT,
    fileName VARCHAR(255),
    fileContent LONGBLOB,
    fileType VARCHAR(100),
    submissionDate DATETIME,
    grade INT,
    FOREIGN KEY (assignmentID) REFERENCES assignment(assignmentID) ON DELETE CASCADE,
    FOREIGN KEY (studentID) REFERENCES student(studentID) ON DELETE SET NULL
);

-- Review creation table for instructor
CREATE TABLE IF NOT EXISTS review_criteria (
    criteriaID INT AUTO_INCREMENT PRIMARY KEY,
    assignmentID INT NOT NULL,
    criterion VARCHAR(255),
    maxMarks INT,
    FOREIGN KEY (assignmentID) REFERENCES submission(submissionID) ON DELETE CASCADE
);

-- Table for storing feedback information between students and assignments
CREATE TABLE IF NOT EXISTS feedback (
    feedbackID INT AUTO_INCREMENT PRIMARY KEY,
    assignmentID INT NOT NULL,
    content TEXT,
    reviewerID INT,
    FOREIGN KEY (assignmentID) REFERENCES submission(submissionID) ON DELETE CASCADE,
    FOREIGN KEY (reviewerID) REFERENCES student(studentID) ON DELETE SET NULL
);

-- Table for storing enrollment information to connect students to courses
CREATE TABLE IF NOT EXISTS enrollment (
    studentID INT,
    courseID INT,
    PRIMARY KEY (studentID, courseID),
    FOREIGN KEY (studentID) REFERENCES student(studentID) ON DELETE CASCADE,
    FOREIGN KEY (courseID) REFERENCES course(courseID) ON DELETE CASCADE
);

-- Table for storing selected students for a group assignment
CREATE TABLE IF NOT EXISTS selected_students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignmentID INT,
    studentID INT,
    uniqueDeadline DATETIME,
    FOREIGN KEY (assignmentID) REFERENCES submission(submissionID) ON DELETE CASCADE,
    FOREIGN KEY (studentID) REFERENCES student(studentID) ON DELETE SET NULL
);

-- Insert a sample user (student) into the user table
INSERT INTO user (firstName, lastName, email, pwd, userRole)
VALUES ('John', 'Doe', 'john.doe@example.com', 'password123', 'student');

-- Get the userID of the newly inserted student
SET @userID = LAST_INSERT_ID();

-- Insert the student into the student table
INSERT INTO student (studentID, userID, phoneNumber, homeAddress, dateOfBirth)
VALUES (123456, @userID, '1234567890', '123 Main St', '2000-01-01');

-- Insert a sample user (instructor) into the user table
INSERT INTO user (firstName, lastName, email, pwd, userRole)
VALUES ('Admin', 'Instructor', 'admin@gmail.com', 'password', 'instructor');

-- Get the userID of the newly inserted instructor
SET @userID = LAST_INSERT_ID();

-- Insert the instructor into the instructor table with isAdmin set to true
INSERT INTO instructor (instructorID, userID, isAdmin, departments)
VALUES (987654, @userID, true, 'Computer Science');

-- Insert a sample user (instructor) into the user table
INSERT INTO user (firstName, lastName, email, pwd, userRole)
VALUES ('Instructor', 'Sample', 'instructor@gmail.com', 'password', 'instructor');

-- Get the userID of the newly inserted instructor
SET @userID = LAST_INSERT_ID();

-- Insert the instructor into the instructor table with isAdmin set to false
INSERT INTO instructor (instructorID, userID, isAdmin, departments)
VALUES (876543, @userID, false, 'Computer Science');

-- Insert a sample course
INSERT INTO course (courseName, isArchived, instructorID)
VALUES ('COSC 499', false, 876543);

-- Get the courseID of the newly inserted course
SET @courseID = LAST_INSERT_ID();

-- Insert a sample assignment
INSERT INTO assignment (title, descr, rubric, deadline, groupAssignment, courseID, allowedFileTypes)
VALUES ('Final Project', 'Design a database schema', 'Design, Implementation, Report', '2024-12-01 23:59:59', false, @courseID, 'pdf,docx');

-- Get the assignmentID of the newly inserted assignment
SET @assignmentID = LAST_INSERT_ID();

-- Insert the student into the enrollment table
INSERT INTO enrollment (studentID, courseID)
VALUES (123456, @courseID);

-- Insert a sample submission
INSERT INTO submission (assignmentID, studentID, fileName, fileContent, fileType, submissionDate)
VALUES (@assignmentID, 123456, 'final_project.pdf', NULL, 'pdf', NOW());

-- Insert a sample feedback
INSERT INTO feedback (assignmentID, content, reviewerID)
VALUES (@assignmentID, 'Great job on the project!', 123456);

-- Insert a sample review criteria
INSERT INTO review_criteria (assignmentID, criterion, maxMarks)
VALUES (@assignmentID, 'Design', 20);

-- Insert a sample selected student for a group assignment
INSERT INTO selected_students (assignmentID, studentID, uniqueDeadline)
VALUES (@assignmentID, 123456, '2024-12-05 23:59:59');
