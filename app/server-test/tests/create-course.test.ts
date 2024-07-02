// create-course.test.ts
import { test, expect } from '@playwright/test';
import playwrightConfig from '../playwright.config';

const baseURL = playwrightConfig.use?.baseURL; // Base URL of your application

test.describe('Create Course Page', () => {

  test.beforeEach(async ({ page }) => {
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
    const createCourseButton = page.locator('text=Create Course');
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

    await page.setInputFiles('input[type="file"]', 'path/to/student-list.csv');

    await page.locator('text=Create Course').click();

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

    await page.locator('text=Create Course').click();

    const errorMessage = page.locator('text=Failed to create course');
    await expect(errorMessage).toBeVisible();
  });

  // Check for error handling when the enroll students API call fails
  test('should show error when enroll students API call fails', async ({ page }) => {
    // This test should FAIL until we add the student-list.csv file to the repository
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

    await page.setInputFiles('input[type="file"]', 'path/to/student-list.csv'); // Adjust this path once the student-list is added

    await page.locator('text=Create Course').click();

    const errorMessage = page.locator('text=Failed to enroll students');
    await expect(errorMessage).toBeVisible();
  });
});
