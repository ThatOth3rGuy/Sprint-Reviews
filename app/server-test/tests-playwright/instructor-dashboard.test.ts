import { test, expect } from '@playwright/test';

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
    await page.waitForSelector('.courseCard', { state: 'attached', timeout: 60000 });

    // Check if assignments are loaded or "No assignments found" message is displayed
    const assignmentsLoaded = await page.locator('.courseCard').count();
    if (assignmentsLoaded > 0) {
      await expect(page.locator('.courseCard').first()).toBeVisible();
    } else {
      await expect(page.getByText('No assignments found for this course', { exact: true })).toBeVisible();
    }
  });

  test('should display peer reviews section', async ({ page }) => {
    await expect(page.getByText('Peer Reviews Created', { exact: true })).toBeVisible();
    
    // Wait for peer reviews to load
    await page.waitForSelector('.courseCard', { state: 'attached', timeout: 60000 });

    // Check if peer reviews are loaded or "No peer review assignments found" message is displayed
    const peerReviewsLoaded = await page.locator('.courseCard').nth(1).count();
    if (peerReviewsLoaded > 0) {
      await expect(page.locator('.courseCard').nth(1)).toBeVisible();
    } else {
      await expect(page.getByText('No peer review assignments found for this course', { exact: true })).toBeVisible();
    }
  });

  test('should have a working action menu', async ({ page }) => {
    await page.waitForSelector('text=Actions', { state: 'visible', timeout: 60000 });
    await page.click('text=Actions');
    await expect(page.getByText('Create Assignment', { exact: true })).toBeVisible();
    await expect(page.getByText('Create Peer Review', { exact: true })).toBeVisible();
    await expect(page.getByText('Create Student Groups', { exact: true })).toBeVisible();
    await expect(page.getByText('Archive Course', { exact: true })).toBeVisible();
  });

  test('should navigate to create assignment page', async ({ page }) => {
    await page.waitForSelector('text=Actions', { state: 'visible', timeout: 60000 });
    await page.click('text=Actions');
    await page.click('text=Create Assignment');
    await expect(page).toHaveURL(`${baseURL}/instructor/create-assignment?courseId=1`);
  });

  test('should navigate to create peer review page', async ({ page }) => {
    await page.waitForSelector('text=Actions', { state: 'visible', timeout: 60000 });
    await page.click('text=Actions');
    await page.click('text=Create Peer Review');
    await expect(page).toHaveURL(`${baseURL}/instructor/release-assignment`);
  });

  test('should navigate to create student groups page', async ({ page }) => {
    await page.waitForSelector('text=Actions', { state: 'visible', timeout: 60000 });
    await page.click('text=Actions');
    await page.click('text=Create Student Groups');
    await expect(page).toHaveURL(`${baseURL}/instructor/create-groups`);
  });

  test('should display notifications section', async ({ page }) => {
    await expect(page.getByText('Notifications', { exact: true })).toBeVisible();
    await expect(page.getByText('Dummy Notification', { exact: true })).toBeVisible();
  });

  test('should display the correct navbar based on user role', async ({ page }) => {
    // Wait for either navbar to be visible
    await page.waitForSelector('nav:has-text("Instructor"), nav:has-text("Admin")', { state: 'visible', timeout: 60000 });

    // Check for instructor navbar
    const instructorNavbar = await page.locator('nav:has-text("Instructor")').count();
    
    // Check for admin navbar
    const adminNavbar = await page.locator('nav:has-text("Admin")').count();
    
    // Ensure only one navbar is present
    expect(instructorNavbar + adminNavbar).toBe(1);
  });
});
