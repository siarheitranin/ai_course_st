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
}
