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
    FOREIGN KEY (assignmentID) REFERENCES assignment(assignmentID) ON DELETE CASCADE
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

-- Table for storing peer review assignments
CREATE TABLE IF NOT EXISTS review (
    reviewID INT AUTO_INCREMENT PRIMARY KEY,
    assignmentID INT NOT NULL,
    isGroupAssignment BOOLEAN,
    allowedFileTypes VARCHAR(255),
    deadline DATETIME,
    FOREIGN KEY (assignmentID) REFERENCES assignment(assignmentID) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS review_groups  (
    studentID INT,
    assignmentID INT,
    courseID INT,
    submissionID INT,
    isReleased BOOLEAN DEFAULT false,
    PRIMARY KEY (studentID, submissionID),
    FOREIGN KEY (studentID) REFERENCES student(studentID),
    FOREIGN KEY (assignmentID) REFERENCES assignment(assignmentID),
    FOREIGN KEY (courseID) REFERENCES course(courseID),
    FOREIGN KEY (submissionID) REFERENCES submission(submissionID)
);

-- Insert users
INSERT INTO user (firstName, lastName, email, pwd, userRole) VALUES
('John', 'Doe', 'john.doe@example.com', 'password123', 'student'),
('Jane', 'Smith', 'jane.smith@example.com', 'password123', 'student'),
('Admin', 'User', 'admin@example.com', 'password123', 'instructor'),
('Scott', 'Fazackerley', 'scott.faz@example.com', 'password123', 'instructor');

-- Insert students
INSERT INTO student (studentID, userID, phoneNumber, homeAddress, dateOfBirth) VALUES
(1001, 1, '555-1234', '123 Elm Street', '2000-01-01'),
(1002, 2, '555-5678', '456 Oak Street', '2001-02-02');

-- Insert instructors
INSERT INTO instructor (instructorID, userID, isAdmin, departments) VALUES
(1000, 3, TRUE, 'Computer Science, Mathematics'),
(1001, 4, FALSE, 'Physics');

-- Insert courses
INSERT INTO course (courseName, isArchived, instructorID) VALUES
('COSC 499', FALSE, 1000),
('COSC 310', FALSE, 1001),
('COSC 100', TRUE, 1000),
('COSC 101', TRUE, 1001);

-- Insert assignments
INSERT INTO assignment (title, descr, rubric, deadline, groupAssignment, courseID, allowedFileTypes) VALUES
('Assignment 1', 'Description for assignment 1', 'Rubric for assignment 1', '2024-08-01 23:59:59', FALSE, 1, 'pdf,docx'),
('Assignment 2', 'Description for assignment 2', 'Rubric for assignment 2', '2024-09-01 23:59:59', TRUE, 2, 'pdf,docx');

-- Insert submissions
INSERT INTO submission (assignmentID, studentID, fileName, fileContent, fileType, submissionDate, grade) VALUES
(1, 1001, 'assignment1_john.pdf', NULL, 'pdf', '2024-07-01 12:00:00', 85),
(2, 1002, 'assignment2_jane.docx', NULL, 'docx', '2024-07-02 12:00:00', 90);

-- Insert review criteria
INSERT INTO review_criteria (assignmentID, criterion, maxMarks) VALUES
(1, 'Criterion 1', 10),
(1, 'Criterion 2', 20),
(2, 'Criterion 1', 15),
(2, 'Criterion 2', 25);

-- Insert feedback
INSERT INTO feedback (assignmentID, content, reviewerID) VALUES
(1, 'Great work!', 1002),
(2, 'Needs improvement.', 1001);

-- Insert enrollment
INSERT INTO enrollment (studentID, courseID) VALUES
(1001, 1),
(1002, 1),
(1002, 2);

-- Insert selected students for group assignments
INSERT INTO selected_students (assignmentID, studentID, uniqueDeadline) VALUES
(2, 1001, '2024-08-15 23:59:59'),
(2, 1002, '2024-08-16 23:59:59');

-- Insert users for new students
INSERT INTO user (firstName, lastName, email, pwd, userRole) VALUES
('Alice', 'Johnson', 'alice.johnson@example.com', 'password123', 'student'),
('Bob', 'Williams', 'bob.williams@example.com', 'password123', 'student'),
('Charlie', 'Brown', 'charlie.brown@example.com', 'password123', 'student');

-- Insert new students
INSERT INTO student (studentID, userID, phoneNumber, homeAddress, dateOfBirth) VALUES
(1003, 5, '555-9876', '789 Pine Street', '2002-03-03'),
(1004, 6, '555-6543', '321 Birch Street', '2003-04-04'),
(1005, 7, '555-3210', '654 Maple Street', '2004-05-05');