import { test, expect, chromium, Browser, Page } from '@playwright/test';

let browser: Browser;
let page: Page;

test.beforeAll(async () => {
  browser = await chromium.launch();
});

test.afterAll(async () => {
  await browser.close();
});

test.beforeEach(async () => {
  page = await browser.newPage();
});

test.afterEach(async () => {
  await page.close();
});

test('should register a new student and redirect to login page', async () => {
  await page.goto('http://localhost:3000/student/registration');

  // Fill all text inputs with test strings
  await page.fill('input[placeholder="First Name"]', 'Test');
  await page.fill('input[placeholder="Last Name"]', 'User');
  await page.fill('input[placeholder="Email"]', 'testuser@example.com');
  await page.fill('input[placeholder="Password"]', 'password123');
  await page.fill('input[placeholder="Confirm Password"]', 'password123');
  await page.fill('input[placeholder="Institution"]', 'Test Institution');

  // Click Sign Up button
  await Promise.all([
    page.waitForNavigation(),
    page.click('button:has-text("Sign Up")'),
  ]);

  // Expected result is to redirect to the login page
  expect(page.url()).toBe('http://localhost:3000/student/login');
});