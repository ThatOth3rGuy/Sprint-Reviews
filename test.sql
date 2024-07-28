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

-- Table for storing course specific groups --
CREATE TABLE IF NOT EXISTS course_groups (
    groupID INT,
    studentID INT,
    courseID INT,
    PRIMARY KEY (groupID, studentID, courseID),
    FOREIGN KEY (studentID) REFERENCES student(studentID),
    FOREIGN KEY (courseID) REFERENCES course(courseID)
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

-- Insert 10 more students into the user table
INSERT INTO user (firstName, lastName, email, pwd, userRole) VALUES 
('Jack', 'Black', 'jack.black@example.com', 'password123', 'student'),
('Karen', 'Miller', 'karen.miller@example.com', 'password123', 'student'),
('Larry', 'Moore', 'larry.moore@example.com', 'password123', 'student'),
('Nancy', 'Green', 'nancy.green@example.com', 'password123', 'student'),
('Oscar', 'King', 'oscar.king@example.com', 'password123', 'student'),
('Paul', 'Scott', 'paul.scott@example.com', 'password123', 'student'),
('Rachel', 'Adams', 'rachel.adams@example.com', 'password123', 'student'),
('Steve', 'Johnson', 'steve.johnson@example.com', 'password123', 'student'),
('Tom', 'Carter', 'tom.carter@example.com', 'password123', 'student'),
('Uma', 'Taylor', 'uma.taylor@example.com', 'password123', 'student');

-- Get the userIDs of the newly inserted students
SET @userID11 = LAST_INSERT_ID();
SET @userID12 = @userID11 + 1;
SET @userID13 = @userID11 + 2;
SET @userID14 = @userID11 + 3;
SET @userID15 = @userID11 + 4;
SET @userID16 = @userID11 + 5;
SET @userID17 = @userID11 + 6;
SET @userID18 = @userID11 + 7;
SET @userID19 = @userID11 + 8;
SET @userID20 = @userID11 + 9;

-- Insert the students into the student table
INSERT INTO student (studentID, userID, phoneNumber, homeAddress, dateOfBirth) VALUES
(123467, @userID11, '1234567811', '134 Main St', '2011-01-01'),
(123468, @userID12, '1234567812', '135 Main St', '2012-01-01'),
(123469, @userID13, '1234567813', '136 Main St', '2013-01-01'),
(123470, @userID14, '1234567814', '137 Main St', '2014-01-01'),
(123471, @userID15, '1234567815', '138 Main St', '2015-01-01'),
(123472, @userID16, '1234567816', '139 Main St', '2016-01-01'),
(123473, @userID17, '1234567817', '140 Main St', '2017-01-01'),
(123474, @userID18, '1234567818', '141 Main St', '2018-01-01'),
(123475, @userID19, '1234567819', '142 Main St', '2019-01-01'),
(123476, @userID20, '1234567820', '143 Main St', '2020-01-01');

-- Enroll the 10 additional students into the new course
INSERT INTO enrollment (studentID, courseID) VALUES
(123467, 1),
(123468, 1),
(123469, 1),
(123470, 1),
(123471, 1),
(123472, 1),
(123473, 1),
(123474, 1),
(123475, 1),
(123476, 1);

-- Insert a submission for each of the newly added students for the new assignment
INSERT INTO submission (assignmentID, studentID, fileName, fileContent, fileType, submissionDate) VALUES
(1, 123467, 'project_123467.sql', NULL, 'sql', NOW()),
(1, 123468, 'project_123468.sql', NULL, 'sql', NOW()),
(1, 123469, 'project_123469.sql', NULL, 'sql', NOW()),
(1, 123470, 'project_123470.sql', NULL, 'sql', NOW()),
(1, 123471, 'project_123471.sql', NULL, 'sql', NOW()),
(1, 123472, 'project_123472.sql', NULL, 'sql', NOW()),
(1, 123473, 'project_123473.sql', NULL, 'sql', NOW()),
(1, 123474, 'project_123474.sql', NULL, 'sql', NOW()),
(1, 123475, 'project_123475.sql', NULL, 'sql', NOW()),
(1, 123476, 'project_123476.sql', NULL, 'sql', NOW());