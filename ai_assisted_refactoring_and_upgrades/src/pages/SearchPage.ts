import { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { BasePage } from './BasePage';

/**
 * Search page object.
 */
export class SearchPage extends BasePage {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page, page.getByRole('banner'));
  }

  /**
   * Open search page.
   */
  async open(): Promise<void> {
    await this.navigate('/search');
  }

  /**
   * Search query input locator.
   */
  queryInput(): Locator {
    return this.page.getByTestId('search-input');
  }

  /**
   * Search submit button locator.
   */
  submit(): Locator {
    return this.page.getByTestId('search-submit');
  }

  /**
   * Product result locator by name.
   */
  productResult(name: string): Locator {
    return this.page.getByTestId('product-result').filter({ hasText: name });
  }
}
