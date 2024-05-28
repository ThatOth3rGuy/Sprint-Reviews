# Project Proposal for Project #3

**Team Number:** 3

**Team Members:** Brendan Michaud, Divyajot Kaur, Eric Harrison, Tithi Soni, Yatharth Mathur

## Overview:

### Project purpose or justification (UVP)

#### Project Purpose


The purpose of this software is to create a user-friends platform aimed at simplifying the assignment submission and evaluation processes for students and instructors. More specifically, the software will be catered towards peer evaluation as it will allow instructors to set assignments to be peer-reviewed by a predetermined number of other students, and it will provide easy access for students to both submit and receive feedback from other students.


#### Unique Value Proposition


* User Friendliness


    The platform will provide and intuitive interface for instructors, allowing easy access to create assignments and manage students progress.
   
    It will provide a simple assignment submission process for students, making it effortless for them to submit their work and receive prompt feedback and progress reports.


* Integrated Peer Review Process


    The software will allow for an easy, user-friendly, method of integrating peer review into the assignments.


* Scalability


    Since the software will be developed with the React framework, it allows for


#### Why Our Solution is Better


Our product stands out due to its user-centred design. Unlike existing solutions, our product is catered around peer reviews, allowing for a fair and simple integration of the peer review process for both instructors and students. Overall, this ensures a seamless, efficient, and collaborative educational experience for all users.


### High-level project description and boundaries 
Minimum Viable Product (MVP):

* A platform for instructors to select their institution and create and manage classes and assignments.
* Incorporation of a robust peer review process where students can anonymously review each other's work.
* Secure user authentication and account management for students and instructors.
* A personalized dashboard for instructors to monitor student progress and feedback.
* A personalized dashbard for students to view submitted assignments, peer reviews, feedback recieved, progress.
* An efficient submission system for students to allow them to upload their assigments easily.

Boundaries:

* All peer reviews will be anonymous to ensure fairness.
* The system will support assignment submissions in terms of selected file formats like .TXT and .DOC
* The initial deployment of the system will support a limited number of classes and students considering the short development period.
* The platform will be optimized for desktop and mobile use.


### Measurable project objectives and related success criteria (scope of project) - Brendan

The goal of this project is to create an easy-to-use, online platform for students and instructors to effectively evaluate assignment submissions through peer review. Students will be able to submit assignments and receive anonymous feedback from a designated number of other students. Evaluations will support both feedback for individual and group assignments, determined by the instructor. The application will allow instructors to easily create and manage classes, add and determine evaluation criteria for assignments, and monitor student progress. This process will promote collaboration, accountability, student development, and simple evaluation by anonymous peer review. 

Users will be able to easily create new accounts, or log-in to existing accounts by providing authentication. Instructors and administrators will be able to create classes and assign **<\[a set number of]\>** students using \*\**[file upload, etc.]\***. Student accounts will be linked only to classes assigned by instructors, and able to review selected peer assignments. The application will support compatibility with mobile or desktop devices, allow all users to efficiently upload files from a set number of file types, and provide simple site navigation using a minimalistic interface.

The application will be built using React as well as a(n) **<\[adjective]\>** database to provide flexibility to users and enable future scalability to the system. This project is intended to support a few classes with *\\**number of students**\\, given the limited development period of 3 months. With rigorous testing and iterative development, the application will be deployed with the required functionality in August, 2024.


## Users, Usage Scenarios and High Level Requirements 

### Users Groups: 

1. **Instructors**: Instructors are our primary users who will be responsible for creating classroom groups, assignments for peer review, and groups of students within the classroom group (as an optional feature). Their goal is to have a user-friendly platform that allows an easily managed grading system that is obtrained through an anonymous peer review system.
&nbsp;

2. **Students**: Students are also our primary users, as the system is created for them to submit assignments and receive assignments to be reviewed anonymously. This also includes providing feedback and following a rubric provided by their respective instructors to evaluate their peers. Their goal is to have an efficient system that allows easy submission of assignments, receives timely feedback, and gains insights, while aiding the instructors in the process by reviewing other peers works.  
&nbsp;

