// adminPortalHome.test.ts
import { test, expect } from '@playwright/test';
import playwrightConfig from '../playwright.config';

const baseURL = 'http://localhost:3001';
// playwrightConfig.use?.baseURL; // Base URL of your application

// Login information comes from database, this should be adjusted when we implement a test db
async function login(page: any) {
  await page.goto(`${baseURL}/instructor/login`);
  await page.fill('input[type="email"]', 'admin@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('text=Sign In');
  await page.waitForNavigation();
}

test.describe('Admin Portal Home Page', () => {

  test.beforeEach(async ({ page }) => {
    // Perform login before each test to obtain a valid session
    await login(page);

    // Navigate to the admin portal home page before each test
    await page.goto(`${baseURL}/admin/portal-home`);
  });

  // Check that the loading text is displayed initially
  test('should display loading text initially', async ({ page }) => {
    const loadingText = page.locator('text=Loading...');
    await expect(loadingText).toBeVisible();
  });

  // Check that courses are displayed after loading
  test('should display courses after loading', async ({ page }) => {
    const course1 = page.getByText('COSC 499', { exact: true });
    const course2 = page.getByText('COSC 310', { exact: true });
    await expect(course1).toBeVisible();
    await expect(course2).toBeVisible();
  });

  // Check that clicking a course redirects to the course dashboard
  test('should redirect to course dashboard on course click', async ({ page }) => {
    const course1 = page.getByText('COSC 499', { exact: true });
    await course1.click();
    await expect(page).toHaveURL(`${baseURL}/instructor/course-dashboard?courseID=1`);
  });

  // Check that the filter and sort buttons are displayed
  test('should display filter and sort buttons', async ({ page }) => {
    const filterButton = page.locator('text=Filter');
    const sortButton = page.locator('text=Sort');
    await expect(filterButton).toBeVisible();
    await expect(sortButton).toBeVisible();
  });

  // Mock an error response for fetching courses
  test('should display error message on failed courses fetch', async ({ page }) => {
    await page.route('/api/getAllCourses?isArchived=false', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ message: 'Failed to fetch courses' })
      });
    });

    // Reload the page to trigger the error
    await page.reload();

    // Capture the alert dialog
    const [dialog] = await Promise.all([
      page.waitForEvent('dialog'),
  ]);

  expect(dialog.message()).toBe('Failed to fetch courses');
  await dialog.accept();
  });

  // Check that the breadcrumbs are displayed
  test('should display breadcrumbs', async ({ page }) => {
    const dashboardLink = page.getByRole('link', { name: 'Dashboard' });
    const adminPortalLink = page.getByRole('link', { name: 'Admin Portal' });
    await expect(dashboardLink).toBeVisible();
    await expect(adminPortalLink).toBeVisible();
  });

  // Check that the AdminHeader links are displayed
  test('should display admin header links', async ({ page }) => {
    const viewUsersLink = page.locator('text=View Users');
    const joinRequestsLink = page.locator('text=Join Requests');
    const archivedCoursesLink = page.locator('text=Archived Courses');
    await expect(viewUsersLink).toBeVisible();
    await expect(joinRequestsLink).toBeVisible();
    await expect(archivedCoursesLink).toBeVisible();
  });
});
