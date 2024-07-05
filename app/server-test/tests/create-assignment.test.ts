import { test, expect } from '@playwright/test';
import path from 'path';

const baseURL = 'http://localhost:3001';

// Login information comes from database, this should be adjusted when we implement a test db
async function login(page: any) {
  await page.goto(`${baseURL}/instructor/login`);
  await page.fill('input[type="email"]', 'admin@gmail.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('text=Sign In');
  await page.waitForNavigation();
}

test.describe('Create Assignment Page', () => {
  test.beforeEach(async ({ page }) => {
    // Perform login before each test to obtain a valid session
    await login(page);
    
    await page.goto('http://localhost:3001/instructor/create-assignment');
  });

  test('should display the create assignment form', async ({ page }) => {
    await expect(page.locator('text=Create an Assignment')).toBeVisible();
  });

  test('should show error message if required fields are empty', async ({ page }) => {
    await page.click('text=Create Assignment');
    await expect(page.locator('text=Please fill in all fields and select at least one allowed file type')).toBeVisible();
  });

  test('should create an assignment successfully', async ({ page }) => {
    await page.fill('input[placeholder="Assignment Title"]', 'Test Assignment');
    await page.fill('textarea[placeholder="Assignment Description"]', 'This is a test assignment.');
    await page.fill('input[type="datetime-local"]', '2024-07-10T10:00');
    await page.selectOption('select', { label: 'Select a class' });
    await page.check('input[type="checkbox"]#txt');
    await page.click('text=Create Assignment');
    await expect(page).toHaveURL('http://localhost:3000/instructor/view-assignment');
  });

  test('should upload a file', async ({ page }) => {
    const filePath = path.join(__dirname, 'test-files', 'AssignmentRubric.txt');
    await page.setInputFiles('input[type="file"]', filePath);
    await expect(page.locator('text=File uploaded successfully')).toBeVisible();
  });

  test('should toggle group assignment checkbox', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]');
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });
});
