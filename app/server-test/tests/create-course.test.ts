// create-course.test.ts
import { test, expect } from '@playwright/test';
import path from 'path';
import playwrightConfig from '../playwright.config';

const baseURL = 'http://localhost:3001';
// playwrightConfig.use?.baseURL; // Base URL of your application

// Login information comes from database, this should be adjusted when we implement a test db
async function login(page: any) {
  await page.goto(`${baseURL}/instructor/login`);
  await page.fill('input[type="email"]', 'admin@gmail.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('text=Sign In');
  await page.waitForNavigation();
}

test.describe('Create Course Page', () => {

  test.beforeEach(async ({ page }) => {
    // Perform login before each test to obtain a valid session
    await login(page);

    // Navigate to the create course page before each test
    await page.goto(`${baseURL}/instructor/create-course`);
  });

  // Check that the course creation header is displayed
  test('should display the course creation header', async ({ page }) => {
    const header = page.locator('text=Create a Course');
    await expect(header).toBeVisible();
  });

  // Check that the course name and institution name input fields are displayed
  test('should display the course name and institution name input fields', async ({ page }) => {
    const courseNameInput = page.locator('input[placeholder="Course Name"]');
    const institutionNameInput = page.locator('input[placeholder="Institution Name"]');
    await expect(courseNameInput).toBeVisible();
    await expect(institutionNameInput).toBeVisible();
  });

  // Check that the file upload input is displayed
  test('should display the file upload input', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
  });

  // Check that the create course button is displayed
  test('should display the create course button', async ({ page }) => {
    const createCourseButton = page.locator('b:has-text("Create Course")');
    await expect(createCourseButton).toBeVisible();
  });

  // Check that the create course button can be clicked and that the appropriate API call is made
  test('should make API call to create course on button click', async ({ page }) => {
    await page.route('/api/createCourse', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ courseId: 1 }),
      });
    });

    await page.route('/api/enrollStudents', route => {
      route.fulfill({
        status: 200,
      });
    });

    await page.fill('input[placeholder="Course Name"]', 'Test Course');
    await page.fill('input[placeholder="Institution Name"]', 'Test Institution');

    const filePath = path.resolve(__dirname, '../test-files/students.csv');
    await page.setInputFiles('input[type="file"]', filePath);

    await page.locator('b:has-text("Create Course")').click();

    await expect(page).toHaveURL(`${baseURL}/instructor/course-dashboard?courseId=1`);
  });

  // Check for error handling when the create course API call fails
  test('should show error when create course API call fails', async ({ page }) => {
    await page.route('/api/createCourse', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ message: 'Failed to create course' }),
      });
    });

    await page.fill('input[placeholder="Course Name"]', 'Test Course');
    await page.fill('input[placeholder="Institution Name"]', 'Test Institution');

    await page.locator('b:has-text("Create Course")').click();

    const errorMessage = page.locator('text=Failed to create course');
    await expect(errorMessage).toBeVisible();
  });

  // Check for error handling when the enroll students API call fails
  test('should show error when enroll students API call fails', async ({ page }) => {
    await page.route('/api/createCourse', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ courseId: 1 }),
      });
    });

    await page.route('/api/enrollStudents', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ message: 'Failed to enroll students' }),
      });
    });

    await page.fill('input[placeholder="Course Name"]', 'Test Course');
    await page.fill('input[placeholder="Institution Name"]', 'Test Institution');

    const filePath = path.resolve(__dirname, '../test-files/students.csv');
    await page.setInputFiles('input[type="file"]', filePath);

    await page.locator('b:has-text("Create Course")').click();

    const errorMessage = page.locator('text=Failed to enroll students');
    await expect(errorMessage).toBeVisible();
  });
});
