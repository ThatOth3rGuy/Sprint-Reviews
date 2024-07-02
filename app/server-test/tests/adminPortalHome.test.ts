// adminPortalHome.test.ts
import { test, expect } from '@playwright/test';
import playwrightConfig from '../playwright.config';

const baseURL = playwrightConfig.use?.baseURL; // Base URL of your application

test.describe('Admin Portal Home Page', () => {

  test.beforeEach(async ({ page }) => {
    // Mock session validation
    await page.route('/api/auth/checkSession', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          user: {
            userID: 1,
            role: 'admin',
            firstName: 'Admin',
            lastName: 'User'
          }
        })
      });
    });

    // Mock fetching courses
    await page.route('/api/getAllCourses?isArchived=false', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          { courseID: 1, courseName: 'Course 1', instructorFirstName: 'Instructor 1', instructorLastName: 'Last 1', averageGrade: 90 },
          { courseID: 2, courseName: 'Course 2', instructorFirstName: 'Instructor 2', instructorLastName: 'Last 2', averageGrade: 85 }
        ])
      });
    });

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
    const course1 = page.locator('text=Course 1');
    const course2 = page.locator('text=Course 2');
    await expect(course1).toBeVisible();
    await expect(course2).toBeVisible();
  });

  // Check that clicking a course redirects to the course dashboard
  test('should redirect to course dashboard on course click', async ({ page }) => {
    await page.locator('text=Course 1').click();
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

    const errorMessage = page.locator('text=Error: Failed to fetch courses');
    await expect(errorMessage).toBeVisible();
  });

  // Check that the breadcrumbs are displayed
  test('should display breadcrumbs', async ({ page }) => {
    const dashboardLink = page.locator('text=Dashboard');
    const adminPortalLink = page.locator('text=Admin Portal');
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
