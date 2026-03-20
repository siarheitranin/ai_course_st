import { test, expect } from '../src/fixtures/BaseTest';

test.describe('Example flow', () => {
  const testUser = { email: 'test@example.com', password: 'password123' };

  test('user can login and access dashboard', async ({ homePage, loginPage }) => {
    await loginPage.navigateAndLogin(homePage, testUser.email, testUser.password);
    await expect(homePage.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('user can login and access profile', async ({ homePage, loginPage }) => {
    await loginPage.navigateAndLogin(homePage, testUser.email, testUser.password);
    await expect(homePage.page.getByRole('heading', { name: 'Profile' })).toBeVisible();
  });
});