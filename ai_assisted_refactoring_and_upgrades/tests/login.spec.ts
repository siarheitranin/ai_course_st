import { test } from '../src/fixtures/BaseTest';

test.describe('Login functionality', () => {
  const testUser = { email: 'test@example.com', password: 'password123' };

  test('user can login and see dashboard', async ({ homePage, loginPage }) => {
    // Initialization
    await homePage.navigate('/');
    await homePage.header.clickLogin();

    // User actions
    await loginPage.fillField('Email', testUser.email);
    await loginPage.fillField('Password', testUser.password);
    await loginPage.clickRememberMe();
    await loginPage.submit();

    // Verification
    await homePage.expectDashboardLoaded();
  });

  test('user can login and see profile page', async ({ homePage, loginPage }) => {
    await loginPage.navigateAndLogin(homePage, testUser.email, testUser.password);
    await homePage.expectProfileLoaded();
  });
});