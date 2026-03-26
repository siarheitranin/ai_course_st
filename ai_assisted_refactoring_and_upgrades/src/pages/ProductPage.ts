import { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { BasePage } from './BasePage';

/**
 * Product page object.
 */
export class ProductPage extends BasePage {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page, page.getByRole('banner'));
  }

  /**
   * Add-to-cart button locator.
   */
  addToCart(): Locator {
    return this.page.getByTestId('add-to-cart-btn');
  }

  /**
   * Product title locator.
   */
  title(): Locator {
    return this.page.getByTestId('product-title');
  }

  /**
   * Product price locator.
   */
  price(): Locator {
    return this.page.getByTestId('product-price');
  }
}
