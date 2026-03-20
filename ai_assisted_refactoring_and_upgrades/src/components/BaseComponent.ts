import { Page, Locator } from '@playwright/test';

/**
 * Base component class for reusable UI components.
 */
export abstract class BaseComponent {
  protected readonly page: Page;
  protected readonly root: Locator;

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.root = root;
  }
}