/**
 * TC-NAV-001 — Main Page Navigation Buttons: Docs, API, Community
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
  /** href attribute anchored to path start; prevents accidental substring matches */
  expectedHref: RegExp;
  /** URL pattern scoped to playwright.dev; rejects cross-domain redirects */
  expectedUrl: RegExp;
  locator: (h: HomePage) => Locator;
  click: (h: HomePage) => Promise<void>;
};

const NAV_LINKS: NavLink[] = [
  {
    label: 'Docs',
    expectedHref: /^\/docs/,
    expectedUrl: /playwright\.dev\/docs/,
    locator: (h) => h.docsLink,
    click: (h) => h.clickDocs(),
  },
  {
    label: 'API',
    // playwright.dev nests the API reference under /docs/api/
    expectedHref: /^\/docs\/api/,
    expectedUrl: /playwright\.dev\/docs\/api/,
    locator: (h) => h.apiLink,
    click: (h) => h.clickApi(),
  },
  {
    label: 'Community',
    expectedHref: /^\/community/,
    expectedUrl: /playwright\.dev\/community/,
    locator: (h) => h.communityLink,
    click: (h) => h.clickCommunity(),
  },
];

test.describe('Main Page Navigation', { tag: ['@smoke', '@navigation'] }, () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    test.info().annotations.push({ type: 'TestCase', description: 'TC-NAV-001' });

    homePage = new HomePage(page);
    await homePage.goto();
    // E1 — fail fast: assert the correct page was served before any nav check runs
    await expect(page).toHaveTitle(/Playwright/);
  });

  // -------------------------------------------------------------------------
  // E2 — Navigation landmark
  // -------------------------------------------------------------------------

  test('navigation landmark is visible on the main page', async () => {
    await expect(homePage.navBar).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // E3 / E4 / E5 — Per-link accessibility
  //
  // assertLinkAccessible delegates to the POM the full contract: visible,
  // enabled, href anchored to a real path, and not hidden from assistive
  // technology. Keeping the contract in the POM means adding a new check
  // (e.g. aria-label text) requires a change in one place only.
  // -------------------------------------------------------------------------

  for (const { label, expectedHref, locator } of NAV_LINKS) {
    test(`${label} link is visible, accessible, enabled and has a valid href`, async () => {
      await homePage.assertLinkAccessible(locator(homePage), expectedHref);
    });
  }

  // -------------------------------------------------------------------------
  // E3 / E4 / E5 — Navigation destinations
  //
  // URL pattern is scoped to playwright.dev so a redirect to an unrelated
  // domain cannot pass. Heading check confirms the destination page actually
  // rendered content — an empty <main> would satisfy a plain visibility check.
  // -------------------------------------------------------------------------

  test.describe('Navigation destinations', () => {
    for (const { label, click, expectedUrl } of NAV_LINKS) {
      test(`${label} link navigates to the correct page`, async ({ page }) => {
        await click(homePage);

        // Domain-scoped URL; a 404, redirect loop, or wrong domain will fail this
        await expect(page).toHaveURL(expectedUrl);

        // Destination page rendered a populated primary heading
        const heading = page.getByRole('heading', { level: 1 });
        await expect(heading).toBeVisible();
        await expect(heading).toContainText(/\w+/);
      });
    }
  });
});
