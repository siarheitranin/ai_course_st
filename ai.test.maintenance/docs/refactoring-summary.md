# Refactoring Summary — TC-001 Main Page Navigation

**Test case:** Main Page Navigation Buttons — Docs, API, Community
**Scope:** visibility · accessibility (role + label) · correct navigation destination

---

## The Three Versions

### Version 1 — Degraded (`tests/main.navigation.spec.ts`)

Intentionally degraded spec used as a training artefact to demonstrate common test quality issues.

**Key problems introduced:**

| Problem | Code | Impact |
|---|---|---|
| CSS ID selector | `page.locator('#docs')` | Instant timeout — no `#docs` element exists on playwright.dev |
| Unscoped locators | `page.getByRole('link', { name: 'Docs' })` | Matches any link on the page, not only the nav bar |
| Removed `exact: true` | `{ name: 'API' }` | Partial match — `'API Reference'` would satisfy the locator |
| Fixed wait | `page.waitForTimeout(2000)` | Flaky on slow networks, wasteful on fast ones |
| Trivial URL pattern | `toHaveURL(/.+/)` | Any non-empty URL passes — a 404 page is indistinguishable from success |
| Missing `toBeEnabled()` | *(removed)* | `aria-disabled` links pass silently |
| Missing `toHaveAttribute('href')` | *(removed)* | `href="#"` or absent href passes silently |
| Missing nav landmark assertion | `navBar.toBeVisible()` removed | Hidden `<nav>` goes undetected |
| Mixed fixture injection | `async ({ page })` in Docs test only | Inconsistent style, POM bypassed for one test |
| Duplicated visibility checks | combined + individual tests | Same assertion in four places |

**Result:** all 7 tests pass on a green site, masking every regression category above.

---

### Version 2 — Refactored (initial repair, `tests/main.navigation.refactored.spec.ts`)

All 14 issues from `docs/legacy-test-analysis.md` addressed. Inline assertion logic replaced with
a data-driven loop over a `NAV_LINKS` constant.

**Key changes:**

| Fix | Before | After |
|---|---|---|
| Selector | `page.locator('#docs')` | `getByRole('link', { name: 'Docs', exact: true })` scoped to `navBar` via POM |
| Landmark assertion | absent | `expect(homePage.navBar).toBeVisible()` in dedicated test |
| Synchronisation | `waitForTimeout(2000)` | Removed — `toHaveURL` auto-retries until navigation settles |
| URL patterns | `/.+/` | `/\/docs/`, `/\/api/`, `/\/community/` |
| `toBeEnabled()` | absent | Restored per link |
| `toHaveAttribute('href')` | absent | Restored per link with per-link regex |
| Content check | absent | `expect(page.getByRole('main')).toBeVisible()` after each navigation |
| Title smoke check | absent | `expect(page).toHaveTitle(/Playwright/)` in `beforeEach` |
| Duplication | 4 blocks repeating same assertions | Single `for…of` loop over `NAV_LINKS` |
| Fixture injection | mixed `{ page }` / no params | Consistent: `{ page }` only in destination tests; display tests use POM only |

---

### Version 3 — Improved (final state, `tests/main.navigation.refactored.spec.ts` + `pages/HomePage.ts`)

One further improvement on top of Version 2: the three per-link assertions extracted into a named POM method.

**Change in `pages/HomePage.ts`:**

```ts
async assertLinkAccessible(link: Locator, expectedHref: RegExp): Promise<void> {
  await expect(link).toBeVisible();
  await expect(link).toBeEnabled();
  await expect(link).toHaveAttribute('href', expectedHref);
}
```

**Change in spec:**

```ts
// Version 2 — mechanics visible in the spec
await expect(link).toBeVisible();
await expect(link).toBeEnabled();
await expect(link).toHaveAttribute('href', expectedHref);

// Version 3 — spec expresses intent; POM owns the contract
await homePage.assertLinkAccessible(locator(homePage), expectedHref);
```

**Why this matters:**
- The POM becomes the single authority on what "an accessible nav link" means
- Adding a future check (e.g. `toHaveRole`) requires a change in one place only
- The spec reads as a sentence, not as a list of technical steps

---

## Side-by-side comparison

| Dimension | Degraded (v1) | Refactored (v2) | Improved (v3) |
|---|:---:|:---:|:---:|
| Tests pass on live site | ✅ (false green) | ✅ | ✅ |
| `<nav>` landmark asserted | ❌ | ✅ | ✅ |
| Selectors scoped to nav | ❌ | ✅ | ✅ |
| `exact: true` on labels | ❌ | ✅ | ✅ |
| No fixed waits | ❌ | ✅ | ✅ |
| Specific URL patterns | ❌ | ✅ | ✅ |
| `toBeEnabled()` per link | ❌ | ✅ | ✅ |
| `href` attribute validated | ❌ | ✅ | ✅ |
| Post-navigation content check | ❌ | ✅ | ✅ |
| Title smoke check | ❌ | ✅ | ✅ |
| No assertion duplication | ❌ | ✅ | ✅ |
| Accessibility contract in POM | ❌ | ❌ | ✅ |
| Spec reads as intent | ❌ | Partial | ✅ |

---

## File map

| File | Role |
|---|---|
| `tests/main.navigation.spec.ts` | Degraded spec — training artefact, left unfixed |
| `tests/main.navigation.refactored.spec.ts` | Refactored + improved spec — production-ready |
| `pages/HomePage.ts` | POM — restored locators + `assertLinkAccessible` method |
| `docs/legacy-test-analysis.md` | Full issue catalogue (14 issues, P1–P4, + 5 additional findings) |
