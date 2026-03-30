/**
 * Docs Page — Playwright installation and intro page
 *
 * Coverage:
 *   D1  Page loads at the correct URL with the expected title
 *   D2  Primary heading is visible and identifies the article
 *   D3  Main content area is rendered and non-empty
 *   D4  Docs sidebar landmark is present and contains navigation links
 *   D5  Sidebar link navigates to the correct destination
 *   D6  Installation code block is present in the main content
 *   D7  Cross-page: navigating from Home → Docs lands on the docs intro page
 */
import { test, expect } from '@playwright/test';
import { DocsPage } from '../pages/DocsPage';
import { HomePage } from '../pages/HomePage';

test.describe('Docs Page', { tag: ['@smoke', '@docs'] }, () => {
  let docsPage: DocsPage;

  test.beforeEach(async ({ page }) => {
    test.info().annotations.push({ type: 'TestCase', description: 'TC-DOCS' });
    docsPage = new DocsPage(page);
    await docsPage.goto();
  });

  // -------------------------------------------------------------------------
  // D1 — URL and title
  // -------------------------------------------------------------------------

  test('loads at the correct URL', async ({ page }) => {
    await expect(page).toHaveURL(/playwright\.dev\/docs\/intro/);
  });

  test('has a title that identifies the site', async ({ page }) => {
    await expect(page).toHaveTitle(/Playwright/);
  });

  // -------------------------------------------------------------------------
  // D2 — Primary heading
  // -------------------------------------------------------------------------

  test('displays a visible primary heading', async () => {
    await expect(docsPage.pageHeading).toBeVisible();
    // Heading must contain at least one word — rejects blank or whitespace-only
    await expect(docsPage.pageHeading).toContainText(/\w+/);
  });

  // -------------------------------------------------------------------------
  // D3 — Main content
  // -------------------------------------------------------------------------

  test('renders a non-empty main content area', async () => {
    await expect(docsPage.mainContent).toBeVisible();
    // At least one paragraph or heading must be present inside main
    const firstTextBlock = docsPage.mainContent.locator('p, h2').first();
    await expect(firstTextBlock).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // D4 — Sidebar
  // -------------------------------------------------------------------------

  test('sidebar is visible and contains navigation links', async () => {
    await expect(docsPage.sidebar).toBeVisible();
    const labels = await docsPage.getSidebarCategoryLabels();
    // Sidebar must expose at least several links to be useful
    expect(labels.length).toBeGreaterThan(3);
  });

  // -------------------------------------------------------------------------
  // D5 — Sidebar navigation
  // -------------------------------------------------------------------------

  test('sidebar Writing Tests link navigates to the correct page', async ({ page }) => {
    await docsPage.clickSidebarLink('Writing tests');
    await expect(page).toHaveURL(/\/docs\/writing-tests/);
    await expect(docsPage.pageHeading).toBeVisible();
    await expect(docsPage.pageHeading).toContainText(/\w+/);
  });

  // -------------------------------------------------------------------------
  // D6 — Installation code block
  // -------------------------------------------------------------------------

  test('installation code block is visible in the main content', async () => {
    // The intro page always contains at least one pre element with install commands
    await expect(docsPage.codeBlock).toBeVisible();
    // Code block must contain non-whitespace text — rejects empty pre elements
    const text = await docsPage.codeBlock.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  // -------------------------------------------------------------------------
  // D7 — Cross-page navigation from Home
  // -------------------------------------------------------------------------

  test('navigating from Home via Docs link reaches the docs section', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.clickDocs();

    await expect(page).toHaveURL(/playwright\.dev\/docs/);
    await expect(docsPage.pageHeading).toBeVisible();
  });
});
