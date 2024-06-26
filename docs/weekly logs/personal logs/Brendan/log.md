
# Weekly Logs
------------------------------------
# Week 7
## Wednesday - June 26, 2024
**Timesheet Tracking (Friday-Tuesday)**
* ![Clockify Timesheet](./Timesheets/Clockify_Time_Report_Detailed_06_21_2024-06_25_2024.pdf)
### Cycle Review
    Over this last cycle, we managed to mostly complete our major features in assignments and class creation. Due to a slower paced week last week and busy schedules, we are slightly behind pace we originally planned. However, having completed two larger features, aside from some changes that need to be made once integrated, we will likely be able to reuse a decent amount of functions implemented. This will help speed up the development through the week and hopefully bring us back on pace. 

    I managed to get the testing framework to run properly, allowing us to test the integration of features moving forward. We will have to start building tests for the features completed and ensure they are running as expected, however there are still existing issues in the testing framework through docker. I seem to be the only one able to run the playwright tests without error, and the rest of the team keeps encountering some. This will need to be investigated and resolved quickly, in the meantime I will likely be the one running such tests. After our early week meeting, we decided what needs to be done this week to make sure we have what is needed for the MVP, and I am continuing to create and assign sub-tasks for the features. Our goal for the remainder of the week is to complete the integration testing and modify the pushed features according to present issues (student list upload db queries and state management added to assignment pages), as well as complete the next assigned feature: The peer review form. With any luck we will be able to complete all this as well as have an admin dashboard up before the weekend. Having all this complete will keep us on pace, and have enough of our application ready to demo for the MVP next Friday. Honestly everyone has put in so much time and effort into this and I have no concerns about us not being ready.

### Current Tasks
  * #1: Manage and assign tasks for each cycle (Plaky/Kanban board)
  * #2: Complete Student List Uploading (csv) and verification for Course Registration Feature
  * #3: Refine Docker Environment and Testing Framework For Future Development
  * #4: Create Feature Definition and Sub-divisions on Project Board For Team Division
  * #5: Run Integration Tests for pushed features (Resolve any issues found)
  * #6: Complete Manual Student Entry option for Peer Review Assignment Form Feature

### Progress Update: Wed-Fri
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
        <!-- Task/Issue # -->
        <td>Update Project Boards with Task Assignees/Details
        </td>
        <!-- Status -->
        <td>Ongoing
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Feature breakdown/sub-division for parallel task work
        </td>
        <!-- Status -->
        <td>Partly Complete (Recurring)
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Update Docker and Testing Setup for Ongoing Development
        </td>
        <!-- Status -->
        <td>Complete*
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Add Student List Upload via csv for Instructor Course Creation with Verification
        </td>
        <!-- Status -->
        <td>Complete*
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Create and Run Integration Tests on Pushed Features
        </td>
        <!-- Status -->
        <td>To-do
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Complete Manual Student Entry Option for Peer Review Assignment Form
        </td>
        <!-- Status -->
        <td>In-progress
        </td>
    </tr>
</table>

#
# Week 6
## Friday - June 21, 2024
**Timesheet Tracking (Wednesday-Thursday)**
* ![Clockify Timesheet](./Timesheets/Clockify_Time_Report_Detailed_06_19_2024-06_20_2024.pdf)
### Cycle Review
    During this mid-week cycle, I was not able to spend much time on project work as usual. As I only have one day between Wednesday and Friday to work on the project, only a portion of tasks are able to be completed. Wednesday morning we had our usual team meeting to sort things out and assign tasks. The rest of the day is devoted to project work, of which I spent most of the day dealing with workflow and creating tasks on our project board. With our updated workflow we are more clearly able to track progres on feature development, ensuring there is always ones to pick up when another is complete. It also clearly lays out what must be done, how each feature is progressing, and plan out our feature development goals for each cycle. As I work on Thursdays, I only have the evening to continue on project work, as such I have only been able to make a small amount of progress on my feature task, the student list uploads. Over the weekend I plan to have all my tasks fully completed, test framework functioning (so we can do integration testing on the features), and both features the team worked on this week pushed as fully functional features.

    We have half of both features we started working on at the beginning of the week completed, and will hopefully have the other half complete before Saturday. So far we are still on pace, and have no issues that will put us behind. I will continue managing the project boards each cycle, and my goal this cycle is to have both the testing framework functional, and the student course registration feature complete before Monday so that we can start on the next features. I feel that I am a bit behind the rest of the team this week and will make that up this weekend.

