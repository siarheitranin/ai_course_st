import { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { BasePage } from './BasePage';

/**
 * Cart page object.
 */
export class CartPage extends BasePage {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page, page.getByRole('banner'));
  }

  /**
   * Cart items locator.
   */
  items(): Locator {
    return this.page.getByTestId('cart-item');
  }

  /**
   * Proceed-to-checkout button locator.
   */
  proceedToCheckout(): Locator {
    return this.page.getByTestId('checkout-btn');
  }
}
