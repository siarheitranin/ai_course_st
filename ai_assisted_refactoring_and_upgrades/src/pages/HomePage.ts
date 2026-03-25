import { Page, expect, Locator } from '@playwright/test';
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

  /**
   * Locator for user avatar on dashboard.
   */
  avatar(): Locator {
    return this.page.getByTestId('avatar');
  }

  /**
   * Locator for dashboard heading.
   */
  dashboardHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Dashboard' });
  }

  /**
   * Verify dashboard page URL and avatar visibility.
   */
  async expectDashboardLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.dashboardHeading()).toBeVisible();
    await expect(this.avatar()).toBeVisible();
  }

  /**
   * Verify profile page heading visibility.
   */
  async expectProfileLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Profile' })).toBeVisible();
  }
}