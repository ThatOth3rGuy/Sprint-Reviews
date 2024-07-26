// create-group.test.ts
import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:3001';

async function login(page: any) {
  await page.goto(`${baseURL}/instructor/login`);
  await page.fill('input[type="email"]', 'admin@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('text=Sign In');
  await page.waitForNavigation();
}

test.describe('Create Group Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${baseURL}/instructor/create-groups?courseId=1`);
  });

  test('should display create groups header', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    const headerText = await page.locator('h1').innerText();
    expect(headerText).toBe('Create Groups');
  });

  test('should have working breadcrumb navigation', async ({ page }) => {
    await page.click('text=Home');
    await expect(page).toHaveURL(`${baseURL}/instructor/dashboard`);
  });

  test('should display list of students', async ({ page }) => {
    await expect(page.locator('h2:has-text("All Students")')).toBeVisible();
  
    // Wait for the students listbox to load
    await page.waitForSelector('ul[role="listbox"]', { state: 'attached' });
  
    // Check if students are loaded or "No students available" message is displayed
    const studentsLoaded = await page.locator('ul[role="listbox"] li').count();
    if (studentsLoaded > 0) {
      await expect(page.locator('ul[role="listbox"] li').first()).toBeVisible();
    } else {
      await expect(page.getByText('No students available', { exact: true })).toBeVisible();
    }
  });
  

  test('should display list of groups', async ({ page }) => {
    await expect(page.locator('h2:has-text("Groups")')).toBeVisible();

    // Wait for groups to load
    await page.waitForSelector('div[role="accordion"]:has-text("Groups")', { state: 'attached' });

    // Check if groups are loaded or "No groups available" message is displayed
    const groupsLoaded = await page.locator('div[role="accordion"]:has-text("Groups") >> div').count();
    if (groupsLoaded > 0) {
      await expect(page.locator('div[role="accordion"]:has-text("Groups") >> div').first()).toBeVisible();
    } else {
      await expect(page.getByText('No groups available', { exact: true })).toBeVisible();
    }
  });

  test('should open and close randomize groups modal', async ({ page }) => {
    await page.click('text=Randomize Groups');
    await expect(page.locator('text=Randomize Groups')).toBeVisible();

    await page.fill('input[type="number"]', '3');
    await expect(page.locator('input[type="number"]')).toHaveValue('3');

    await page.click('text=Close');
    await expect(page.locator('text=Randomize Groups')).not.toBeVisible();
  });

  test('should open and close edit groups modal', async ({ page }) => {
    await page.click('text=Edit groups');
    await expect(page.locator('text=Edit Groups')).toBeVisible();

    await page.click('text=Close');
    await expect(page.locator('text=Edit Groups')).not.toBeVisible();
  });

  test('should open and close remove groups modal', async ({ page }) => {
    await page.click('text=Remove groups');
    await expect(page.locator('text=Remove Groups')).toBeVisible();

    await page.click('text=Cancel');
    await expect(page.locator('text=Remove Groups')).not.toBeVisible();
  });

  test('should create groups and navigate to course dashboard', async ({ page }) => {
    await page.click('text=Create/Update Groups');
    await page.waitForNavigation();
    await expect(page).toHaveURL(`${baseURL}/instructor/course-dashboard?courseId=1`);
  });

  test('should display the correct navbar based on user role', async ({ page }) => {
    // Wait for either navbar to be visible
    await page.waitForSelector('nav:has-text("Instructor"), nav:has-text("Admin")', { state: 'visible' });

    // Check for instructor navbar
    const instructorNavbar = await page.locator('nav:has-text("Instructor")').count();

    // Check for admin navbar
    const adminNavbar = await page.locator('nav:has-text("Admin")').count();

    // Ensure only one navbar is present
    expect(instructorNavbar + adminNavbar).toBe(1);
  });
});
