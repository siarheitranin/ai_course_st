import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from '../components/HeaderComponent';

/**
 * Home page object.
 */
export class HomePage extends BasePage {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(
      page,
      page.getByRole('banner')
    );
  }

  /**
   * Click main CTA button.
   */
  async clickMainCTA(): Promise<void> {
    const ctaButton = this.page.getByRole('button', { name: 'Get Started' });
    await this.click(ctaButton);
  }
}