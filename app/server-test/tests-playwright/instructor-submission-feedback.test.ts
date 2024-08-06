import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:3001';

// Utility function to login
async function login(page: any) {
  await page.goto(`${baseURL}/instructor/login`);
  await page.fill('input[type="email"]', 'admin@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('text=Sign In');
  await page.waitForNavigation();
}

test.describe('Submission Feedback Page', () => {
  test.beforeEach(async ({ page }) => {
    // Perform login before each test
    await login(page);

    // Mock the edit grade API
    await page.route('**/api/updateTable', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Mock the add comment API
    await page.route('**/api/instructorComments/addFeedback', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          feedbackID: 2,
          comment: 'New test comment',
          feedbackDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        }),
      });
    });

    // Navigate to the submission feedback page
    await page.goto(`${baseURL}/instructor/submission-feedback?assignmentID=1&studentID=1001`);
  });

  test('should display assignment details correctly', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Assignment 1');
    await expect(page.locator('text=Description for assignment 1')).toBeVisible();
    await expect(page.locator('text=Assignment Submitted')).toBeVisible();
    await expect(page.locator('text=Adjusted Grade: 85')).toBeVisible();
  });

  test('should display feedbacks correctly', async ({ page }) => {
    await expect(page.locator('text=Feedback 1')).toBeVisible();
    await expect(page.locator('text=Details: Great work!')).toBeVisible();
    await expect(page.locator('text=Comment: Excellent job on the project!')).toBeVisible();
    await expect(page.locator('text=Grade: 85')).toBeVisible();
  });

  test('should display comments correctly', async ({ page }) => {
    await expect(page.locator('text=Comments')).toBeVisible();
    await expect(page.locator('text=Excellent job on the project!')).toBeVisible();
  });

  test('should allow adding a comment', async ({ page }) => {
    await page.fill('input[label="New Comment"]', 'New test comment');
    await page.click('text=Add Comment');
    await expect(page.locator('text=New test comment')).toBeVisible();
  });

  test('should allow editing a comment', async ({ page }) => {
    await page.click('text=Edit');
    await page.fill('input[type="text"]', 'Edited comment');
    await page.click('text=Save');
    await expect(page.locator('text=Edited comment')).toBeVisible();
  });

  test('should allow editing a grade', async ({ page }) => {
    await page.click('text=Edit Grade');
    await page.fill('input[type="number"]', '95');
    await page.click('text=Save');
    await expect(page.locator('text=Adjusted Grade: 95')).toBeVisible();
  });
});
