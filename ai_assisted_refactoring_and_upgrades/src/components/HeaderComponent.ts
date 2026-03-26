import { BaseComponent } from './BaseComponent';
import { Locator } from '@playwright/test';

/**
 * Header component with navigation actions.
 */
export class HeaderComponent extends BaseComponent {
  /**
   * Cart badge locator.
   */
  cartBadge(): Locator {
    return this.root.getByTestId('cart-badge');
  }

  /**
   * Click login button in header.
   */
  async clickLogin(): Promise<void> {
    await this.root.getByRole('button', { name: 'Login' }).click();
  }

  /**
   * Click profile button in header.
   */
  async clickProfile(): Promise<void> {
    await this.root.getByTestId('profile-button').click();
  }
}