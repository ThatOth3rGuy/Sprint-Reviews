// randomizationAlgorithm.ts
/* 
* This file contains the function randomizePeerReviewGroups that takes an array of students
* and the number of reviews per assignment as input and returns an array of objects, where 
* each object contains the submission ID and the list of student IDs that are assigned to 
* review that specific submission.
*/
  
  type ReviewGroup = {
    submissionID: number;
    reviewers: number[];
  };

  // This function randomizes the students and assign them to peer review groups
  export const randomizePeerReviewGroups = (students: { studentID: number, submissionID: number }[], reviewsPerAssignment: number) => {
    /*
    - Loops through each student in course and randomly assigns them to X submission for review
    - Each student must have minimum submissions to review as directed by instructor and no more than provided maximum
    - No student can review their own submission or have more than 1 instance of any submission
    - If any students are manually selected for review of a particular submission they are not considered for that iteration
    */
  
    // Return an empty array if there are no students, or if the number of reviews per assignment is invalid
    if (students.length === 0 || reviewsPerAssignment <= 0 || reviewsPerAssignment > students.length) {
      throw new Error('Invalid input');
    }

    // Shuffle function to randomize an array using the Fisher-Yates algorithm
    const shuffleArray = (array: any[]): void => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };
  
    // Initialize the review groups for each submission
    const submissionReviews: { [key: number]: number[] } = {};
    const studentReviewsCount: { [key: number]: number } = {};
  
    // Initialize the structures to track review assignments
    students.forEach(student => {
      if (!submissionReviews[student.submissionID]) {
        submissionReviews[student.submissionID] = [];
      }
      studentReviewsCount[student.studentID] = 0;
    });
  
    // First pass: Ensure every student reviews the minimum number of assignments
    for (let student of students) {
      const studentID = student.studentID;
      const submissionID = student.submissionID;
  
      // Create a list of all possible reviews (excluding own submission)
      const possibleReviews = students
        .filter(s => s.studentID !== studentID && s.submissionID !== submissionID)
        .map(s => s.submissionID);
  
      // Shuffle the possible reviews to ensure randomness
      shuffleArray(possibleReviews);
  
      // Assign reviews from the shuffled list until the student reaches the review limit
      while (studentReviewsCount[studentID] < reviewsPerAssignment && possibleReviews.length > 0) {
        const reviewSubmissionID = possibleReviews.pop()!;
        if (submissionReviews[reviewSubmissionID].length < reviewsPerAssignment) {
          submissionReviews[reviewSubmissionID].push(studentID);
          studentReviewsCount[studentID]++;
        }
      }
    }
  
    // Second pass: Ensure every submission gets exactly minReviewsPerSubmission reviews
    const allSubmissions = students.map(student => student.submissionID);
  
    for (const submissionID of allSubmissions) {
      while (submissionReviews[submissionID].length < reviewsPerAssignment) {
        const potentialReviewers = students.filter(student =>
          student.submissionID !== submissionID &&
          !submissionReviews[submissionID].includes(student.studentID) &&
          studentReviewsCount[student.studentID] < reviewsPerAssignment
        );
  
        if (potentialReviewers.length === 0) {
          const excessReviewers = students.filter(student =>
            student.submissionID !== submissionID &&
            !submissionReviews[submissionID].includes(student.studentID)
          );
  
          shuffleArray(excessReviewers);
          const reviewer = excessReviewers[0];
          submissionReviews[submissionID].push(reviewer.studentID);
          studentReviewsCount[reviewer.studentID]++;
        } else {
          shuffleArray(potentialReviewers);
          const reviewer = potentialReviewers[0];
          submissionReviews[submissionID].push(reviewer.studentID);
          studentReviewsCount[reviewer.studentID]++;
        }
      }
    }
  
    // Final pass: Balance the number of reviews for each student
    const studentsToAdjust = students.filter(student => studentReviewsCount[student.studentID] !== reviewsPerAssignment);
  
    studentsToAdjust.forEach(student => {
      while (studentReviewsCount[student.studentID] > reviewsPerAssignment) {
        // Find a submission where this student is an excess reviewer
        const submissionWithExcessReview = Object.keys(submissionReviews).find(submissionID => 
          submissionReviews[Number(submissionID)].includes(student.studentID)
        );
  
        if (submissionWithExcessReview) {
          // Remove the excess review
          const excessIndex = submissionReviews[Number(submissionWithExcessReview)].indexOf(student.studentID);
          submissionReviews[Number(submissionWithExcessReview)].splice(excessIndex, 1);
          studentReviewsCount[student.studentID]--;
  
          // Find a student who needs to review more submissions
          const studentWithLessReviews = students.find(s => studentReviewsCount[s.studentID] < reviewsPerAssignment);
          if (studentWithLessReviews) {
            submissionReviews[Number(submissionWithExcessReview)].push(studentWithLessReviews.studentID);
            studentReviewsCount[studentWithLessReviews.studentID]++;
          }
        }
      }
    });
  
    // Convert submissionReviews object to array of objects for the required format
    const result: ReviewGroup[] = Object.keys(submissionReviews).map(submissionID => ({
      submissionID: Number(submissionID),
      reviewers: submissionReviews[Number(submissionID)]
    }));

    // It returns an array of objects, where each object contains the submission ID 
    // and the list of student IDs that are assigned to review that specific submission.
    return result;
  };