import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:3001'; // replace with your application's base URL

async function login(page: any) {
  await page.goto(`${baseURL}/student/login`);
  await page.fill('input[type="email"]', 'student@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('text=Sign In');
  await page.waitForNavigation();
}

test.describe('Assignment Details Page', () => {

  test.beforeEach(async ({ page }) => {
    // Perform login before each test to obtain a valid session
    await login(page);
    await page.goto(`${baseURL}/student/assignment-details/1`);
  });


  test('should display the assignment details', async ({ page }) => {
    const assignmentTitle = await page.$('h1');
    expect(assignmentTitle).toBeTruthy();

    const assignmentDescription = await page.$('p.description');
    expect(assignmentDescription).toBeTruthy();

    const assignmentDueDate = await page.$('p.dueDate');
    expect(assignmentDueDate).toBeTruthy();

    const assignmentCourseID = await page.$('p.courseID');
    expect(assignmentCourseID).toBeTruthy();
  });

  test('should display the Submit Assignment button if before deadline', async ({ page }) => {
    const submitButton = await page.$('button.submitButton');
    expect(submitButton).toBeTruthy();
  });

});
