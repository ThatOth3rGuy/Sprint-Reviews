import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:3001';

async function login(page: any) {
  await page.goto(`${baseURL}/instructor/login`);
  await page.fill('input[type="email"]', 'admin@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('text=Sign In');
  await page.waitForNavigation();
}

test.describe('Instructor Individual Assignment View', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    // Assuming assignment ID 1 and course ID 1 for testing
    await page.goto(`${baseURL}/instructor/assignment-dashboard?assignmentID=1&courseId=1`);
  });

  test('should display assignment title in the header', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    const assignmentTitle = await page.locator('h1').innerText();
    expect(assignmentTitle).not.toBe('Assignment Name- Details');
  });

  test('should have working breadcrumb navigation', async ({ page }) => {
    await expect(page.locator('nav[aria-label="breadcrumb"]')).toBeVisible();
    
    // Test Home link
    await page.click('text=Home');
    await expect(page).toHaveURL(`${baseURL}/instructor/dashboard`);
    
    // Navigate back to the assignment page
    await page.goto(`${baseURL}/instructor/assignment-dashboard?assignmentID=1&courseId=1`);
    
    // Test Course Dashboard link
    await page.click('text=Course Dashboard');
    // Assuming it navigates back to the course dashboard
    await expect(page).toHaveURL(/\/instructor\/course-dashboard\?courseId=1/);
  });

  test('should display AssignmentDetailCard with correct information', async ({ page }) => {
    await expect(page.locator('.assignmentsSection')).toBeVisible();
    
    // Check for title
    await expect(page.locator('text=Assignment Title')).toBeVisible();
    
    // Check for description
    await expect(page.locator('text="No description available"').or(page.locator('text=/Description:/'))).toBeVisible();
    
    // Check for deadline
    await expect(page.locator('text="No deadline set"').or(page.locator('text=/Deadline:/'))).toBeVisible();
    
    // Check for submitted students
    await expect(page.locator('text="Student A"')).toBeVisible();
    await expect(page.locator('text="Student B"')).toBeVisible();
    await expect(page.locator('text="Student C"')).toBeVisible();
    
    // Check for remaining students
    await expect(page.locator('text="Student D"')).toBeVisible();
    await expect(page.locator('text="Student E"')).toBeVisible();
    await expect(page.locator('text="Student F"')).toBeVisible();
  });

  test('should display the correct navbar based on user role', async ({ page }) => {
    // Check for instructor navbar
    const instructorNavbar = await page.locator('nav:has-text("Instructor")').count();
    
    // Check for admin navbar
    const adminNavbar = await page.locator('nav:has-text("Admin")').count();
    
    // Ensure only one navbar is present
    expect(instructorNavbar + adminNavbar).toBe(1);
  });

  test('should handle error when assignment data fetch fails', async ({ page }) => {
    // Mock a failed response
    await page.route('**/api/assignments/*', route => route.fulfill({ status: 500, body: 'Server error' }));
    
    await page.reload();
    
    // Check for error message or fallback UI
    await expect(page.locator('text=Error loading assignment data').or(page.locator('text=Assignment Name- Details'))).toBeVisible();
  });
});