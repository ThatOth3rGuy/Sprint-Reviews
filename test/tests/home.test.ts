import { test, expect } from '@playwright/test';

test('navigate from main page to home page', async ({ page }) => {
  // Navigate to the main page
  await page.goto('http://localhost:3000/');
  await expect(page.locator('h1')).toHaveText('Hello, Next.js! you loser rip you');
  // Find the link by its text and click on it
  await page.click('text=Go to Home Page');

  // Check if the URL is now '/home'
  await expect(page).toHaveURL('http://localhost:3000/home');

  // Check for the presence of navigation links
  await expect(page.locator('a[href="#home"]')).toHaveText('Home');
  await expect(page.locator('a[href="#about"]')).toHaveText('About');
  await expect(page.locator('a[href="#contact"]')).toHaveText('Contact');

  // Verify the header content
  await expect(page.locator('header >> h1')).toHaveText('Welcome to Our Web App');
  await expect(page.locator('header >> p')).toHaveText('Your journey to explore our services begins here.');
  await expect(page.locator('a[href="#get-started"]')).toHaveText('Get Started');

  // Check the footer content
  await expect(page.locator('footer')).toHaveText('© 2023 Web App. All rights reserved.');
});