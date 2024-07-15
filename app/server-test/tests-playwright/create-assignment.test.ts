import { test, expect } from '@playwright/test';
import path from 'path';

const baseURL = 'http://localhost:3001';

// Login information comes from database, this should be adjusted when we implement a test db
async function login(page: any) {
  await page.goto(`${baseURL}/instructor/login`);
  await page.fill('input[type="email"]', 'scott.faz@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('text=Sign In');
  await page.waitForNavigation();
}

test.describe('Create Assignment Page', () => {
  test.beforeEach(async ({ page }) => {
    // Perform login before each test to obtain a valid session
    await login(page);
    
    await page.goto('http://localhost:3001/instructor/create-assignment');
  });

  /*
  test.afterEach(async ({ page }, testInfo) => {
    // Take a screenshot after each test
    const screenshotPath = path.join(__dirname, 'screenshots', `${testInfo.title}.png`);
    await page.screenshot({ path: screenshotPath });
  });
  */
 
  test('should display the create assignment form', async ({ page }) => {
    await expect(page.locator('text=Create an Assignment')).toBeVisible();
  });

  test('should show error message if required fields are empty', async ({ page }) => {
    // Click the "Create Assignment" button
    await page.click('div[class*="button"] >> text=Create Assignment');
    await expect(page.locator('text=Please fill in all fields and select at least one allowed file type')).toBeVisible();
  });

  test('should create an assignment successfully', async ({ page }) => {
    // Fill each input field with the required information
    await page.fill('input[placeholder="Assignment Title"]', 'Test Assignment');
    await page.fill('textarea[placeholder="Assignment Description"]', 'This is a test assignment.');
    await page.fill('input[type="datetime-local"]', '2024-07-10T10:00');
    await page.waitForSelector('select:has-text("Select a class")');
    await page.selectOption('select', { value: '1' }); 
    await page.check('input[type="checkbox"]#txt');

    // Click the "Create Assignment" button
    await page.click('div[class*="button"] >> text=Create Assignment');
    
    // Verify that the URL has changed to the expected URL
    await expect(page).toHaveURL('http://localhost:3001/instructor/view-assignment');
  });

  test('should upload a file', async ({ page }) => {
    const filePath = path.join(__dirname, '../test-files/AssignmentRubric.txt');
    
    // Check the file input value before uploading the file
    const fileInput = page.locator('input[type="file"]');
    const fileInputValueBefore = await fileInput.evaluate(input => (input as HTMLInputElement).value);
    expect(fileInputValueBefore).toBe('');

    // Upload the file
    await fileInput.setInputFiles(filePath);
    
    // Check the file input value after uploading the file
    const fileInputValueAfter = await fileInput.evaluate(input => (input as HTMLInputElement).files?.[0]?.name);
    expect(fileInputValueAfter).toBe('AssignmentRubric.txt');
  });

  test('should toggle group assignment checkbox', async ({ page }) => {
    const checkbox = page.getByRole('checkbox').first();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('should select a course from the dropdown', async ({ page }) => {
    // Wait for the page to load and the courses to be fetched
    await page.waitForSelector('select:has-text("Select a class")');
    
    // Verify the dropdown contains the expected options
    const options = await page.$$eval('select option', options => options.map(option => option.textContent));
    expect(options).toContain('COSC 499');
  
    // Select the 'COSC 499' from the dropdown
    await page.selectOption('select', { label: 'COSC 499' });
  
    // Verify the selected option
    const selectedOption = await page.$eval('select', select => select.value);
    expect(selectedOption).toBe('1');
  });
});
