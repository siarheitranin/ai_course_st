import { test, expect } from '../src/fixtures/BaseTest';

test.describe('Home page interactions', () => {
  test('user can click main CTA', async ({ homePage }) => {
    await homePage.navigate('/');
    await homePage.clickMainCTA();

    await expect(homePage.page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
  });
});