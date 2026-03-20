import { test, expect } from '../src/fixtures/BaseTest';

test.describe('Login functionality', () => {
  const testUser = { email: 'test@example.com', password: 'password123' };

  test('user can login and see dashboard', async ({ homePage, loginPage }) => {
    await loginPage.navigateAndLogin(homePage, testUser.email, testUser.password);

    await expect(homePage.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('user can login and see profile page', async ({ homePage, loginPage }) => {
    await loginPage.navigateAndLogin(homePage, testUser.email, testUser.password);

    await expect(homePage.page.getByRole('heading', { name: 'Profile' })).toBeVisible();
  });
});