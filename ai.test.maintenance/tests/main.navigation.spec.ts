import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

/**
 * TC-001 — Main page should display navigation buttons: Docs, API, Community
 *
 * Verifies that the top navigation bar on https://playwright.dev
 * exposes all three expected navigation links on page load.
 */
test.describe('Main Page Navigation', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display all navigation links: Docs, API, Community', async () => {
    // Navigation landmark is present and visible
    await expect(homePage.navBar).toBeVisible();
    // Each link is visible within the landmark
    await expect(homePage.docsLink).toBeVisible();
    await expect(homePage.apiLink).toBeVisible();
    await expect(homePage.communityLink).toBeVisible();
  });

  test('should display the Docs navigation link', async () => {
    await expect(homePage.docsLink).toBeVisible();
    await expect(homePage.docsLink).toBeEnabled();
    await expect(homePage.docsLink).toHaveAttribute('href', /docs/);
  });

  test('should display the API navigation link', async () => {
    await expect(homePage.apiLink).toBeVisible();
    await expect(homePage.apiLink).toBeEnabled();
    await expect(homePage.apiLink).toHaveAttribute('href', /api/);
  });

  test('should display the Community navigation link', async () => {
    await expect(homePage.communityLink).toBeVisible();
    await expect(homePage.communityLink).toBeEnabled();
    await expect(homePage.communityLink).toHaveAttribute('href', /community/);
  });

  test.describe('Navigation destinations', () => {
    test('Docs link navigates to the Docs page', async () => {
      await homePage.clickDocs();
      await expect(homePage.page).toHaveURL(/\/docs/);
    });

    test('API link navigates to the API page', async () => {
      await homePage.clickApi();
      await expect(homePage.page).toHaveURL(/\/api/);
    });

    test('Community link navigates to the Community page', async () => {
      await homePage.clickCommunity();
      await expect(homePage.page).toHaveURL(/\/community/);
    });
  });
});
