# Legacy Test Analysis — Chapter 2

**File under review:** `tests/main.navigation.spec.ts`
**Supporting POM:** `pages/HomePage.ts`
**Manual test case (source of truth):** TC-001 — Main Page Navigation Buttons: Docs, API, Community
**Scope:** visibility · accessibility (role + label) · correct navigation destination

> No code changes applied in Chapter 2.

---

## Manual Test Case Expectations (Source of Truth)

| # | Expectation |
|---|---|
| E1 | Page loads `https://playwright.dev` successfully |
| E2 | A `<nav>` navigation landmark is visible on the page |
| E3 | A **Docs** link is visible, accessible by role + label, enabled, has a valid href, and navigates to the Docs page |
| E4 | An **API** link is visible, accessible by role + label, enabled, has a valid href, and navigates to the API page |
| E5 | A **Community** link is visible, accessible by role + label, enabled, has a valid href, and navigates to the Community page |

---

## Prioritized Issue Checklist

### P1 — Critical: Immediate failure or silent false positive

- [ ] **[SEL-1] CSS ID selector `#docs` will always fail**
  - Location: `tests/main.navigation.spec.ts:29`
  - `page.locator('#docs')` — `playwright.dev` has no element with `id="docs"`; the test immediately throws a locator-not-found timeout on every run
  - Even if the ID existed, a `<span id="docs">` would satisfy it equally — no role or label is verified
  - **Impact:** permanent test failure; completely masks the actual Docs link behaviour

- [ ] **[SYNC-1] Fixed `waitForTimeout(2000)` instead of state-based assertion**
  - Location: `tests/main.navigation.spec.ts:53`
  - `await homePage.page.waitForTimeout(2000)` unconditionally pauses 2 s before checking the URL
  - Too short on a slow CI network → race condition → flaky failure; always wasteful on a fast machine
  - The subsequent `toHaveURL(/.+/)` is unaffected by whether the navigation even started
  - **Impact:** flakiness in CI; 2 s added to every run of this test regardless of actual load time

- [ ] **[COV-1] URL pattern `/.+/` accepts any non-empty string**
  - Location: `tests/main.navigation.spec.ts:54, 60, 66`
  - Matches the home page URL, a 404 page, a redirect loop, or any other destination
  - The three "Navigation destinations" tests provide zero meaningful verification
  - **Impact:** navigation regressions (wrong destination, broken route) go completely undetected

- [ ] **[SEL-2] Link locators not scoped to the `<nav>` landmark**
  - Location: `pages/HomePage.ts:18–20`
  - `page.getByRole('link', { name: 'Docs' })` searches the entire DOM
  - If the nav bar is removed and same-named links exist in a footer or body, all display tests pass falsely
  - **Impact:** the nav bar can vanish and tests remain green — false confidence

---

### P2 — High: Coverage gap or accessibility regression undetected

- [ ] **[A11Y-1] `<nav>` landmark visibility never asserted**
  - Location: `tests/main.navigation.spec.ts:18–23`
  - `homePage.navBar` is defined in the POM but `expect(homePage.navBar).toBeVisible()` was removed
  - A hidden or removed `<nav>` element goes undetected (especially combined with SEL-2 above)
  - **Impact:** structural accessibility regression (landmark navigation for screen readers) invisible to the suite

- [ ] **[A11Y-2] `toBeEnabled()` missing from all three individual link tests**
  - Location: `tests/main.navigation.spec.ts:31, 37, 43` (commented out)
  - A link carrying `aria-disabled="true"` is visible but non-interactive for keyboard and AT users
  - All three display tests would pass for a fully disabled nav
  - **Impact:** silent accessibility regression; disabled nav links go undetected

- [ ] **[A11Y-3] `toHaveAttribute('href', /pattern/)` missing from all three individual link tests**
  - Location: `tests/main.navigation.spec.ts:32, 38, 44` (commented out)
  - A link with `href="#"` or no `href` is visible and enabled but does not navigate
  - Decorative anchors used to replace real links would pass all current assertions
  - **Impact:** broken navigation (no real destination) is invisible to the display tests

- [ ] **[SEL-3] `exact: true` removed from all three POM locators**
  - Location: `pages/HomePage.ts:18–20`
  - `{ name: 'API' }` without `exact: true` matches any element whose accessible name *contains* the word (e.g., `'API Reference'`, `'API docs v2'`)
  - Unintended elements anywhere on the page can satisfy the locator
  - **Impact:** wrong elements silently pass assertions; real nav links may never be exercised

---

### P3 — Medium: Maintainability, coverage completeness, consistency

- [ ] **[COV-2] No page content assertion after navigation**
  - Location: `tests/main.navigation.spec.ts:47–68`
  - After clicking a nav link, only a URL check (weakly expressed) is present
  - No heading, landmark, or content assertion confirms the destination page actually rendered
  - **Impact:** a correct-looking URL redirect to a blank or broken page passes undetected

- [ ] **[READ-1] Inconsistent test function signature — `{ page }` injected in Docs test only**
  - Location: `tests/main.navigation.spec.ts:25` vs lines 35, 41
  - The Docs display test injects the raw `page` fixture and bypasses the POM; the API and Community tests do not
  - Different patterns in the same `describe` block increase cognitive load and signal architectural inconsistency
  - **Impact:** maintenance cost; reviewers must context-switch between POM and raw-fixture style mid-suite

- [ ] **[DUP-1] Visibility assertions duplicated between combined and individual tests**
  - Location: `tests/main.navigation.spec.ts:20–22` and `30, 36, 42`
  - The combined test already checks `docsLink`, `apiLink`, `communityLink` visibility; the three individual tests repeat the same check
  - When the combined test fails, the individual tests fail with identical signal — noise with no diagnostic value added
  - **Impact:** maintenance duplication; a locator rename requires updates in four places

