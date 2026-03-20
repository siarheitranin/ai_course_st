import { Page, expect } from '@playwright/test';

/**
 * Base page class containing shared functionality.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific path and wait for page to be ready.
   */
  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
    await expect(this.page.getByRole('main')).toBeVisible();
  }

  /**
   * Generic click method with automatic waiting.
   */
  async click(locator: any): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.click();
  }

  /**
   * Generic fill method with automatic waiting.
   */
  async fill(locator: any, value: string): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.fill(value);
  }
}