import { test, expect } from '@playwright/test';

test('homepage has expected h1', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  const title = page.locator('h1');
  await expect(title).toHaveText('Welcome to Next.js!');
});