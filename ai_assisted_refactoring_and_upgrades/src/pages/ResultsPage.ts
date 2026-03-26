import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Search results page object.
 */
export class ResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * All result items locator.
   */
  items(): Locator {
    return this.page.getByTestId('result-item');
  }

  /**
   * Title locator for a result by index.
   */
  titleOf(index: number): Locator {
    return this.items().nth(index).locator('.title');
  }

  /**
   * Price locator for a result by index.
   */
  priceOf(index: number): Locator {
    return this.items().nth(index).locator('.price');
  }

  /**
   * Get all result prices as numeric values.
   */
  async getAllPrices(): Promise<number[]> {
    const count = await this.items().count();
    const prices: number[] = [];

    for (let index = 0; index < count; index += 1) {
      const rawPrice = (await this.priceOf(index).innerText()).trim();
      const numericPrice = Number(rawPrice.replace(/[^\d.]/g, ''));
      prices.push(numericPrice);
    }

    return prices;
  }
}
