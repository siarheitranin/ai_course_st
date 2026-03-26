import { test, expect } from '../src/fixtures/BaseTest';

test.describe('Checkout flow', () => {
  test('user can search, add to cart, and verify checkout total', async ({
    cartPage,
    checkoutData,
    checkoutPage,
    productPage,
    searchPage,
  }) => {
    // Initialization
    await searchPage.open();

    // User actions
    await searchPage.queryInput().fill(checkoutData.searchQuery);
    await searchPage.submit().click();
    await expect(searchPage.productResult(checkoutData.productName)).toBeVisible();
    await searchPage.productResult(checkoutData.productName).click();
    await expect(productPage.title()).toHaveText(checkoutData.productName);
    await expect(productPage.price()).toHaveText(checkoutData.expectedTotal);
    await productPage.addToCart().click();

    // Verification
    await expect(productPage.header.cartBadge()).toHaveText(checkoutData.expectedCartBadge);

    // User actions
    await productPage.header.cartBadge().click();
    await expect(cartPage.items()).toContainText(checkoutData.productName);
    await cartPage.proceedToCheckout().click();

    // Verification
    await expect(checkoutPage.total()).toBeVisible();
    await expect(checkoutPage.total()).toHaveText(checkoutData.expectedTotal);
  });
});