### Current Tasks
  * #1: Manage and assign tasks for each cycle (Plaky/Kanban board)
  * #2: Complete Student List Uploading (csv) and verification for Course Registration Feature
  * #3: Refine Docker Environment and Testing Framework For Future Development
  * #4: Create Feature Definition and Sub-divisions on Project Board For Team Division

### Progress Update: Wed-Fri
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
        <!-- Task/Issue # -->
        <td>Update Project Boards with Task Assignees/Details
        </td>
        <!-- Status -->
        <td>Ongoing
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Feature breakdown/sub-division for parallel task work
        </td>
        <!-- Status -->
        <td>Partly Complete (Recurring)
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Update Docker and Testing Setup w/ CI for Ongoing Development
        </td>
        <!-- Status -->
        <td>To-Do
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Add Student List Upload via csv for Instructor Course Creation with Verification
        </td>
        <!-- Status -->
        <td>In-Progress*
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Sleep
        </td>
        <!-- Status -->
        <td>< undefined >
        </td>
    </tr>
</table>

#
## Wednesday - June 19, 2024
**Timesheet Tracking (Friday-Tuesday)**
* ![Clockify Timesheet](./Timesheets/Clockify_Time_Report_Detailed_06_14_2024-06_18_2024.pdf)
### Cycle Review
    After Friday's presentation, we all decided to take part of the weekend to rest and recharge after a long couple weeks. I was especially burnt out, and spent part of the weekend sleeping. We had a short meeting after the class presentations to sort out workflow and the plan moving forward, which we turned into a long meeting Sunday. The beginning of the cycle was not incredibly productive for the project, but allowed us to spend time reorganizing ourselves and put together a solid branching workflow and feature breakdown moving forward to maximize our weekly output until the project is completed. Sunday, the team met for a few hours to thoroughly breakdown each of our intended features, sub-divide those features into smaller chunks we can work on in parallel. As such, I spent the majority of the cycle putting together the timelines, workflow, task breakdown, and starting to assign those tasks among the team, myself included. Our goal for the cycle (Sunday-Wednesday Morning) was to complete the base system dashboard navigation, being all the corresponding pages it links to, and have atleast one (hopefully two) features completed so a demo could be provided Wednesday's meeting. I believe we will have one feature complete for Wednesday morning, and have another in progress. We are mostly on track with little roadblocks, I do believe we will be able to complete the majority of our features in time for the MVP Presentation. I was not able to get entirely as much completed this cycle as I would have liked, however I did manage to get a large amount of PM work done. My goal for the next cycle and each one moving forward is to maintain the project boards keeping proper track of our team workflow to hopefully avoid any further slowdowns. Aside from that I plan to have all my current tasks done by Friday, ensuring the next feature is started while this one is finished. If we can get 3-4 features doen each week. Lastly, I hope to have all the testing and docker framework working properly in our project by the end of Friday, so we can properly complete integration testing going forward.

### Current Tasks
  * #1: Manage and assign tasks for each cycle (Plaky/Kanban board)
  * #2: Re-organize future project workflow (github project board/issues)
  * #3: Refine Docker Environment and Testing Framework For Future Development
  * #4: Create Feature Definition and Sub-divisions For Team Division
  * #5: Complete Student List Uploading (csv) and verification for Course Registration Feature
  * #6: **Sleep?**

### Progress Update: Fri-Wed
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Re-organize Github Project Workflow/Branching
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Update Project Boards with Task Assignees/Details
        </td>
        <!-- Status -->
        <td>Ongoing
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Feature breakdown/sub-division for parallel task work
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Update Docker and Testing Setup w/ CI for Ongoing Development
        </td>
        <!-- Status -->
        <td>To-Do
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Add Student List via csv for Instructor Course Creation with Verification
        </td>
        <!-- Status -->
        <td>In-Progress*
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Sleep?
        </td>
        <!-- Status -->
        <td>N/A
        </td>
    </tr>
