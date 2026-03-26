import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Auth page object.
 */
export class AuthPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Open auth page.
   */
  async open(): Promise<void> {
    await this.navigate('/login');
  }

  /**
   * Username input locator.
   */
  username(): Locator {
    return this.page.getByTestId('username-input');
  }

  /**
   * Password input locator.
   */
  password(): Locator {
    return this.page.getByTestId('password-input');
  }

  /**
   * Submit button locator.
   */
  submit(): Locator {
    return this.page.getByTestId('login-btn');
  }

  /**
   * Login error message locator.
   */
  errorMessage(): Locator {
    return this.page.getByTestId('error-message');
  }

  /**
   * Perform login action.
   */
  async login(user: string, pass: string): Promise<void> {
    await this.fill(this.username(), user);
    await this.fill(this.password(), pass);
    await this.click(this.submit());
  }
}
