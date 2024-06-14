import { test, expect } from '@playwright/test';

test.describe('Role selection page', () => {
  const baseURL = 'http://localhost:3000'; // Base URL of your application

  test('should redirect to the student page', async ({ page }) => {
    await page.goto(`${baseURL}`); // Navigate to the base URL
    await page.click('text=Student'); // Click on the "Student" button
    await expect(page).toHaveURL(`${baseURL}/student/login`); // Check if redirected correctly
  });

  test('should redirect to the instructor page', async ({ page }) => {
    await page.goto(`${baseURL}`); // Navigate to the base URL
    await page.click('text=Instructor'); // Click on the "Instructor" button
    await expect(page).toHaveURL(`${baseURL}/instructor/login`); // Check if redirected correctly
  });
});

test.describe('Student page content', () => {
  const studentPageURL = 'http://localhost:3000/student/login'; // Adjust this URL as needed

  test('should display student page correctly', async ({ page }) => {
    await page.goto(studentPageURL); // Navigate to the student page
    await expect(page.locator('header >> h1')).toHaveText('Create A Student Account'); // Verify header text
    await expect(page.locator('button')).toHaveText('Sign Up'); // Verify button text
  });
});

test.describe('Instructor page content', () => {
  const instructorPageURL = 'http://localhost:3000/instructor/login'; // Adjust this URL as needed

  test('should display instructor page correctly', async ({ page }) => {
    await page.goto(instructorPageURL); // Navigate to the instructor page
    await expect(page.locator('header >> h1')).toHaveText('Create An Instructor Account'); // Verify header text
    await expect(page.locator('button')).toHaveText('Sign Up'); // Verify button text
  });
});