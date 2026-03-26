import { test, expect } from '../src/fixtures/BaseTest';

test.describe('Search flow', () => {
  test('user sees only items under selected price filter', async ({
    resultsPage,
    searchData,
    searchPage,
  }) => {
    // Initialization: open search page
    await searchPage.open();

    // User actions: type "Laptop", apply filter "Price < $1000"
    await searchPage.queryInput().fill(searchData.query);
    await searchPage.submit().click();
    await searchPage.applyFilter(searchData.filterName).click();

    // Verification: each result price < 1000
    await expect(resultsPage.items().first()).toBeVisible();
    const prices = await resultsPage.getAllPrices();
    expect(prices.length).toBeGreaterThan(0);

    for (const price of prices) {
      expect(price).toBeLessThan(searchData.maxPrice);
    }
  });
});
