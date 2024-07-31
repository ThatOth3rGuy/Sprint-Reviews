import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:3001';

async function login(page: any) {
  await page.goto(`${baseURL}/instructor/login`);
  await page.fill('input[type="email"]', 'admin@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('text=Sign In');
  await page.waitForNavigation();
}

test.describe('Instructor Individual Assignment View', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    // Assuming assignment ID 1 and course ID 1 for testing
    await page.goto(`${baseURL}/instructor/assignment-dashboard?assignmentID=1&courseId=1`);
  });

  test('should display assignment title in the header', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    const assignmentTitle = await page.locator('h1').innerText();
    expect(assignmentTitle).not.toBe('Assignment Name- Details');
  });

  test('should have working breadcrumb navigation', async ({ page }) => {
    await page.click('text=Home');
    await expect(page).toHaveURL(`${baseURL}/instructor/dashboard`);

    // The breadcumb for the course just goes back to the previous page, so we need to navigate there how a user would
    await page.click('text=COSC 499');
    await page.click('text=Assignment 1');
    await page.click('text=COSC 499');
    await expect(page).toHaveURL(`${baseURL}/instructor/course-dashboard?courseId=1`);
  });

  test('should display AssignmentDetailCard with correct information', async ({ page }) => {
    // Check for title in the AssignmentDetailCard
    await expect(page.locator('h2.AssignmentDetailCard_assignmentTitle__cxkti')).toBeVisible();

    // Check for description
    await expect(page.locator('text="Description for assignment 1"')).toBeVisible();
    
    // Check for deadline
    await expect(page.locator('text="No deadline set"').or(page.locator('text=/Deadline:/'))).toBeVisible();
  });

  test('should handle error when assignment data fetch fails', async ({ page }) => {
    /*
    This test is currently failing because the error handling isn't set up correctly.
    When an error is thrown it's supposed to diplay an error message, but instead it's getting stuck on the loading spinner.
    */
    await page.goto(`${baseURL}/instructor/assignment-dashboard`);
    // Mock a failed response
    //await page.route('**/api/assignments/1', route => route.fulfill({ status: 500, body: 'Server error' }));
    
    await page.reload();
    
    // Check for error message or fallback UI
    await expect(page.locator('text=Error loading assignment data').or(page.locator('text=Assignment Name- Details'))).toBeVisible();
  });
});