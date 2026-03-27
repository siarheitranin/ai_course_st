import { expect, type Page, type Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly getStartedLink: Locator;
  readonly navBar: Locator;
  readonly docsLink: Locator;
  readonly apiLink: Locator;
  readonly communityLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
    this.navBar = page.getByRole('navigation');
    this.docsLink = this.navBar.getByRole('link', { name: 'Docs', exact: true });
    this.apiLink = this.navBar.getByRole('link', { name: 'API', exact: true });
    this.communityLink = this.navBar.getByRole('link', { name: 'Community', exact: true });
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickGetStarted() {
    await this.getStartedLink.click();
  }

  async clickDocs() {
    await this.docsLink.click();
  }

  async clickApi() {
    await this.apiLink.click();
  }

  async clickCommunity() {
    await this.communityLink.click();
  }

  /**
   * Asserts that a nav link satisfies the full accessibility contract:
   * rendered and visible, not aria-disabled, and href points to a real destination.
   * Centralises the definition of "accessible link" so the spec reads as intent.
   */
  async assertLinkAccessible(link: Locator, expectedHref: RegExp): Promise<void> {
    await expect(link).toBeVisible();
    await expect(link).toBeEnabled();
    await expect(link).toHaveAttribute('href', expectedHref);
  }
}
