// instructorCreateAssignment.test.ts
import { test, expect } from "@playwright/test";

const baseURL = "http://localhost:3001";

async function login(page: any) {
  await page.goto(`${baseURL}/instructor/login`);
  await page.fill('input[type="email"]', "admin@gmail.com");
  await page.fill('input[type="password"]', "password");
  await page.click("text=Sign In");
  await page.waitForNavigation();
}

async function testAssignmentCreate(page: any) {
  await page.fill('input[name="title"]', 'Test Assignment');
  await page.fill('textarea[name="description"]', 'This is a test assignment.');
  await page.fill('input[name="dueDate"]', '2024-12-31T23:59');
  await page.selectOption('select[name="courseID"]', '1'); // replace '1' with the actual courseID
  const fileInput = await page.$('input[type="file"]');
  await fileInput.setInputFiles('../test-files/testAssignment.txt');
  await page.check('input[name="groupAssignment"]');
  await page.check('input[id="txt"]');
  await page.check('input[id="pdf"]');
  await page.check('input[id="docx"]');
  await page.check('input[id="zip"]');
  await page.click('text=Create Assignment');

  // Add assertions to check the result...
};

test.describe('Student Dashboard Page', () => {

test.beforeEach(async ({ page }) => {
    // Perform login before each test to obtain a valid session
    await login(page);

    // Navigate to the student dashboard page before each test
    await page.goto(`${baseURL}/instructor/create-assignment`);
  });

  test('should display loading text initially', async ({ page }) => {
    const loadingText = page.locator('text=Loading...');
    await expect(loadingText).toBeVisible();
  });

  test('should display assignment creation form', async ({ page }) => {
    const title= page.getByText('Create an Assignment', {exact: true});
    await expect(title).toBeVisible();
  });

  test('should display the Create Assignment button', async ({ page }) => {
    const createButton = page.getByRole('button', {name: 'Create Assignment'})
    await expect(createButton).toBeVisible();
  });

  
  

});