</table>

*\* currently working on locally. Has not been pushed, with not enough to demo Wednesday*

# Week 5
## Friday - June 14, 2024
**Timesheet Tracking (Wednesday & Thursday)**
* ![Clockify Timesheet](./Timesheets/Clockify_Time_Report_Detailed_06_12_2024-06_14_2024.pdf)
### Cycle Review
    From Wednesday to Friday's Meeting, there was a ton of things to complete for our presentation. We managed to get nearly all of it complete, and I put in significant amount of hours (mostly losing sleep) between Wednesdays meeting and Friday. I spent nearly all my time working on ensuring the dev containers run  and everything is testable. After many many hours some tests finally passed post integration. I believe we are on a good pace, though with much still to do we all know whats expected. I will continue to manage the workflow boards and task breakdowns, but the goal for the next cycle is to hit the ground running with features. We should get tests and everything set. I hope our demo goes well.

### Current Tasks
  * #1: Manage and assign tasks for each cycle (Plaky/Kanban board)
  * #2: Setup Docker Compose for DB, Drone, App, and Tests for integrated Testing
  * #3: Fix Bugs in Test Frameworks (Unit and E2E Testing)
  * #4: Reverse Proxy Setup and Test (Simple Redirects vs Proxy API)
  * #5: Test Database (Get tests to properly pass)
  * #6: Mini-Presentation Setup

### Progress Update: Mon-Wed
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Update Project Boards with Task Assignees/Details
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Setup Docker Compose for App Feature Integration
        </td>
        <!-- Status -->
        <td>Complete*
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Fix Bugs In Test Framework/Automated Testing
        </td>
        <!-- Status -->
        <td>In Progress <\Partially Complete\>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Test Feature Components and DB Function
        </td>
        <!-- Status -->
        <td>Complete*
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Mini-Presentation Setup
        </td>
        <!-- Status -->
        <td>In Progress <\Complete as of 11:30PM Thursday\>
        </td>
    </tr>
</table>

#
## Wednesday - June 12, 2024
**Timesheet Tracking (Friday-Sunday)**
* ![Clockify Timesheet](./Timesheets/Clockify_Time_Report_Detailed_06_10_2024-06_011_2024.pdf)
### Cycle Review
    From Monday to Wednesday's Meeting, I unfortunately was not able to do a ton. Before our Monday meeting, I was able to get the login page up and passing tests, however it is not perfect and will need to be fixed and integrated with our CI. After our meeting my internet went out all day, and had to work Tuesday. I was not able to accomplish all I was tasked with, though the team seems to have picked up my slack. I do believe we are mostly on pace for having all the features by Friday. My goal for the remainder of the week is to make sure the tests work especially the DB, and we will be able to efficiently run our completed features for Friday. I am working on the testing/integrations, and managing the project boards. Wednesday we will breakdown what is left and ensure we are on pace for the project, if any issues are present we will hopefully be able to fix them with little issue.

### Current Tasks
  * #1: Manage and assign tasks for each cycle (Plaky/Kanban board)
  * #2: Setup Docker Compose for DB, Drone, App, and Tests for integrated Testing
  * #3: Fix Bugs in Test Frameworks (Unit and E2E Testing)
  * #4: Reverse Proxy Setup and Test (Simple Redirects vs Proxy API)
  * #5: Test Database (Get tests to properly pass)
  * #6: Add DB to app for Login Function

### Progress Update: Mon-Wed
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Update Project Boards with Task Assignees/Details
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Setup Docker Files for Project Components
        </td>
        <!-- Status -->
        <td>Complete*
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Fix Bugs In Test Framework/Automated Testing
        </td>
        <!-- Status -->
        <td>In Progress
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Proxy Setup and Test
        </td>
        <!-- Status -->
        <td>Complete*
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Setup Database Function in App & Test
        </td>
        <!-- Status -->
        <td>In Progress
        </td>
    </tr>
</table>

