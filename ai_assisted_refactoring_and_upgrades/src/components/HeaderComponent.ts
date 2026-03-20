import { BaseComponent } from './BaseComponent';

/**
 * Header component with navigation actions.
 */
export class HeaderComponent extends BaseComponent {
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