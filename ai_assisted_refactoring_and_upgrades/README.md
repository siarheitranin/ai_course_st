# Playwright TypeScript Framework

This repository holds a simple Playwright framework using TypeScript and page objects.

## Project Structure

```text
.
|-- src/
|   |-- components/
|	|	|-- BaseComponent.ts
|	|	`-- HeaderComponent.ts
|   |-- fixtures/
|	|	`-- BaseTest.ts
|   |-- pages/
|	|	|-- BasePage.ts
|	|	|-- HomePage.ts
|	|	`-- LoginPage.ts
|   |-- utils/
|	|	|-- envHelper.ts
|	|	`-- logger.ts
|-- `tests/
|	|-- example.spec.ts
|	|-- home.spec.ts
|	`-- login.spec.ts
`-- playwright.config.ts	
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   npx playwright install
   ```
2. Run tests:
   ```bash
   npx playwright test --ui
   ```
3. Generate Report:
   ```bash
   npx playwright show-report
   ```
   