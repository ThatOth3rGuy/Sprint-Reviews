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

test('should register a new Instructor and redirect to login page', async () => {
  await page.goto('http://localhost:3000/instructor/registration');

  // Fill all text inputs with test strings
  await page.fill('input[placeholder="First Name"]', 'Test');
  await page.fill('input[placeholder="Last Name"]', 'User');
  await page.fill('input[placeholder="Email"]', 'testuser@example.com');
  await page.fill('input[placeholder="Password"]', 'password123');
  await page.fill('input[placeholder="Confirm Password"]', 'password123');

  // Click Sign Up button
  await Promise.all([
    page.waitForNavigation(),
    page.click('button:has-text("Sign Up")'),
  ]);

  // Expected result is to redirect to the login page
  expect(page.url()).toBe('http://localhost:3000/instructor/login');
});

test('should login to dashboard', async () => {
  await page.goto('http://localhost:3000/instructor/login');

  // Fill all text inputs with test strings
  await page.fill('input[placeholder="Email"]', 'testuser@example.com');
  await page.fill('input[placeholder="Password"]', 'password123');

  // Click Login button
  await Promise.all([
    page.waitForNavigation(),
    page.click('button:has-text("Login")'),
  ]);

  // Expected result is to redirect to the dashboard
  expect(page.url()).toBe('http://localhost:3000/instructor/dashboard');
});