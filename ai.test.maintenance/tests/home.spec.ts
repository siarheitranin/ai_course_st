import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Playwright Home Page', () => {
  test('has title', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(page).toHaveTitle(/Playwright/);
  });

  test('get started link navigates to installation docs', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.clickGetStarted();

    await expect(page).toHaveURL(/.*intro/);
  });
});
