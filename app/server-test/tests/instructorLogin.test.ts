// instructorLogin.test.ts
import { test, expect } from '@playwright/test';
import playwrightConfig from '../playwright.config';

const baseURL = 'http://localhost:3001';// playwrightConfig.use?.baseURL; // Base URL of your application


test.describe('Instructor Login Page', () => {

    test.beforeEach(async ({ page }) => {
      // Navigate to the instructor login page before each test
      await page.goto(`${baseURL}/instructor/login`);
    });
  
    // Check that the logo is displayed
    test('should display the logo', async ({ page }) => {
      const logo = page.locator('img[alt="Logo"]');
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute('src', '/images/Logo.png'); // This relative path may need to be different for the tests (I just took the path from the file)
    });
  
    // Check that the email and password input fields are displayed
    test('should display the email and password input fields', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
    });
  
    // Check that the sign-in button is displayed
    test('should display the sign-in button', async ({ page }) => {
      const signInButton = page.getByText('Sign In');
      await expect(signInButton).toBeVisible();
    });

    // Check that the back icon is displayed
    test('should display the back icon', async ({ page }) => {
      const backIcon = page.locator('img[alt="Back"]');
      await expect(backIcon).toBeVisible();
    });
  
    // Check that the back icon redirects to the landing page
    test('should redirect to the landing page when back icon is clicked', async ({ page }) => {
      await page.locator('img[alt="Back"]').click();
      await expect(page).toHaveURL('http://localhost:3001/');
    });

    // Check that the sign-up link redirects to the registration page
    test('should redirect to the registration page when sign-up link is clicked', async ({ page }) => {
      await page.locator('text=Sign up').click();
      await expect(page).toHaveURL('http://localhost:3001/instructor/registration');
    });
  
    // Check if an error message is displayed when the sign-in attempt fails
    test('should show an error message on failed sign-in attempt', async ({ page }) => {
      await page.route('/api/auth/instructorLogin', route => {
        route.fulfill({
          status: 401,
          body: JSON.stringify({ message: 'Invalid email or password' }),
        });
      });
  
      await page.fill('input[type="email"]', 'invalid@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.getByText('Sign In').click();
  
      const errorMessage = page.locator('text=Failed to authenticate');
      await expect(errorMessage).toBeVisible();
    });
  
    // Check if logging in redirects to the dashboard
    test('should redirect to the dashboard on successful sign-in attempt', async ({ page }) => {
      await page.route('/api/auth/instructorLogin', route => {
        route.fulfill({
          status: 200,
        });
      });
  
      // Currently using admin credentials to test the redirect as it's the only instructor account in the init.sql file
      await page.fill('input[type="email"]', 'admin@gmail.com');
      await page.fill('input[type="password"]', 'password');
      await page.getByText('Sign In').click();
  
      await expect(page).toHaveURL('http://localhost:3001/instructor/dashboard');
    });
  });