3. **Administrators**: Administrators are users who have a purely  technical support system that enables them to manage and maintain the software. Their goal is to ensure smooth operation of the platform and provide any technical support needed for any user.



### Envisioned Usage 

1. **Instructor**:- 
Here is a list of user scenarios for instructors as primary users:
    - **Scenario 1**: The instructor wants to create a new classroom group.
        - The instructor logs into their  instructor level account  and navigates to "Create Classroom.".
        - They fill in their name, classroom description, and classroom number.
        - They then add a list of students in their classroom who receive emails for invitations to the classroom.
        - The platform enables students to be part of the instructor's classroom.        
    - **Scenario 2**: Instructor wants to monitor student progress and conduct peer review.
        - The instructor can view the grades and evaluation dashboard for each student in their respective classrooms
        - The instructor can upload the students files and provide the rubric of evaluation with the file, the system shall randomly assign the assignment to be reviewed by the students.
    - **Journey Line** :-  Here is a potential journey line for instructors:
        1. The instructor logs into their instructor account.
        1. They navigate to Create Classroom (if a new classroom is to be created) or go to the Classroom Group (which is identified with a classroom number and name).
        1. Additionally, the instructor can go to "Create Classroom Teams," which creates a group of students within their respective classrooms.
        1. The instructor uploads the assignments and clicks distribute.
        1. They are led to the option of choosing the number of students to include in the evaluation, sending the assignment at random to every student (ensuring no student receives their own assignment), or sending it to separate teams of students, if created, who are in the classroom. 
&nbsp;
2. **Student** :- 
Here is a list of user scenarios for our students as primary users:
    - **Scenario 1**: The students wants to submit an assignment to their respective classrooms and perform peer review evaluations
        - The student logs into their student  account to view their pending assignments and peer reviews to do.
        - They upload their assignments as per rubrics provided
        - They open their review assignment, which provides the classroom in which the assignment review needs to be conducted based on another set of rubrics
        
    - **Journey Line** :- Here is a potential journey line for students: 
        - The student logs into their student account.
        - They will submit assignments by uploading their assignments into the respective submissions boxes made on the "Assignments and Submission" page
        - They will then also have to open the "Peer Evaluation" section to follow the peer reviews assigned to them and follow the rubric provided by instructor.
        - Additionally they can review their grades and performances on the "Grades Dashboard", which give them grades and feedback of each assignment
&nbsp;
3. **Administrators**:-
Here is a list of user scenarios for our Administrators as primary users:
    - **Scenario and Journey Line**: Maintain the system and ensure smooth flow of software usage.
        - They are to log in through the admin portal, separate from the other log in formats.
        - They have access to daily analytics of the application, users online and offline and admin related issues raised as tickets. 
        - They will be given issues as tickets from the instructor or student 
        - They have complete control of being given access to use the application as a student and instructor.

### Requirements: - Tithi

**Functional Requirements:**

1. User Management
    1. Registration and login system for students, instructors, and administrators.
    2. User roles and permissions based on the type of user.
    3. Profile management- users can see and update personal information.
2. Class and Assignment Management
    1. Instructors can create, update, and delete classes
    2. Instructors can set parameters for assignments
        1. Deadlines, group members, rubrics
3. Assignment Submission and Review
    1. Students can submit assignments and receive instant feedback
        1. Similar to feedback process of Turnitin
    2. Students can review peer assignments that are assigned to them by the instructor
    3. Student information is not available assignments that will be reviewed by peers
4. Evaluation and Feedback
    1. Instructors can review and provide feedback for assignments
    2. Students can review and provide feedback on their peers’ assignments
    3. Students can view feedback and grades on their own assignments
5. Performance Tracking
    1. Instructors can track individual student performance and overall class performance
6. Security
    1. Secure authentication and authorization mechanisms
    2. Data encryption to protect personal information of users
7. System Management
    1. Administrators can manage the overall system, including user management and system settings
8. User Interface
    1. Interface is user friendly and easy to navigate for all user types
    2. Responsive design that will support desktop and mobile devices

