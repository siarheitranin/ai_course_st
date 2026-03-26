import { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { BasePage } from './BasePage';

/**
 * Checkout page object.
 */
export class CheckoutPage extends BasePage {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page, page.getByRole('banner'));
  }

  /**
   * Checkout total locator.
   */
  total(): Locator {
    return this.page.getByTestId('{{newTestId}}');
  }

  /**
   * Place-order button locator.
   */
  placeOrder(): Locator {
    return this.page.getByTestId('place-order-btn');
  }
}