#
## Monday - June 10, 2024
**Timesheet Tracking (Friday-Sunday)**
* ![Clockify Timesheet](./Timesheets/Clockify_Time_Report_Detailed_06_07_2024-06_09_2024.pdf)
### Cycle Review
    Several tasks were assigned to each of the team during Friday's meeting. As we have completed the design, we used our Friday meeting to break down our tasks for the weekend, and decide which features we will need ready for June 14th. We decided on our features and I helped layout our plan for the week, assigning everyone including myself tasks. Over the weekend I spent a lot of hours configuring the docker file to ensure we have working containers for development. Once the containers were **mostly** running properly, the test framework needed to be added so we can start creating  tests for the features. With some success I was able to get testing up. For the weekend cycle I did manage to nearly accomplish everything I needed to while the others were putting together the DB and our CI. My goal for this week is to fix the test framework, and our docker to hopefully build and run containers smoothly while running the E2E tests error free for everyone. I will also help with the DB and testing so that we can have our features ready and tests passing by Wednesday-Friday. We will decide exactly how this will be split during our meeting

### Current Tasks
  * #1: Manage and assign tasks for each cycle (Plaky/Kanban board)
  * #2: Finalize Docker Setup From Friday
  * #3: Create Automated Test Framework for Project
  * #4: Reverse Proxy Setup and Test
  * #5: Test Database
  * #6: Add Basic Landing Page for App

### Progress Update: Fri-Mon
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Update Project Boards with Task Assignees/Details
        </td>
        <!-- Status -->
        <td>Ongoing
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Finalize Docker Setup From Friday
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Create Automated Test Framework for Project
        </td>
        <!-- Status -->
        <td>In Progress
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Reverse Proxy Setup and Test
        </td>
        <!-- Status -->
        <td>In Progress
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Add Basic Landing Page for App
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Test Database
        </td>
        <!-- Status -->
        <td>To Do
        </td>
    </tr>
</table>

#
# Week 4
## Friday - June 7, 2024

### Cycle Review
    Wednesday to Friday there was not a ton of progress done on my behalf, most of my time was spent tracking project workflow via Plaky and the Project Board. Thursday I was only able to spend the afternoon on the project due to work, however as reflected by clockify hours the entire evening was spent trying to get docker running with our framework. I was unfortunately not successful and my primary goal for the next cycle is to make sure that is up so the team can begin coding ASAP. All work for our project design has been done, and the video is in progress. With the next 4 days free to work on the project my goal is to start coding features so there is stuff to review on Monday.

### Current Tasks
  * #1: Setup Docker
  * #2: Manage Project Workflow Boards
  * #3: Review Video before submission
  * #4: Help review and track pull requests

### Progress Update: Wed-Fri
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Setup Docker
        </td>
        <!-- Status -->
        <td>In-Progress (crying)
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Manage Project Boards
        </td>
        <!-- Status -->
        <td>Ongoing
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Review Other Project Proposals
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Complete Architecture Design for Doc and Video
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Review Current Pull-Requests & Video
        </td>
        <!-- Status -->
        <td>To Do
        </td>
    </tr>
</table>

#
## Wednesday - June 5, 2024
**Timesheet Tracking is presented in our weekly log**
### Cycle Review
    From Monday to Wednesday's Meeting, not much to complete for tasks. After completing Architecture Design and explanation of the design, it will need to be reviewed and then make necessary changes. If changes are needed, that will be high priority to complete for document submission Wednesday night. With all design document tasks nearly complete by everyone assigned to them, all we have left is mainly the UI design. This will likely be finalized during our meeting by Tithi. Evaluations will need to be completed, with only 1 remaining to complete after watching the other 2 videos for project #3. This is a task that I will need to complete after our meeting. My other goal for this cycle is to get the docker running, which will be after getting the framework running with Eric. This will be one of my main tasks to have for Friday. As always, if any new tasks come up in meeting I will distribute them and update the boards accordingly.

### Current Tasks
  * #1: Manage and assign tasks for each cycle (Plaky/Kanban board)
  * #2: Get feedback on Software Architecture Design and Explanation
  * #3: Evaluate other project proposals (1 remaining)
  * #4: Setup and Run Docker Containers

