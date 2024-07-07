-- test.sql
CREATE DATABASE IF NOT EXISTS testdb;
USE testdb;

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
    email VARCHAR(100),
    pwd VARCHAR(100),
    userRole VARCHAR(20)
);

-- Table for storing student, connected to the user table
CREATE TABLE IF NOT EXISTS student (
    userID INT PRIMARY KEY,
    studentID INT,
    phoneNumber VARCHAR(15),
    homeAddress VARCHAR(255),
    dateOfBirth DATE,
    FOREIGN KEY (userID) REFERENCES user(userID) ON DELETE CASCADE
);

-- Table for storing instructor information, connected to the user table
CREATE TABLE IF NOT EXISTS instructor (
    userID INT PRIMARY KEY,
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
    FOREIGN KEY (instructorID) REFERENCES instructor(userID) ON DELETE SET NULL
);

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
    FOREIGN KEY (courseID) REFERENCES course(courseID) ON DELETE CASCADE
);

-- Table for storing submission information between students and assignments
CREATE TABLE IF NOT EXISTS submission (
    submissionID INT AUTO_INCREMENT PRIMARY KEY,
    assignmentID INT,
    studentID INT,
    fileName VARCHAR(255),
    fileContent LONGBLOB,
    fileType VARCHAR(100),
    submissionDate DATETIME,
    grade INT,
    FOREIGN KEY (assignmentID) REFERENCES assignment(assignmentID) ON DELETE CASCADE,
    FOREIGN KEY (studentID) REFERENCES student(userID) ON DELETE SET NULL
);

-- Review creation table for instructor
CREATE TABLE IF NOT EXISTS review_criteria (
    criteriaID INT AUTO_INCREMENT PRIMARY KEY,
    assignmentID INT,
    criterion VARCHAR(255),
    maxMarks INT,
    FOREIGN KEY (assignmentID) REFERENCES assignment(assignmentID) ON DELETE CASCADE
);

-- Table for storing feedback information between students and assignments
CREATE TABLE IF NOT EXISTS feedback (
    feedbackID INT AUTO_INCREMENT PRIMARY KEY,
    assignmentID INT,
    content TEXT,
    otherStudentID INT,
    FOREIGN KEY (assignmentID) REFERENCES assignment(assignmentID) ON DELETE CASCADE,
    FOREIGN KEY (otherStudentID) REFERENCES student(userID) ON DELETE SET NULL
);

-- Table for storing enrollment information to connect students to courses
CREATE TABLE IF NOT EXISTS enrollment (
    studentID INT,
    courseID INT,
    PRIMARY KEY (studentID, courseID),
    FOREIGN KEY (studentID) REFERENCES student(userID) ON DELETE CASCADE,
    FOREIGN KEY (courseID) REFERENCES course(courseID) ON DELETE CASCADE
);

-- Table for storing selected students for a group assignment
CREATE TABLE IF NOT EXISTS selected_students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignmentID INT,
    studentID INT,
    uniqueDeadline DATETIME,
    FOREIGN KEY (assignmentID) REFERENCES assignment(assignmentID) ON DELETE CASCADE,
    FOREIGN KEY (studentID) REFERENCES student(userID) ON DELETE SET NULL
);

-- Insert users
INSERT INTO user (firstName, lastName, email, pwd, userRole) VALUES
('John', 'Doe', 'john.doe@example.com', 'password123', 'student'),
('Jane', 'Smith', 'jane.smith@example.com', 'password123', 'student'),
('Admin', 'User', 'admin@example.com', 'password123', 'instructor'),
('Scott', 'Fazackerley', 'scott.faz@example.com', 'password123', 'instructor');

-- Insert students
INSERT INTO student (userID, studentID, phoneNumber, homeAddress, dateOfBirth) VALUES
(1, 1001, '555-1234', '123 Elm Street', '2000-01-01'),
(2, 1002, '555-5678', '456 Oak Street', '2001-02-02');

-- Insert instructors
INSERT INTO instructor (userID, isAdmin, departments) VALUES
(3, TRUE, 'Computer Science, Mathematics'),
(4, FALSE, 'Physics');

-- Insert courses
INSERT INTO course (courseName, isArchived, instructorID) VALUES
('COSC 499', FALSE, 4),
('COSC 310', FALSE, 3),
('COSC 100', TRUE, 4),
('COSC 101', TRUE, 3);

-- Insert assignments
INSERT INTO assignment (title, description, rubric, deadline, groupAssignment, courseID, allowedFileTypes) VALUES
('Assignment 1', 'Description for assignment 1', 'Rubric for assignment 1', '2024-08-01 23:59:59', FALSE, 1, 'pdf,docx'),
('Assignment 2', 'Description for assignment 2', 'Rubric for assignment 2', '2024-09-01 23:59:59', TRUE, 2, 'pdf,docx');

-- Insert submissions
INSERT INTO submission (assignmentID, studentID, fileName, fileContent, fileType, submissionDate, grade) VALUES
(1, 1, 'assignment1_john.pdf', NULL, 'pdf', '2024-07-01 12:00:00', 85),
(2, 2, 'assignment2_jane.docx', NULL, 'docx', '2024-07-02 12:00:00', 90);

-- Insert review criteria
INSERT INTO review_criteria (assignmentID, criterion, maxMarks) VALUES
(1, 'Criterion 1', 10),
(1, 'Criterion 2', 20),
(2, 'Criterion 1', 15),
(2, 'Criterion 2', 25);

-- Insert feedback
INSERT INTO feedback (assignmentID, content, otherStudentID) VALUES
(1, 'Great work!', 2),
(2, 'Needs improvement.', 1);

-- Insert enrollment
INSERT INTO enrollment (studentID, courseID) VALUES
(1, 1),
(2, 1),
(2, 2);

-- Insert selected students for group assignments
INSERT INTO selected_students (assignmentID, studentID, uniqueDeadline) VALUES
(2, 1, '2024-08-15 23:59:59'),
(2, 2, '2024-08-16 23:59:59');
