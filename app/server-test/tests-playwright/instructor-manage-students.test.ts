// manageStudents.test.ts
import { test, expect } from '@playwright/test';
import path from 'path';

const baseURL = 'http://localhost:3001';

// Login function to obtain a valid session
async function login(page: any) {
  await page.goto(`${baseURL}/instructor/login`);
  await page.fill('input[type="email"]', 'scott.faz@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('text=Sign In');
  await page.waitForNavigation();
}

test.describe('Manage Students Page', () => {

  test.beforeEach(async ({ page }) => {
    // Perform login before each test to obtain a valid session
    await login(page);

    // Navigate to the manage students page before each test
    await page.goto(`${baseURL}/instructor/manage-students?courseId=2`);
  });

  // Check that students are displayed after loading
  test('should display students after loading', async ({ page }) => {
    const student = page.getByText('Jane Smith', { exact: true });
    await expect(student).toBeVisible();
  });

  // Check that enrolling a new student works
  test('should enroll a new student', async ({ page }) => {
    await page.click('text=Enroll Individual Student');
    await page.fill('input[type="number"]', '1001');
    // Use a more specific selector for the enroll button within the modal
    await page.click('button:has-text("Enroll")', { force: true });
    
    //await expect(page.getByText('Student enrolled successfully')).toBeVisible();
    await expect(page.getByText('John Doe', { exact: true })).toBeVisible();
  });

  // Check that enrolling students from CSV works
  test('should enroll students from CSV', async ({ page }) => {
    await page.click('text=Enroll Students from CSV');
    const filePath = path.join(__dirname, '../test-files/students.csv');
    await page.setInputFiles('input[type="file"]', filePath);
    // Use a more specific selector for the enroll button within the modal
    await page.click('button:has-text("Enroll")', { force: true });
    
    await expect(page.getByText('Students enrolled successfully')).toBeVisible();
    await expect(page.getByText('CSV Student', { exact: true })).toBeVisible(); // Assuming the CSV contains a student named CSV Student
  });

  // Check that removing a student works
  test('should remove a student', async ({ page }) => {
    await page.click('text=Remove Student');
    const studentToRemove = page.getByText('John Doe', { exact: true });
    await studentToRemove.click();
    // Use a more specific selector for the remove button within the modal
    await page.click('button:has-text("Remove")', { force: true });
    
    await expect(page.getByText('Student removed successfully')).toBeVisible();
    await expect(page.getByText('John Doe', { exact: true })).not.toBeVisible();
  });

  // Mock an error response for fetching students
  test('should display error message on failed students fetch', async ({ page }) => {
    await page.route('**/api/courses/getCourseList?courseID=2', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ message: 'Failed to fetch students' })
      });
    });

    // Reload the page to trigger the error
    await page.reload();

    // Capture the alert dialog
    page.on('dialog', dialog => {
      expect(dialog.message()).toBe('Failed to fetch students');
      dialog.accept();
    });

    // Wait for any dialog event
    await page.waitForEvent('dialog');
  });

  // Check that the breadcrumb navigation works
  test('should navigate to home and back to course dashboard via breadcrumbs', async ({ page }) => {
    await page.click('text=Home', { force: true });
    await expect(page).toHaveURL(`${baseURL}/instructor/dashboard`);

    await page.click('text=COSC 310', { force: true });
    await expect(page).toHaveURL(`${baseURL}/instructor/course-dashboard?courseId=2`);
  });

});
