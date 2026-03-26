import { test as base } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { ResultsPage } from '../pages/ResultsPage';
import { SearchPage } from '../pages/SearchPage';

/**
 * Custom test fixtures.
 */
type AuthUser = {
  username: string;
  password: string;
};

type AuthUsers = {
  valid: AuthUser;
  invalid: AuthUser;
};

type CheckoutData = {
  expectedCartBadge: string;
  expectedTotal: string;
  productName: string;
  searchQuery: string;
};

type SearchData = {
  filterName: string;
  maxPrice: number;
  query: string;
};

type Fixtures = {
  authPage: AuthPage;
  authUsers: AuthUsers;
  cartPage: CartPage;
  checkoutData: CheckoutData;
  checkoutPage: CheckoutPage;
  homePage: HomePage;
  loginPage: LoginPage;
  productPage: ProductPage;
  resultsPage: ResultsPage;
  searchData: SearchData;
  searchPage: SearchPage;
};

export const test = base.extend<Fixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  authUsers: async ({}, use) => {
    await use({
      valid: {
        username: 'demo-user',
        password: 'demo-pass',
      },
      invalid: {
        username: 'invalid-user',
        password: 'invalid-pass',
      },
    });
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutData: async ({}, use) => {
    await use({
      expectedCartBadge: '1',
      expectedTotal: '$100',
      productName: 'Demo Product',
      searchQuery: 'Demo Product',
    });
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  resultsPage: async ({ page }, use) => {
    await use(new ResultsPage(page));
  },
  searchData: async ({}, use) => {
    await use({
      filterName: 'Price < $1000',
      maxPrice: 1000,
      query: 'Laptop',
    });
  },
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
});

export const expect = test.expect;