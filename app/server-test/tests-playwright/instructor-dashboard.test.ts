// instructor-dashboard.test.ts
import { test, expect } from '@playwright/test';
import { time } from 'console';

const baseURL = 'http://localhost:3001';

async function login(page: any) {
  await page.goto(`${baseURL}/instructor/login`);
  await page.fill('input[type="email"]', 'admin@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('text=Sign In');
  await page.waitForNavigation();
}

test.describe('Instructor Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${baseURL}/instructor/course-dashboard?courseId=1`);
  });

  test('should display course name in the header', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    const courseName = await page.locator('h1').innerText();
    expect(courseName).not.toBe('');
  });

  test('should have working breadcrumb navigation', async ({ page }) => {
    await page.click('text=Home');
    await expect(page).toHaveURL(`${baseURL}/instructor/dashboard`);
  });

  test('should display assignment types checkboxes', async ({ page }) => {
    await expect(page.getByText('All Assignments', { exact: true })).toBeVisible();
    await expect(page.getByText('Peer Reviews', { exact: true })).toBeVisible();
    await expect(page.getByText('Peer Evaluations', { exact: true })).toBeVisible();
  });

  test('should display assignments section', async ({ page }) => {
    await expect(page.getByText('Assignments Created', { exact: true })).toBeVisible();

    // Wait for assignments to load
    await page.waitForSelector('.instructor-components_outerCard__MgHD4', { state: 'attached'});

    // Check if assignments are loaded or "No assignments found" message is displayed
    const assignmentsLoaded = await page.locator('.instructor-components_outerCard__MgHD4').count();
    if (assignmentsLoaded > 0) {
      await expect(page.locator('.instructor-components_outerCard__MgHD4').first()).toBeVisible();
    } else {
      await expect(page.getByText('No assignments found for this course', { exact: true })).toBeVisible();
    }
  });

  test('should display peer reviews section', async ({ page }) => {
    await expect(page.getByText('Peer Reviews Created', { exact: true })).toBeVisible();

    // Wait for peer reviews to load
    await page.waitForSelector('.instructor-components_outerCard__MgHD4', { state: 'attached'});

    // Check if peer reviews are loaded or "No peer review assignments found" message is displayed
    const peerReviewsLoaded = await page.locator('.instructor-components_outerCard__MgHD4').count();
    if (peerReviewsLoaded > 0) {
      await expect(page.locator('.instructor-components_outerCard__MgHD4').first()).toBeVisible();
    } else {
      await expect(page.getByText('No peer review assignments found for this course', { exact: true })).toBeVisible();
    }
  });

  test('should have a working action menu', async ({ page }) => {
    const createAssignmentLink = page.locator('text=Create Assignment');
    const createPeerReviewLink = page.locator('text=Create Peer Review');
    const createStudentGroupsLink = page.locator('text=Create Student Groups');
    const editCourseName = page.locator('text=Edit Course Name');
    const manageStudentsLink = page.locator('text=Manage Students');
    const archiveCourseLink = page.locator('text=Archive Course');

    await expect(createAssignmentLink).toBeVisible();
    await expect(createPeerReviewLink).toBeVisible();
    await expect(createStudentGroupsLink).toBeVisible();
    await expect(editCourseName).toBeVisible();
    await expect(manageStudentsLink).toBeVisible();
    await expect(archiveCourseLink).toBeVisible();
  });

  test('should navigate to create assignment page', async ({ page }) => {
    await page.click('text=Create Assignment');
    await expect(page).toHaveURL(`${baseURL}/instructor/create-assignment?source=course&courseId=1`);
  });

  test('should navigate to create peer review page', async ({ page }) => {
    await page.click('text=Create Peer Review');
    await expect(page).toHaveURL(`${baseURL}/instructor/release-assignment?source=course&courseId=1`);
  });

  test('should navigate to create student groups page', async ({ page }) => {
    await page.click('text=Create Student Groups');
    await expect(page).toHaveURL(`${baseURL}/instructor/create-groups?source=course&courseId=1`);
  });

  test('should navigate to manage students page', async ({ page }) => {
    await page.click('text=Manage Students');
    await expect(page).toHaveURL(`${baseURL}/instructor/manage-students?courseId=1`);
  });

  test('should display notifications section', async ({ page }) => {
    await expect(page.getByText('Notifications', { exact: true })).toBeVisible();
    await expect(page.getByText('Dummy Notification', { exact: true })).toBeVisible();
  });

  test('should display the correct navbar based on user role', async ({ page }) => {
    // Wait for either navbar to be visible
    await page.waitForSelector('nav:has-text("Instructor"), nav:has-text("Admin")', { state: 'visible'});

    // Check for instructor navbar
    const instructorNavbar = await page.locator('nav:has-text("Instructor")').count();

    // Check for admin navbar
    const adminNavbar = await page.locator('nav:has-text("Admin")').count();

    // Ensure only one navbar is present
    expect(instructorNavbar + adminNavbar).toBe(1);
  });

  test('should update course name', async ({ page }) => {
    // Open the Edit Course Name modal
    await page.click('text=Edit Course Name');
  
    // Input a new course name
    const newCourseName = 'New Course Name';
    await page.fill('input[aria-label="Enter New Course Name"]', newCourseName);
  
    // Submit the form
    await page.click('button:has-text("Update")');
  
    // Wait for the modal to close
    await page.waitForSelector('.modal-content', { state: 'hidden' });
  
    // Verify that the course name has been updated
    await page.waitForTimeout(250);
    const courseName = await page.locator('h1').innerText();
    expect(courseName).toBe(newCourseName);

    // Change the course name back to the original value to keep the test data consistent
    await page.click('text=Edit Course Name');
    const oldCourseName = 'COSC 499';
    await page.fill('input[aria-label="Enter New Course Name"]', oldCourseName);
    await page.click('button:has-text("Update")');
  });
});
