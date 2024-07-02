// studentDashboard.test.ts
import { test, expect } from '@playwright/test';
import playwrightConfig from '../playwright.config';

const baseURL = playwrightConfig.use?.baseURL; // Base URL of your application

test.describe('Student Dashboard Page', () => {

  test.beforeEach(async ({ page }) => {
    // Mock session validation
    await page.route('/api/auth/checkSession', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          user: {
            userID: 1,
            role: 'student',
            firstName: 'Test',
            lastName: 'User'
          }
        })
      });
    });

    // Mock fetching courses
    await page.route('/api/getCourses?studentID=1', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          { courseID: 1, courseName: 'Course 1', instructorFirstName: 'Instructor 1' },
          { courseID: 2, courseName: 'Course 2', instructorFirstName: 'Instructor 2' }
        ])
      });
    });

    // Navigate to the student dashboard page before each test
    await page.goto(`${baseURL}/student/dashboard`);
  });

  // Check that the loading text is displayed initially
  test('should display loading text initially', async ({ page }) => {
    const loadingText = page.locator('text=Loading...');
    await expect(loadingText).toBeVisible();
  });

  // Check that the courses are displayed after loading
  test('should display courses after loading', async ({ page }) => {
    const course1 = page.locator('text=Course 1');
    const course2 = page.locator('text=Course 2');
    await expect(course1).toBeVisible();
    await expect(course2).toBeVisible();
  });

  // Check that clicking a course redirects to the course dashboard
  test('should redirect to course dashboard on course click', async ({ page }) => {
    await page.locator('text=Course 1').click();
    await expect(page).toHaveURL(`${baseURL}/student/course-dashboard?courseID=1`);
  });

  // Check that the pending assignments section is displayed
  // This test will need to be updated, as the assignment section is just a template right now
  test('should display pending assignments section', async ({ page }) => {
    const pendingAssignments = page.locator('text=Pending Assignments');
    await expect(pendingAssignments).toBeVisible();
  });

  // Check that clicking the assignment details redirects to the assignments page
  // This test will need to be updated, as the assignment section is just a template right now
  test('should redirect to assignments page on assignment details click', async ({ page }) => {
    await page.locator('text=Assignment').first().click();
    // Replace with the actual URL for the assignments page if available
    // await expect(page).toHaveURL(`${baseURL}/student/assignments`);
  });

});