**Non-functional Requirements:**

1. Performance
    1. The system should handle concurrent peer reviews efficiently, allowing multiple users to submit and review papers simultaneously.
    2. Response time for loading forms and documents should be less than 2 seconds to maintain a seamless user experience.
2. Security
    1. User authentication and authorization mechanisms must be robust to prevent unauthorized access to sensitive data.
    2. All communication between users and the system should be encrypted using industry-standard protocols (HTTPS)
    3. The application should have role-based access control to manage permissions for authors, reviewers, and administrators
3. Reliability
    1. The system should have a high uptime, with a target availability of 99.9%.
    2. Regular backups of review data should be performed to prevent data loss.
4. Usability
    1. The user interface should be intuitive and user-friendly, allowing reviewers to easily navigate through the application.
    2. Clear error messages and helpful tooltips should guide users during form submissions.
    3. Accessibility standards (e.g., WCAG) should be followed to accommodate users with disabilities.
5. Scalability
    1. The application should handle an increasing number of users and reviews without performance degradation.
6. Maintainability
    1. Code should follow best practices and be well-documented.
    2. Regular code reviews and refactoring should be part of the development process.
7. Compatibility
    1. The application should work seamlessly across different browsers and devices

**User Requirements:**

1. Students
    1. Submit assignments
    2. Review and provide feedback on assignments from their peers as directed by instructor
    3. View feedback on their own assignments
    4. Provide feedback on peer’s contributions in group assignments anonymously
2. Instructors
    1. Create, manage, and delete classes and related assignments and data.
    2. Set parameters for assignments: deadlines, groups for peer reviews, and assignment details/rubrics
    3. Oversee assignments, create evaluations, and monitor student progress
    4. Have a comprehensive view of student progress and performance
3. Administrator
    1. Manage overall systems: user management and system settings
4. All users
    1. Register and login to the system
    2. View and update personal information
    3. Access the system on any device

**Technical Requirements:**

1. Software Requirements
    1. The application should be developed using React
    2. The system should support a database that is efficient at handling storage and data retrieval
2. System Design
    1. System architecture should be designed to support multiple user roles and their respective functionalities
    2. UI/UX should be intuitive and user-friendly, a seamless experience for all users
3. Programming Code
    1. The backend code should be robust, secure, and efficient
    2. Codde should follow best practices for readability, maintainability, and scalability
4. Testing
    1. Application should undergo rigorous testing, including unit testing, integration testing, system testing, and acceptance testing
    2. Peer review of code should be conducted to identify defects, improvements, and ensure flow of the code.
5. Deployment and Maintenance
    1. Application should be deployable on various platforms and environments
    2. Regular updates and maintenance should be planned to ensure the application remains up to date and secure
6. Integration
    1. The application should support integration with other systems as required by the client
7. Data Management
    1. The system should support efficient data management practices, including regular backups, data validation, and data security measures
8. Documentation
    1. Comprehensive documentation should be maintained for the system design, code, suer manual, and other technical aspects of the application.
  
## Tech Stack

Identify the “tech stack” you are using. This includes the technology the user is using to interact with your software (e.g., a web browser, an iPhone, any smartphone, etc.), the technology required to build the interface of your software, the technology required to handle the logic of your software (which may be part of the same framework as the technology for the interface), the technology required to handle any data storage, and the programming language(s) involved. You may also need to use an established API, in which case, say what that is. (Please don’t attempt to build your API in this course as you will need years of development experience to do it right.) You can explain your choices in a paragraph, in a list of bullet points, or a table. Just make sure you identify the full tech stack.
For each choice you make, provide a short justification based on the current trends in the industry. For example, don’t choose an outdated technology because you learned it in a course. Also, don’t choose a technology because one of the team members knows it well. You need to make choices that are good for the project and that meet the client’s needs, otherwise, you will be asked to change those choices.  Consider risk analysis.

## High-level risks

Description and analysis of identified risks associated with the project : 