### Progress Update: Mon-Wed
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Update Project Boards with Task Assignees/Details
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>System Architecture Design and Explanation for Document
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Evaluate Other Project Proposals
        </td>
        <!-- Status -->
        <td>In Progress
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Setup/Run Docker Containers
        </td>
        <!-- Status -->
        <td>In Progress
        </td>
    </tr>
</table>

#
## Monday - June 3, 2024
**Timesheet Tracking is presented in our weekly log**
### Cycle Review
    Several tasks were assigned to each of the team during Friday's meeting. By the time of the meeting, each of us accomplished a significant amount of work either completing or nearly completing what was assigned. Though review on all of the work is required, it seems we managed to reach all of our goals for the weekend cycle. Managing the project boards and working on the system architecture design, tasks are being completed on time and everyone is contributing effectively. With the architecture design done and ready for review, the goal for this next cycle is to start on setting up docker and configure our tests, as well as modify the design after Wednesday's feedback. Project oversight is still an ongoing task, currently without issue.

### Current Tasks
  * #1: Manage and assign tasks for each cycle (Plaky/Kanban board)
  * #2: Software Architecture Design and Explanation
  * #3: Evaluate other project proposals
  * #4: Setup and Run Docker Containers

### Progress Update: Fri-Mon
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Update Project Boards with Task Assignees/Details
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Complete System Architecture Design
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Complete System Architecture Design Explanation for Document
        </td>
        <!-- Status -->
        <td>In Progress
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Evaluate Other Project Proposals
        </td>
        <!-- Status -->
        <td>In Progress
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Setup/Run Docker Containers
        </td>
        <!-- Status -->
        <td>To Do
        </td>
    </tr>
</table>

## Week 3 : Project Proposal & System Design
**This week is the finalizing of the proposal doc and video presentation for review. For the end of the week, we start work on the system design and testing. Possible meeting with client and make a decision on architecture. Hopefully we have a CI and Docker set up by weeks end.**

### Team Meeting Action Items:
* Review Project Proposal Doc and make any needed additions/removals based on team feedback
* Decided Project Cycle period (cycle proposed by myself)
    * Weekend Cycle: Sat-Mon (Monday Team Meeting)
    * Weekday Cycle: Tues-Fri (Day between meetings to effectively work on tasks)
* Create Proposal Video
    * Each record section tasked with
    * Decide who is editting and creating the video
    * Review before Wednesday submission
* Complete Tech Stack/Assumptions and Contrainsts in proposal
* Begin Design document & decide on architecture
    * Distribute Task breakdown:
        * System Architecture (me)
        * UI
        * Database
        * DFD
        * Use Cases
* Begin setting up CI and Docker, plus possible automation

### My Tasks & Contributions
* Record Scope and Objectives for presentation
* Complete Assumptions and constraints for Proposal doc
* Setting up Docker/Drone (in-progress)
* Start on System Architecture Design
    * Research most suitable architecture design for chosen tech stack
    * Get feedback for a final decision on Friday
* Create Team Planner for high level management (provided in Dashboard)
* Research the best APIs we may want to use
* Look into Log/Test Automation

\* **Times for both team meetings and individual contributions are documented in our timekeeping tool and found in the dashboard/Team Log.** \*
#
## Week 2 : Project Assigning & Initial Planning
**This week is our first team planning session now that we have chosen a project. We had our first team meeting to discuss roles and plan the proposal.**

### Team Meeting Action Items:
* Chosen Team Name: *Sprint Runners*
* I am assigned Co-PM along with Divya
* Overview of Proposal Doc
    * Began Task Breakdown
    * Outlined all respective groups, objectives, and requirements
* Discussed team plan for the project
* Start setting up environments and research

### My Tasks & Contributions
* Outlined Project Objectives, Scope and Success Criteria
* Create Kanban Project Board
* Put together project workflow management tools
* Think about tech stack

\* **Times for both team meetings and individual contributions are documented in our timekeeping tool and found in the dashboard/Team Log.** \*
#
## Week 1 : Introductions
* Meet and greet 
* Team formations
* Course expectations and intro