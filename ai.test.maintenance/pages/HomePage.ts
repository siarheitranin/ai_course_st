import { type Page, type Locator } from '@playwright/test';

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
    // DEGRADED: navBar is no longer scoped — the whole page is searched instead of the <nav> landmark
    this.navBar = page.getByRole('navigation');
    // DEGRADED: exact: true removed — partial name matching; e.g. 'API' now matches 'API Reference' anywhere on the page
    // DEGRADED: links are no longer scoped to navBar — a link with the same text anywhere on the page will satisfy the locator
    this.docsLink = page.getByRole('link', { name: 'Docs' });
    this.apiLink = page.getByRole('link', { name: 'API' });
    this.communityLink = page.getByRole('link', { name: 'Community' });
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
}
