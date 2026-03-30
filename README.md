# Playwright Test Automation Framework

A production-ready end-to-end test automation framework built with **TypeScript**, **Playwright**, and **GitHub Actions**. Demonstrates Page Object Model architecture, role-based locators, parallel execution, and a full CI/CD pipeline with automated reporting.

---

## Repository layout

This repository contains two independent subprojects, each representing a different stage of AI-assisted test automation work:

| Subproject | Purpose | CI/CD |
|---|---|---|
| [`ai.test.maintenance/`](./ai.test.maintenance/) | **Primary portfolio project.** Tests [playwright.dev](https://playwright.dev) against a live public URL. Full POM hierarchy, 31 passing tests, GitHub Actions pipeline, Pages report. | Runs on every PR and push to `main` |
| [`ai_assisted_refactoring_and_upgrades/`](./ai_assisted_refactoring_and_upgrades/) | **Framework architecture reference.** Demonstrates an advanced POM pattern: fixtures, reusable components, 8 page classes, and centralized test data. Tests target `http://localhost:3000` and require a local backend to execute. | Excluded from CI — no public backend available |

The sections below describe `ai.test.maintenance`, which is the runnable, CI-verified project.

---

## What this framework does

- Validates the navigation structure and accessibility contract of [playwright.dev](https://playwright.dev)
- Runs **32 automated tests** across 5 spec files in parallel (3 workers)
- Publishes an interactive HTML test report to **GitHub Pages** on every merge to `main`
- Scans dependencies for high/critical vulnerabilities on every PR and push
- Notifies Microsoft Teams on failure (when webhook is configured)

---

## Technology stack

| Layer | Tool |
|---|---|
| Language | TypeScript (strict mode) |
| Test runner | Playwright |
| Architecture | Page Object Model |
| CI/CD | GitHub Actions |
| Reporting | Playwright HTML report + GitHub Pages |
| Security | `npm audit` |

---

## Project structure

```
ai.test.maintenance/
├── pages/
│   ├── BasePage.ts                        # Abstract base: navigate(), waitForPageLoad(), getTitle()
│   ├── HomePage.ts                        # playwright.dev home — nav locators, accessibility assertions
│   └── DocsPage.ts                        # playwright.dev/docs/intro — sidebar, heading, edit link
├── tests/
│   ├── home.spec.ts                       # Smoke: title, Get Started link
│   ├── docs.spec.ts                       # Docs page: URL, heading, sidebar, cross-page nav
│   ├── main.navigation.professional.spec.ts  # Full nav suite: a11y contract, order, edge cases
│   ├── main.navigation.refactored.spec.ts    # Chapter 3: refactored version (data-driven)
│   └── main.navigation.spec.ts           # Training artefact: intentionally degraded patterns
├── playwright.config.ts                   # workers: 3, retries: 2 in CI, HTML reporter
├── tsconfig.json
└── package.json
.github/
└── workflows/
    └── playwright-tests.yml              # CI: test → security scan → Pages deploy
```

---

## Setup

**Prerequisites:** Node.js 18 LTS or later

```bash
# Clone the repository
git clone https://github.com/siarheitranin/ai_course_st.git
cd ai_course_st/ai.test.maintenance

# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps
```

---

## Running tests

```bash
# Run all tests (headless, 3 parallel workers)
npm test

# Run with browser visible
npm run test:headed

# Run a single spec file
npx playwright test tests/docs.spec.ts

# Run by tag
npx playwright test --grep @smoke

# Open last HTML report
npm run test:report
```

---

## Page Object Model architecture

```
BasePage  (abstract)
├── navigate(path)         protected — all URL transitions go through here
├── waitForPageLoad()      domcontentloaded gate for explicit readiness checks
└── getTitle()             returns document title without importing expect

HomePage  extends BasePage
├── Locators: getStartedLink, navBar, docsLink, apiLink, communityLink
├── goto()                 navigates to /
├── clickDocs/Api/Community()
├── assertLinkAccessible() full a11y contract: visible, enabled, valid href, not aria-hidden
└── getNavLinkLabelsInDOMOrder()

DocsPage  extends BasePage
├── Locators: pageHeading, sidebar, mainContent, codeBlock, nextPageLink
├── goto()                 navigates to /docs/intro
├── clickSidebarLink(label)
└── getSidebarCategoryLabels()
```

New pages extend `BasePage`, declare their locators in the constructor, and implement `goto()`. No page stores state between tests.

---

## Test coverage

| Spec | Tests | Tags | Purpose |
|---|---|---|---|
| `home.spec.ts` | 2 | — | Title and Get Started navigation |
| `docs.spec.ts` | 7 | `@smoke @docs` | Docs page structure and cross-page nav |
| `main.navigation.professional.spec.ts` | 9 | `@smoke @navigation` | Full nav a11y contract + edge cases |
| `main.navigation.refactored.spec.ts` | 7 | `@smoke @navigation` | Data-driven nav suite (Chapter 3) |
| `main.navigation.spec.ts` | 6 + 1 fixme | — | Training artefact: legacy degraded patterns |

**Total: 32 tests — 31 active, 1 `test.fixme` (intentional training artefact)**

---

## CI/CD pipeline

Every pull request and push to `main` triggers three parallel jobs:

```
pull_request / push to main
├── playwright-tests        Installs, runs all tests, uploads HTML report + traces
│   └── (on main only)      Prepares history.json, uploads Pages artifact
├── security-scan           npm audit --audit-level=high, writes step summary
└── (on main only)
    deploy-pages            Deploys HTML report to GitHub Pages
```

**Live report:** https://siarheitranin.github.io/ai_course_st/

Artifacts available for download on every run (14-day retention):
- `playwright-html-report` — interactive pass/fail report with screenshots
- `playwright-traces` — Playwright trace files for failed tests (open with `npx playwright show-trace`)

> `ai_assisted_refactoring_and_upgrades` is not included in the pipeline. Its tests require a
> running backend at `http://localhost:3000` which is not available in a public CI environment.
> The subproject is included as an architecture reference demonstrating fixtures, reusable
> components, and multi-page POM patterns. See its own
> [`README`](./ai_assisted_refactoring_and_upgrades/README.md) for local setup instructions.

---

## Good practices demonstrated

- **Role-based locators** — `getByRole('link', { name: '...' })` throughout; no CSS selectors or XPath in production specs
- **No hard waits** — all assertions use Playwright's built-in auto-retry; `waitForTimeout` exists only in the intentionally degraded training artefact
- **Typed interfaces** — strict TypeScript, all locators typed as `Locator`, all methods return typed `Promise<void>` or `Promise<T>`
- **Data-driven tests** — `NAV_LINKS` table drives all per-link tests; adding a nav item requires a one-line change
- **Accessibility coverage** — `assertLinkAccessible` checks WCAG 4.1.2 and 2.4.4 (enabled, valid href, not aria-hidden, no forced new tab)
- **Retries in CI** — `retries: 2` in CI catches network flakiness without hiding real failures

---

## AI usage note

This framework was built with AI assistance (Claude). All generated code was reviewed, tested, and validated before commit. The commit history reflects iterative improvements — including deliberate introduction and then correction of test quality issues — as a practical demonstration of AI-assisted test maintenance and responsible review.

---

## Local development tips

```bash
# Run only smoke tests
npx playwright test --grep @smoke

# Debug a specific test interactively
npx playwright test tests/docs.spec.ts --debug

# Generate a trace for a test run
npx playwright test --trace on

# View a trace file
npx playwright show-trace test-results/<test-name>/trace.zip
```
