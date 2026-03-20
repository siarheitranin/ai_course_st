import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HomePage } from './HomePage';

/**
 * Login page object.
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Fill input field by label.
   */
  async fillField(label: 'Email' | 'Password', value: string): Promise<void> {
    const input = this.page.getByLabel(label);
    await this.fill(input, value); // Uses BasePage.fill with auto-wait
  }

  /**
   * Perform login action.
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillField('Email', email);
    await this.fillField('Password', password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  /**
   * Navigate home and perform login in a single step.
   */
  async navigateAndLogin(homePage: HomePage, email: string, password: string): Promise<void> {
    await homePage.navigate('/');
    await homePage.header.clickLogin();
    await this.login(email, password);
  }
}