* Scalability Issues : The system may not be able to scale to handle a larger number of users
* Security and Privacy : There could be data breaches and potential unauthorized access of personal information of users.
* Technical Debt : Continuous and rapid development given the short time period could result in a code difficult to maintain.
* Deadline Compliance : Short development period may not be enough to deliver all features
* UX Design issues : The design of the platform developed may fail to be user-friendly impairing user experience.
* Regulatory Compliance : The platform may fail to comply with educational regulations and data protection laws.
* Performance Issues : The platform may experience downtime and slow response time with heavy traffic.
* Communication and collaboration challenges: There could be a possible miscommunication and absence of strong collaboration  between team members.

| Risk ID | Risk Description                       | Impact | Probability |
|---------|----------------------------------------|--------|-------------|
| 1       | Scalability issues                     | High   | Medium      |
| 2       | Security and Privacy                   | High   | Medium      |
| 3       | Technical Debt                         | High   | Medium      |
| 4       | Missing deadlines (Deadline compliance)| High   | Medium      |
| 5       | Low user adoption                      | Medium | High        |
| 6       | Poor user experience (UX)              | Medium | Medium      |
| 7       | Regulatory compliance issues           | High   | Low         |
| 8       | Performance issues during peak usage   | High   | Medium      |
| 9       | Communication and collaboration issues | Medium | Medium      |


  

## Assumptions and constraints

What assumptions is the project team making and what are the constraints for the project?

## Summary milestone schedule

Identify the major milestones in your solution and align them to the course timeline. In particular, what will you have ready to present and/or submit for the following deadlines? List the anticipated features you will have for each milestone, and we will help you scope things out in advance and along the way. Use the table below and just fill in the appropriate text to describe what you expect to submit for each deliverable. Use the placeholder text in there to guide you on the expected length of the deliverable descriptions. You may also use bullet points to clearly identify the features associated with each milestone (which means your table will be lengthier, but that’s okay).  The dates are correct for the milestones.  

|  Milestone  | Deliverable |
| :-------------: | ------------- |
|  May 29th  | Project Plan Submission |
| May 29th  | A short video presenation decribing the user groups and requirements for the project.  This will be reviewed by your client and the team will receive feedback. |
| June 5th  | Design Submission: Same type of description here. Aim to have a design of the project and the system architecture planned out. Use cases need to be fully developed.  The general user interface design needs to be implemented by this point (mock-ups). This includes having a consistent layout, color scheme, text fonts, etc., and showing how the user will interact with the system should be demonstrated. It is crucial to show the tests pass for your system here. |
| June 5th  |  A short video presenation decribing the design for the project.  This will be reviewed by your client and the team will receive feedback. |
| June 14th  | Mini-Presentations: A short description of the parts of the envisioned usage you plan to deliver for this milestone. Should not require additional explanation beyond what was already in your envisioned usage. This description should only be a few lines of text long. Aim to have 3 features working for this milestone (e.g., user log-in with credentials and permissions counts as 1 feature). Remember that features also need to be tested.  |
| July 5th  | MVP Mini-Presentations: A short description of the parts of the envisioned usage you plan to deliver for this milestone. Should not require additional explanation beyond what was already in your envisioned usage. This description should only be a few lines of text long. Aim to have close to 50% of the features working for this milestone.  Remember that features also need to be tested. Clients will be invited to presentations.|
| July 19th  | Peer testing and feedback: Aim to have an additional two features implemented and tested **per** team member. As the software gets bigger, you will need to be more careful about planning your time for code reviews, integration, and regression testing. |
| August 2nd  | Test-O-Rama: Full scale system and user testing with everyone |
| August 9th  |  Final project submission and group presentions: Details to follow |

## Teamwork Planning and Anticipated Hurdles
Based on the teamwork icebreaker survey, talk about the different types of work involved in a software development project. Start thinking about what you are good at as a way to get to know your teammates better. At the same time, know your limits so you can identify which areas you need to learn more about. These will be different for everyone. But in the end, you all have strengths and you all have areas where you can improve. Think about what those are, and think about how you can contribute to the team project. Nobody is expected to know everything, and you will be expected to learn (just some things, not everything).
Use the table below to help line up everyone’s strengths and areas of improvement together. The table should give the reader some context and explanation about the values in your table.

