import { type Page } from '@playwright/test';

/**
 * BasePage — abstract root for all Page Object classes.
 *
 * Responsibilities:
 *  - Holds the shared `page` reference so concrete classes never re-declare it.
 *  - Provides `navigate(path)` as the single gateway for all URL transitions;
 *    concrete pages call it from their own `goto()` with a fixed path.
 *  - Provides `waitForPageLoad()` as a semantic alias for `domcontentloaded`,
 *    used when a step needs an explicit readiness gate beyond auto-wait.
 *
 * Concrete pages extend this class and add their own typed locators and
 * action methods. They must implement `goto()` to navigate to their URL.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a path relative to the configured `baseURL`.
   * All concrete page `goto()` methods delegate here.
   */
  protected async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Wait for the DOM to be ready. Playwright's auto-wait covers most cases;
   * call this only when a step explicitly needs a load-state gate.
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Return the visible document title. Useful in cross-page navigation tests
   * without importing `expect` into every helper.
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
