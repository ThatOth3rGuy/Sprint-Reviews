import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:3001';

async function login(page: any) {
  await page.goto(`${baseURL}/student/login`);
  await page.fill('input[type="email"]', 'student@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('text=Sign In');
  await page.waitForNavigation();
}

test.describe('View Assignments Page', () => {

  test.beforeEach(async ({ page }) => {
    // Perform login before each test to obtain a valid session
    await login(page);

    // Navigate to the view assignments page before each test
    await page.goto(`${baseURL}/student/view-assignments`);
  });

  test('should display the correct title', async ({ page }) => {
    const title = await page.title();
    expect(title).toBe('View Assignments');
  });

  test('should display the assignment list', async ({ page }) => {
    const assignmentList = await page.$('ul');
    expect(assignmentList).toBeTruthy();
  });

});
