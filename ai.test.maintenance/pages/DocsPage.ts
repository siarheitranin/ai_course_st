import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DocsPage — Page Object for https://playwright.dev/docs/intro.
 *
 * Extends BasePage for shared navigation and load-state utilities.
 * Covers the primary documentation landing page: structure, content,
 * and in-page navigation.
 */
export class DocsPage extends BasePage {
  /** Primary h1 heading of the current docs article */
  readonly pageHeading: Locator;
  /** Left-hand docs sidebar navigation landmark */
  readonly sidebar: Locator;
  /** Main article content area */
  readonly mainContent: Locator;
  /** "Edit this page" link present on every docs article */
  readonly editPageLink: Locator;
  /** Next-page navigation link at the bottom of the article */
  readonly nextPageLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading  = page.getByRole('heading', { level: 1 });
    this.sidebar      = page.getByRole('navigation', { name: /docs sidebar/i });
    this.mainContent  = page.getByRole('main');
    this.editPageLink = page.getByRole('link', { name: /edit this page/i });
    this.nextPageLink = page.getByRole('link', { name: /next/i });
  }

  /** Navigate to the Playwright installation / intro page */
  async goto(): Promise<void> {
    await this.navigate('/docs/intro');
  }

  /**
   * Click a link in the sidebar by its visible label.
   * Scopes the search to the sidebar landmark so it cannot
   * accidentally match a link with the same name in the article body.
   */
  async clickSidebarLink(label: string): Promise<void> {
    await this.sidebar.getByRole('link', { name: label }).click();
  }

  /**
   * Return all top-level category headings rendered in the sidebar,
   * in DOM order.  Used to assert the sidebar structure is intact.
   */
  async getSidebarCategoryLabels(): Promise<string[]> {
    return this.sidebar
      .getByRole('link')
      .allTextContents()
      .then((labels) => labels.map((l) => l.trim()).filter(Boolean));
  }
}
