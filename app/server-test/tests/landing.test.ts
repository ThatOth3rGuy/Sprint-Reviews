// landing.test.ts
import { test, expect } from '@playwright/test';
import playwrightConfig from '../playwright.config';

const baseURL = playwrightConfig.use?.baseURL; // Base URL of your application

test.describe('Role selection page', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the landing page before each test
    await page.goto(`${baseURL}`);
  });

  test('should display the logo', async ({ page }) => {
    // Check if landing page displays a logo
    const logo = page.locator('img[alt="SprintRunners Logo"]');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('src', '/Logo.png');
  });

  test('should display the role selection header', async ({ page }) => {
    // Check if landing page deisplays the 'Role Selection' header
    const roleSelectionHeader = page.getByText('Select Your Role');
    await expect(roleSelectionHeader).toBeVisible();
  });

  test('should display the role buttons', async ({ page }) => {
    // Check if landing page displays a 'Student' and an 'Instructor' button
    const studentButton = page.getByRole('button', { name: 'Student' });
    const instructorButton = page.getByRole('button', { name: 'Instructor' });
    await expect(studentButton).toBeVisible();
    await expect(instructorButton).toBeVisible();
  });

  test('should redirect to the student page', async ({ page }) => {
    await page.click('text=Student'); // Click on the "Student" button
    await expect(page).toHaveURL(`${baseURL}/student/login`); // Check if redirected correctly
  });

  test('should redirect to the instructor page', async ({ page }) => {
    await page.click('text=Instructor'); // Click on the "Instructor" button
    await expect(page).toHaveURL(`${baseURL}/instructor/login`); // Check if redirected correctly
  });
});