For **experience** provide a description of a previous project that would be similar to the technical difficulty of this project’s proposal.  None, if nothing
For **good At**, list of skills relevant to the project that you think you are good at and can contribute to the project.  These could be soft skills, such as communication, planning, project management, and presentation.  Consider different aspects: design, coding, testing, and documentation. It is not just about the code.  You can be good at multiple things. List them all! It doesn’t mean you have to do it all.  Don’t ever leave this blank! Everyone is good at something!

|  Category  | Brendan Michaud | Divyajot Kaur | Eric Harrison | Tithi Soni | Yatharth Mathur |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|  **Experience**  | COSC 310 - Security Survailence System | COSC 310 - IClicker Clone | COSC 310 - Weather Dashboard | COSC 310- Canvas Clone, COSC 360- Discussion Forum | Internship - English Language Grading Tool with APIs |
|  **Good At**  | Project Management, Java/JS/PHP/Node/Python/SQL (MySQL primarily),De-bugging | Project Management, Java/PHP/JS/Python/MySQl, Front-end Development, Design  | Backend Development, SQL/Python/Java/Javascript/CSS/HTML, Time Management | Design- Figma, Planning, Coding(Java, Python, PHP, Javascript, HTML/CSS) | Backend with Node, SQL, PHP and Python; Front End with JavaScript,Flask,Android studios and Design with Figma |
|  **Expect to learn**  | 1  | React, Copilot, Node | React, Node, Copilot | 4 | REACT and advanced Node |

Use this opportunity to discuss with your team who **may** do what in the project. Make use of everyone’s skill set and discuss each person’s role and responsibilities by considering how everyone will contribute.  Remember to identify project work (some examples are listed below at the top of the table) and course deliverables (the bottom half of the table). You might want to change the rows depending on what suits your project and team.  Understand that no one person will own a single task.  Recall that this is just an incomplete example.  Please explain how things are assigned in the caption below the table, or put the explanation into a separate paragraph so the reader understands why things are done this way and how to interpret your table.

|  Category of Work/Features  | Brendan Michaud | Divyajot Kaur | Eric Harrison | Tithi Soni | Yatharth Mathur || 
| ------------- | :-------------: | :-------------: | :-------------: | :-------------: | :-------------: | :-------------: |
|  **Project Management: Kanban Board Maintenance**  | :heavy_check_mark:  | :heavy_check_mark: |  |  |  |  | 
|  **System Architecture Design**  |  | :heavy_check_mark:  | :heavy_check_mark:  | :heavy_check_mark:  |  |  | 
|  **User Interface Design**  | :heavy_check_mark:  | :heavy_check_mark: |  |  |  |  | 
|  **CSS Development**  | :heavy_check_mark:  |  |  |  |  |  | 
|  **Feature 1**  |  |  |  |  |  |  | 
|  **Feature 2**  |  |  |  |  |  |  | 
|  **...**  |  |  |  |  |  |  | 
|  **Database setup**  | :heavy_check_mark: |  |  |  | :heavy_check_mark: |  | 
|  **Presentation Preparation**  | :heavy_check_mark:  |  |  | :heavy_check_mark:  |  |  | 
|  **Design Video Creation**  |  | :heavy_check_mark:  | :heavy_check_mark:  |  |  |  | 
|  **Design Video Editing**  | :heavy_check_mark:  | :heavy_check_mark:  |  |  |  |  | 
|  **Design Report**  | :heavy_check_mark:  |  |  |  |  |  | 
|  **Final Video Creation**  | :heavy_check_mark:  |  |  |  |  |  | 
|  **Final Video Editing**  | :heavy_check_mark:  |  |  |  |  |  | 
|  **Final Team Report**  |  | :heavy_check_mark:  |  |  |  |  | 
|  **Final Individual Report**  |  :heavy_check_mark: |  :heavy_check_mark: |  :heavy_check_mark: |  :heavy_check_mark: |  :heavy_check_mark: |  | 
