import { test, expect } from '@playwright/test';
import path from 'path';

const baseURL = 'http://localhost:3001';

async function login(page: any) {
  await page.goto(`${baseURL}/instructor/login`);
  await page.fill('input[type="email"]', 'scott.faz@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('text=Sign In');
  await page.waitForNavigation();
}

test.describe('Create Assignment Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${baseURL}/instructor/create-assignment?courseId=1`);
  });

  test('should display the create assignment form', async ({ page }) => {
    await expect(page.locator('h1:has-text("Create Assignment")')).toBeVisible();
  });

  test('should show error message if required fields are empty', async ({ page }) => {
    await page.click('button:has-text("Create Assignment")');
    await expect(page.locator('text=Please enter the assignment title.')).toBeVisible();
  });

  test('should create an assignment successfully', async ({ page }) => {
    await page.fill('input[aria-label="Title"]', 'Test Assignment');
    await page.fill('textarea[placeholder="Assignment Description"]', 'This is a test assignment.');
    await page.fill('input[type="datetime-local"]', '2024-07-10T10:00');
    await page.check('text=Text (.txt)');
    await page.click('button:has-text("Create Assignment")');
    
    await expect(page).toHaveURL(/\/instructor\/course-dashboard\?courseId=1/);
  });

  test('should toggle group assignment checkbox', async ({ page }) => {
    const checkbox = page.getByText('Group Assignment');
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('should select allowed file types', async ({ page }) => {
    await page.check('text=Text (.txt)');
    await page.check('text=PDF (.pdf)');
    
    const txtCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: 'Text (.txt)' });
    const pdfCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: 'PDF (.pdf)' });
    
    await expect(txtCheckbox).toBeChecked();
    await expect(pdfCheckbox).toBeChecked();
  });

  test('should display course name in the header', async ({ page }) => {
    await expect(page.locator('h1:has-text("Create Assignment for")')).toBeVisible();
  });

  test('should navigate using breadcrumbs', async ({ page }) => {
    await page.click('text=Home');
    await expect(page).toHaveURL(`${baseURL}/instructor/dashboard`);
  });

  test('should show error for past due date', async ({ page }) => {
    await page.fill('input[aria-label="Title"]', 'Test Assignment');
    await page.fill('textarea[placeholder="Assignment Description"]', 'This is a test assignment.');
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0] + 'T00:00';
    await page.fill('input[type="datetime-local"]', yesterday);
    await page.check('text=Text (.txt)');
    await page.click('button:has-text("Create Assignment")');
    
    await expect(page.locator('text=Due date cannot be in the past')).toBeVisible();
  });
});