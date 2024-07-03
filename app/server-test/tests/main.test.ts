/*
  This page should be replaced with the landing.test.ts file.
  I'm leaving it up until we have the tests running in case there are issues with 
  the landing.test.ts file. But once that file is working, this file should be deleted.

import { test, expect } from '@playwright/test';
import playwrightConfig from '../playwright.config';

const baseURL = playwrightConfig.use?.baseURL; // Base URL of your application

test.describe('Role selection page', () => {

  test('should redirect to the student page', async ({ page }) => {
    await page.goto(`${baseURL}`); // Navigate to the base URL
    await page.click('text=Student'); // Click on the "Student" button
    await expect(page).toHaveURL(`${baseURL}/student/login`); // Check if redirected correctly
  });

  test('should redirect to the instructor page', async ({ page }) => {
    await page.goto(`${baseURL}`); // Navigate to the base URL
    await page.click('text=Instructor'); // Click on the "Instructor" button
    await expect(page).toHaveURL(`${baseURL}/instructor/login`); // Check if redirected correctly
  });
});

test.describe('Student page content', () => {
  test('should display student page correctly', async ({ page }) => {
    await page.goto(`${baseURL}/student/login`); // Navigate to the student page
    await expect(page.locator('header >> h1')).toHaveText('Create A Student Account'); // Verify header text
    await expect(page.locator('button')).toHaveText('Sign Up'); // Verify button text
  });
});

test.describe('Instructor page content', () => {
  test('should display instructor page correctly', async ({ page }) => {
    await page.goto(`${baseURL}/instructor/login`); // Navigate to the instructor page
    await expect(page.locator('header >> h1')).toHaveText('Create An Instructor Account'); // Verify header text
    await expect(page.locator('button')).toHaveText('Sign Up'); // Verify button text
  });
});

*/