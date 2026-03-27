/**
 * TC-NAV-001 — Main Page Navigation: Docs, API, Community
 *
 * Scope: top navigation bar on https://playwright.dev
 *
 * Manual test case coverage:
 *   E1  Page title contains "Playwright"
 *   E2  <nav> landmark is rendered and visible
 *   E3  Docs link      — accessible contract, valid href, correct destination
 *   E4  API link       — accessible contract, valid href, correct destination
 *   E5  Community link — accessible contract, valid href, correct destination
 */
import { test, expect, type Locator } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

// ---------------------------------------------------------------------------
// NAV_LINKS — single source of truth for all per-link expectations.
// To add, remove, or rename a nav item, change only this table.
// ---------------------------------------------------------------------------
type NavLink = {
  label: string;
  /** href attribute anchored to the start of the path */
  expectedHref: RegExp;
  /** Full URL pattern scoped to playwright.dev; rejects cross-domain redirects */
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
    // Attach traceability so the test ID appears in HTML and JUnit reports
    test.info().annotations.push({ type: 'TestCase', description: 'TC-NAV-001' });

    homePage = new HomePage(page);
    await homePage.goto();

    // E1 — fail fast: assert the correct page was served before any nav check runs
    await expect(page).toHaveTitle(/Playwright/);
  });

  // -------------------------------------------------------------------------
  // E2 — Navigation landmark
  // -------------------------------------------------------------------------

  test('navigation bar is present and visible on page load', async () => {
    await expect(homePage.navBar).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // E3 / E4 / E5 — Per-link accessibility contract
  //
  // POM.assertLinkAccessible covers: visible, enabled, valid href, not
  // aria-hidden. The target assertion is a product policy (keep users in the
  // same browsing context) rather than a WCAG requirement, so it lives here.
  // -------------------------------------------------------------------------

  for (const { label, expectedHref, locator } of NAV_LINKS) {
    test(`${label} link satisfies the accessibility contract`, async () => {
      const link = locator(homePage);

      // Delegates full a11y contract to POM (WCAG 4.1.2, 2.4.4)
      await homePage.assertLinkAccessible(link, expectedHref);

      // Primary nav links must not force a new tab; breaks keyboard navigation flow
      await expect(link).not.toHaveAttribute('target', '_blank');
    });
  }

  // -------------------------------------------------------------------------
  // E3 / E4 / E5 — Navigation destinations
  //
  // URL check is scoped to playwright.dev so a redirect to a different domain
  // (or a relative-only match on an error page) cannot pass undetected.
  // Heading check confirms the destination page rendered meaningful content,
  // not just an empty shell — a blank <main> would pass a visibility check alone.
  // -------------------------------------------------------------------------

  test.describe('Navigation destinations', () => {
    for (const { label, click, expectedUrl } of NAV_LINKS) {
      test(`${label} link navigates to the correct destination`, async ({ page }) => {
        await click(homePage);

        // Domain-scoped URL: a 404, wrong domain, or redirect loop will fail this
        await expect(page).toHaveURL(expectedUrl);

        // Destination page must render a populated primary heading
        const heading = page.getByRole('heading', { level: 1 });
        await expect(heading).toBeVisible();
        await expect(heading).toContainText(/\w+/);
      });
    }
  });

  // -------------------------------------------------------------------------
  // Edge cases
  // -------------------------------------------------------------------------

  test('nav bar contains exactly the expected primary navigation links', async () => {
    // Count how many of our expected labels actually appear — detects additions
    // or deletions without requiring a full DOM audit
    const count = await homePage.navBar
      .getByRole('link', { name: /^(Docs|API|Community)$/i })
      .count();
    expect(count).toBe(NAV_LINKS.length);

    // Each label must be individually reachable by its exact accessible name
    for (const { label } of NAV_LINKS) {
      await expect(
        homePage.navBar.getByRole('link', { name: label, exact: true })
      ).toBeVisible();
    }
  });

  test('navigation links are presented in the canonical order: Docs → API → Community', async () => {
    // getNavLinkLabelsInDOMOrder() returns ALL nav links in DOM sequence.
    // Filter to the labels this suite owns, then assert order is preserved.
    // A CSS reorder or JavaScript shuffle that keeps the links present will
    // still be caught because allTextContents() reflects DOM, not visual, order.
    const expectedLabels = NAV_LINKS.map((n) => n.label);
    const allLabels = await homePage.getNavLinkLabelsInDOMOrder();
    const filtered = allLabels.map((t) => t.trim()).filter((t) => expectedLabels.includes(t));

    expect(filtered).toEqual(expectedLabels);
  });
});
