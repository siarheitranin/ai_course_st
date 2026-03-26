# Playwright TypeScript Framework

This repository holds a simple Playwright framework using TypeScript and page objects.

## Project Structure

```text
.
|-- src/
|   |-- components/
|   |   |-- BaseComponent.ts
|   |   `-- HeaderComponent.ts
|   |-- fixtures/
|   |   `-- BaseTest.ts
|   |-- pages/
|   |   |-- AuthPage.ts
|   |   |-- BasePage.ts
|   |   |-- CartPage.ts
|   |   |-- CheckoutPage.ts
|   |   |-- HomePage.ts
|   |   |-- LoginPage.ts
|   |   |-- ProductPage.ts
|   |   |-- ResultsPage.ts
|   |   `-- SearchPage.ts
|   |-- utils/
|   |   |-- envHelper.ts
|   |   `-- logger.ts
|-- tests/
|   |-- auth.spec.ts
|   |-- checkout.spec.ts
|   |-- example.spec.ts
|   |-- home.spec.ts
|   |-- login.spec.ts
|   `-- search.spec.ts
|-- playwright.config.ts
`-- package.json
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   npx playwright install
   ```
2. Set base URL (required):
   ```bash
   # PowerShell
   $env:BASE_URL = "http://localhost:3000"
   ```
3. Run tests:
   ```bash
   npx playwright test --ui
   ```
   or run a single spec:
   ```bash
   npx playwright test tests/login.spec.ts --project=chromium
   ```
4. Generate report:
   ```bash
   npx playwright show-report
   ```

## Test Data Fixtures

Shared test data is configured in `src/fixtures/BaseTest.ts` and injected into specs via custom fixtures:

- `authUsers`
   - `valid`: username/password for positive auth scenarios
   - `invalid`: username/password for negative auth scenarios
- `checkoutData`
   - `searchQuery`, `productName`, `expectedCartBadge`, `expectedTotal`
- `searchData`
   - `query`, `filterName`, `maxPrice`

Use these fixtures in tests instead of hardcoding values in spec files.
   