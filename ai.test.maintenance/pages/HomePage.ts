import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage — Page Object for https://playwright.dev (root `/`).
 *
 * Extends BasePage for shared navigation and load-state utilities.
 * All locators use ARIA roles and accessible names so the selectors
 * align with how assistive technology and real users perceive the page.
 */
export class HomePage extends BasePage {
  readonly getStartedLink: Locator;
  readonly navBar: Locator;
  readonly docsLink: Locator;
  readonly apiLink: Locator;
  readonly communityLink: Locator;

  constructor(page: Page) {
    super(page);
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
    this.navBar = page.getByRole('navigation');
    this.docsLink = this.navBar.getByRole('link', { name: 'Docs', exact: true });
    this.apiLink = this.navBar.getByRole('link', { name: 'API', exact: true });
    this.communityLink = this.navBar.getByRole('link', { name: 'Community', exact: true });
  }

  async goto(): Promise<void> {
    await this.navigate('/');
  }

  async clickGetStarted(): Promise<void> {
    await this.getStartedLink.click();
  }

  async clickDocs(): Promise<void> {
    await this.docsLink.click();
  }

  async clickApi(): Promise<void> {
    await this.apiLink.click();
  }

  async clickCommunity(): Promise<void> {
    await this.communityLink.click();
  }

  /**
   * Asserts that a nav link satisfies the full accessibility contract:
   * rendered and visible, not aria-disabled, href points to a real destination,
   * and not hidden from assistive technology via aria-hidden="true".
   * Centralises the definition of "accessible link" so the spec reads as intent.
   */
  async assertLinkAccessible(link: Locator, expectedHref: RegExp): Promise<void> {
    await expect(link).toBeVisible();
    await expect(link).toBeEnabled();
    await expect(link).toHaveAttribute('href', expectedHref);
    await expect(link).not.toHaveAttribute('aria-hidden', 'true');
  }

  /**
   * Returns the visible text of every link inside the nav bar, in DOM order.
   * Used to assert that nav items have not been reordered.
   */
  async getNavLinkLabelsInDOMOrder(): Promise<string[]> {
    return this.navBar.getByRole('link').allTextContents();
  }
}
