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
    // DEGRADED: navBar landmark visibility no longer asserted — a hidden <nav> would go undetected
    await expect(homePage.docsLink).toBeVisible();
    await expect(homePage.apiLink).toBeVisible();
    await expect(homePage.communityLink).toBeVisible();
  });

  test.fixme('should display the Docs navigation link', async ({ page }) => {
    // DEGRADED: brittle CSS ID selector bypasses role/label resolution entirely —
    // playwright.dev has no #docs element, so this locator matches nothing and the test will fail;
    // even if the id existed, renaming or removing it breaks the test without any HTML/a11y signal
    // test.fixme: preserved as a training artefact to demonstrate the antipattern
    const docsLink = page.locator('#docs');
    await expect(docsLink).toBeVisible();
    // DEGRADED: toBeEnabled() removed — an aria-disabled link would pass this test
    // DEGRADED: toHaveAttribute('href', /docs/) removed — a decorative anchor with href="#" would pass
  });

  test('should display the API navigation link', async () => {
    await expect(homePage.apiLink).toBeVisible();
    // DEGRADED: toBeEnabled() removed — an aria-disabled link would pass this test
    // DEGRADED: toHaveAttribute('href', /api/) removed — a decorative anchor with href="#" would pass
  });

  test('should display the Community navigation link', async () => {
    await expect(homePage.communityLink).toBeVisible();
    // DEGRADED: toBeEnabled() removed — an aria-disabled link would pass this test
    // DEGRADED: toHaveAttribute('href', /community/) removed — a decorative anchor with href="#" would pass
  });

  test.describe('Navigation destinations', () => {
    test('Docs link navigates to the Docs page', async () => {
      await homePage.clickDocs();
      // DEGRADED: fixed 2 s pause instead of a state-based assertion —
      // too short on a slow network (flaky), wastes 2 s on a fast one;
      // does not actually confirm the page finished loading or the URL is correct
      await homePage.page.waitForTimeout(2000);
      await expect(homePage.page).toHaveURL(/.+/);
    });

    test('API link navigates to the API page', async () => {
      await homePage.clickApi();
      // DEGRADED: /.+/ matches any non-empty URL — navigating to an error page would still pass
      await expect(homePage.page).toHaveURL(/.+/);
    });

    test('Community link navigates to the Community page', async () => {
      await homePage.clickCommunity();
      // DEGRADED: /.+/ matches any non-empty URL — navigating to an error page would still pass
      await expect(homePage.page).toHaveURL(/.+/);
    });
  });
});