- [ ] **[ENC-1] `homePage.page` accessed directly in the spec**
  - Location: `tests/main.navigation.spec.ts:53, 54, 60, 66`
  - `homePage.page.waitForTimeout(...)` and `expect(homePage.page).toHaveURL(...)` pierce the page object abstraction
  - Couples the spec to the internal structure of `HomePage`; moving to a different POM shape requires spec edits
  - **Impact:** maintenance cost; breaks encapsulation principle of POM

---

### P4 — Low: Style, readability, future hygiene

- [ ] **[READ-2] Diagnostic `// DEGRADED:` comments embedded in production spec**
  - Location: `tests/main.navigation.spec.ts:19, 26–28, 31–32, 37–38, 43–44, 50–52, 59, 65`
  - Diagnostic annotations describe missing assertions rather than documenting intent
  - In the final spec these will cause confusion — they are analysis notes, not executable documentation
  - **Impact:** readability noise; incorrect framing for future maintainers

- [ ] **[READ-3] Nested `test.describe('Navigation destinations', ...)` inside outer describe**
  - Location: `tests/main.navigation.spec.ts:47`
  - Adds one indentation level to all destination tests; the Playwright HTML report shows a compound path
  - A flat naming convention (`'Docs link — navigates to the Docs page'`) achieves the same grouping more legibly
  - **Impact:** minor; affects HTML report readability and test ID verbosity

---

## Summary Matrix

| ID | Category | Priority | Flakiness risk | False-positive risk | a11y coverage gap | Maintenance cost |
|---|---|:---:|:---:|:---:|:---:|:---:|
| SEL-1 | Selector quality | P1 | — | — | Yes | High |
| SYNC-1 | Synchronization | P1 | High | — | — | Medium |
| COV-1 | Coverage | P1 | — | High | — | High |
| SEL-2 | Selector quality | P1 | — | High | Yes | High |
| A11Y-1 | Accessibility | P2 | — | High | Yes | Medium |
| A11Y-2 | Accessibility | P2 | — | High | Yes | Medium |
| A11Y-3 | Accessibility | P2 | — | High | Yes | Medium |
| SEL-3 | Selector quality | P2 | — | High | — | Medium |
| COV-2 | Coverage | P3 | — | Medium | — | Low |
| READ-1 | Readability | P3 | — | — | — | Medium |
| DUP-1 | Duplication | P3 | — | — | — | Medium |
| ENC-1 | Encapsulation | P3 | — | — | — | Medium |
| READ-2 | Readability | P4 | — | — | — | Low |
| READ-3 | Readability | P4 | — | — | — | Low |

---

## Additional Findings (Beyond AI-Detected Degradations)

These issues were not introduced as explicit degradations but arise from the current spec structure:

### F1 — No smoke-level title assertion on landing
The `beforeEach` navigates to `/` but never asserts `expect(page).toHaveTitle(/Playwright/)`. If the CDN serves a stale or wrong page, all tests run against unexpected content and may produce misleading results.

### F2 — `clickDocs()` on `homePage` may interact with the degraded, unscoped locator
`homePage.clickDocs()` delegates to `this.docsLink.click()`, which is the unscoped `page.getByRole('link', { name: 'Docs' })` locator (SEL-2 + SEL-3). Since playwright.dev renders multiple links with text "Docs" across the page (nav, mobile menu, sidebar), `.click()` will throw a strict-mode error if Playwright's strict mode is enabled, or silently click the wrong element otherwise.

### F3 — Missing `page.waitForLoadState()` between click and assertion in destination tests
After `clickDocs()` / `clickApi()` / `clickCommunity()`, there is no `waitForLoadState('networkidle')` or `waitForURL(...)` call (beyond the broken `waitForTimeout`). The URL assertion may run against the in-progress navigation URL rather than the settled destination. The auto-retrying `toHaveURL` assertion partially mitigates this, but only when the timeout is generous enough.

### F4 — `homePage` variable declared with `let` at describe scope
`let homePage: HomePage` is initialised in `beforeEach`. If a test were to mutate `homePage` (e.g., reassign it), that mutation would carry over silently — `let` does not protect against this. `const` cannot be used in this pattern, but it is a known footgun in shared-state `beforeEach` setups.

### F5 — No negative / boundary test cases for navigation
The manual test case focuses on the happy path. There are no tests confirming that:
- A broken/missing nav link is detected (negative scenario)
- The nav is still functional after a JS error on the page
- Mobile viewport does not hide or collapse the nav (responsiveness gap)

---

## Recommended Fix Categories (for Chapter 3 Refactor)

| Fix category | Issues addressed |
|---|---|
| **Restore role/label selectors with `exact: true` scoped to `<nav>`** | SEL-1, SEL-2, SEL-3, F2 |
| **Replace `waitForTimeout` with `toHaveURL(/specific-pattern/)` auto-retry** | SYNC-1, COV-1, F3 |
| **Restore `navBar.toBeVisible()`, `toBeEnabled()`, `toHaveAttribute('href')`** | A11Y-1, A11Y-2, A11Y-3 |
| **Add page-content assertion (heading) after each navigation** | COV-2 |
| **Align all test signatures to POM style — remove raw `page` injection** | READ-1, ENC-1 |
| **Remove duplication — merge individual display tests or scope assertions** | DUP-1 |
| **Strip diagnostic comments, add intent-level JSDoc** | READ-2, READ-3 |
| **Add `toHaveTitle` smoke check in `beforeEach`** | F1 |
