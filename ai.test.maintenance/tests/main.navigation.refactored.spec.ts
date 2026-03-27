/**
 * TC-001 — Main Page Navigation Buttons: Docs, API, Community
 *
 * Validates per the manual test case:
 *  E1 — Page loads https://playwright.dev with the correct title
 *  E2 — The <nav> landmark is rendered and visible
 *  E3 — Docs link: visible · accessible by role+label · enabled · valid href · correct destination
 *  E4 — API link: visible · accessible by role+label · enabled · valid href · correct destination
 *  E5 — Community link: visible · accessible by role+label · enabled · valid href · correct destination
 */
import { test, expect, type Locator } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

// ---------------------------------------------------------------------------
// NAV_LINKS — single source of truth for all per-link test expectations.
// Adding, removing, or renaming a nav item requires a change only here.
// ---------------------------------------------------------------------------
type NavLink = {
  label: string;
  expectedHref: RegExp;
  expectedUrl: RegExp;
  locator: (h: HomePage) => Locator;
  click: (h: HomePage) => Promise<void>;
};

const NAV_LINKS: NavLink[] = [
  {
    label: 'Docs',
    expectedHref: /\/docs/,
    expectedUrl: /\/docs/,
    locator: (h) => h.docsLink,
    click: (h) => h.clickDocs(),
  },
  {
    label: 'API',
    expectedHref: /\/api/,
    expectedUrl: /\/api/,
    locator: (h) => h.apiLink,
    click: (h) => h.clickApi(),
  },
  {
    label: 'Community',
    expectedHref: /\/community/,
    expectedUrl: /\/community/,
    locator: (h) => h.communityLink,
    click: (h) => h.clickCommunity(),
  },
];

test.describe('Main Page Navigation', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    // E1 — smoke check: correct page served before any navigation assertion runs
    await expect(page).toHaveTitle(/Playwright/);
  });

  // -------------------------------------------------------------------------
  // E2 — Navigation landmark
  // -------------------------------------------------------------------------

  test('navigation landmark is visible on the main page', async () => {
    await expect(homePage.navBar).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // E3 / E4 / E5 — Per-link display and accessibility
  //
  // Fixes applied vs legacy spec:
  //   SEL-1  CSS #docs ID selector → getByRole scoped to <nav>, exact: true (via POM)
  //   SEL-2  Unscoped page-wide search → scoped to navBar locator (via POM)
  //   SEL-3  Missing exact: true → restored (via POM)
  //   A11Y-1 navBar.toBeVisible() → enforced in the landmark test above
  //   A11Y-2 Missing toBeEnabled() → restored per link
  //   A11Y-3 Missing toHaveAttribute('href') → restored per link
  //   DUP-1  Repeated visibility checks → single data-driven loop
  //   READ-1 Mixed { page } injection → all display tests use only POM
  // -------------------------------------------------------------------------

  for (const { label, expectedHref, locator } of NAV_LINKS) {
    test(`${label} link is visible, accessible, enabled and has a valid href`, async () => {
      // Delegates to POM: visible · not aria-disabled · href points to a real destination
      await homePage.assertLinkAccessible(locator(homePage), expectedHref);
    });
  }

  // -------------------------------------------------------------------------
  // E3 / E4 / E5 — Navigation destinations
  //
  // Fixes applied vs legacy spec:
  //   SYNC-1 waitForTimeout(2000) removed — toHaveURL auto-retries until settled
  //   COV-1  /.+/ replaced with specific per-link URL patterns
  //   COV-2  No content check → page main region asserted after navigation
  //   ENC-1  homePage.page exposed in spec → { page } fixture used directly
  // -------------------------------------------------------------------------

  test.describe('Navigation destinations', () => {
    for (const { label, click, expectedUrl } of NAV_LINKS) {
      test(`${label} link navigates to the correct page`, async ({ page }) => {
        // Action
        await click(homePage);

        // URL — specific pattern; a 404, redirect loop, or wrong route will fail this
        await expect(page).toHaveURL(expectedUrl);

        // Content — destination page rendered its main region
        await expect(page.getByRole('main')).toBeVisible();
      });
    }
  });
});
