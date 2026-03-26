import { test, expect } from '../src/fixtures/BaseTest';

test.describe('Authentication', () => {
  test('user can login successfully', async ({ authPage, authUsers, homePage }) => {
    // Initialization
    await authPage.open();

    // User actions
    await authPage.login(authUsers.valid.username, authUsers.valid.password);

    // Verification
    await expect(homePage.avatar()).toBeVisible();
  });

  test('user sees an error for invalid credentials', async ({ authPage, authUsers }) => {
    // Initialization
    await authPage.open();

    // User actions
    await authPage.login(authUsers.invalid.username, authUsers.invalid.password);

    // Verification
    await expect(authPage.errorMessage()).toBeVisible();
    await expect(authPage.errorMessage()).toContainText(/\S+/);
  });
});
