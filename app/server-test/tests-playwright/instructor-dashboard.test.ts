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
    await expect(page.locator('text=All Assignments')).toBeVisible();
    await expect(page.locator('text=Peer Reviews')).toBeVisible();
    await expect(page.locator('text=Peer Evaluations')).toBeVisible();
  });

  test('should display assignments section', async ({ page }) => {
    await expect(page.locator('text=Assignments Created')).toBeVisible();
    // Check if assignments are loaded or "No assignments found" message is displayed
    await expect(page.locator('text=Assignments Created').first()).toBeVisible();
    await expect(page.locator('text=No assignments found for this course').or(page.locator('.courseCard')).first()).toBeVisible();
  });

  test('should display peer reviews section', async ({ page }) => {
    await expect(page.locator('text=Peer Reviews Created')).toBeVisible();
    // Check if peer reviews are loaded or "No peer review assignments found" message is displayed
    await expect(page.locator('text=No peer review assignments found for this course').or(page.locator('.courseCard').nth(1)).first()).toBeVisible();
  });

  test('should have a working action menu', async ({ page }) => {
    await page.click('text=Actions');
    await expect(page.locator('text=Create Assignment')).toBeVisible();
    await expect(page.locator('text=Create Peer Review')).toBeVisible();
    await expect(page.locator('text=Create Student Groups')).toBeVisible();
    await expect(page.locator('text=Archive Course')).toBeVisible();
  });

  test('should navigate to create assignment page', async ({ page }) => {
    await page.click('text=Actions');
    await page.click('text=Create Assignment');
    await expect(page).toHaveURL(`${baseURL}/instructor/create-assignment?courseId=1`);
  });

  test('should navigate to create peer review page', async ({ page }) => {
    await page.click('text=Actions');
    await page.click('text=Create Peer Review');
    await expect(page).toHaveURL(`${baseURL}/instructor/release-assignment`);
  });

  test('should navigate to create student groups page', async ({ page }) => {
    await page.click('text=Actions');
    await page.click('text=Create Student Groups');
    await expect(page).toHaveURL(`${baseURL}/instructor/create-groups`);
  });

  test('should display notifications section', async ({ page }) => {
    await expect(page.locator('text=Notifications')).toBeVisible();
    await expect(page.locator('text=Dummy Notification')).toBeVisible();
  });

  test('should display the correct navbar based on user role', async ({ page }) => {
    // Check for instructor navbar
    const instructorNavbar = await page.locator('nav:has-text("Instructor")').count();
    
    // Check for admin navbar
    const adminNavbar = await page.locator('nav:has-text("Admin")').count();
    
    // Ensure only one navbar is present
    expect(instructorNavbar + adminNavbar).toBe(1);
  });
});