import { test as base } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

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

type Fixtures = {
  authPage: AuthPage;
  authUsers: AuthUsers;
  homePage: HomePage;
  loginPage: LoginPage;
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
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export const expect = test.expect;