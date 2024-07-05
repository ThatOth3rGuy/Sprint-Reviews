// studentDashboard.test.ts
import { test, expect } from '@playwright/test';
import playwrightConfig from '../playwright.config';

const baseURL = 'http://localhost:3001';
// playwrightConfig.use?.baseURL; // Base URL of your application

// Login information comes from database, this should be adjusted when we implement a test db
async function login(page: any) {
  await page.goto(`${baseURL}/student/login`);
  await page.fill('input[type="email"]', 'john.doe@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('text=Sign In');
  await page.waitForNavigation();
}

test.describe('Student Dashboard Page', () => {

  test.beforeEach(async ({ page }) => {
    // Perform login before each test to obtain a valid session
    await login(page);

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
    // Name of courses comes from the database, this should be adjusted when we implement a test db
    const course1 = page.getByText('Course', { exact: true }).first();
    const course2 = page.getByText('Course 2', { exact: true });
    await expect(course1).toBeVisible();
    await expect(course2).toBeVisible();
  });

  // Check that clicking a course redirects to the course dashboard
  test('should redirect to course dashboard on course click', async ({ page }) => {
    // Name of course comes from the database, this should be adjusted when we implement a test db
    const course1 = page.getByText('Course').first();
    await course1.click();
    await expect(page).toHaveURL(`${baseURL}/student/course-dashboard?courseID=1`);
  });

  // Check that the pending assignments section is displayed
  // This test will need to be updated, as the assignment section is just a template right now
  test('should display pending assignments section', async ({ page }) => {
    const pendingAssignments = page.locator('text=Pending Assignments');
    await expect(pendingAssignments).toBeVisible();

    // Intentionally fail test to show that the feature is not yet implemented
    expect(false).toBe(true);
  });

  // Check that clicking the assignment details redirects to the assignments page
  // This test will need to be updated, as the assignment section is just a template right now
  test('should redirect to assignments page on assignment details click', async ({ page }) => {
    await page.locator('text=Assignment').first().click();
    // Replace with the actual URL for the assignments page if available
    // await expect(page).toHaveURL(`${baseURL}/student/assignments`);

    // Intentionally fail test to show that the feature is not yet implemented
    expect(false).toBe(true);
  });

});
