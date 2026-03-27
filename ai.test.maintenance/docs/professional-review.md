# Professional Review — TC-NAV-001 Main Page Navigation

**File under review:** `tests/main.navigation.professional.spec.ts`
**Supporting POM:** `pages/HomePage.ts`
**Based on:** `tests/main.navigation.refactored.spec.ts` (Chapter 3 output)
**Manual test case (source of truth):** TC-NAV-001 — Main Page Navigation Buttons: Docs, API, Community

---

## Professional Standards Checklist

### 1. Traceability

| Item | Verdict | Detail |
|---|:---:|---|
| Test case ID in file header | ✅ | `TC-NAV-001` in JSDoc header (line 2) |
| Test case ID attached to report output | ✅ | `test.info().annotations.push({ type: 'TestCase', description: 'TC-NAV-001' })` in `beforeEach` (line 60) — ID appears in HTML and JUnit reports |
| Tags for filtering | ✅ | `@smoke` and `@navigation` on `test.describe` (line 55) |
| Manual expectation IDs in comments | ✅ | E1–E5 referenced in the file header and section comments |

### 2. Coverage

| Item | Verdict | Detail |
|---|:---:|---|
| Positive: all expected links present and accessible | ✅ | Per-link loop covers all three links (lines 85–95) |
| Positive: each link reaches the correct destination | ✅ | Destination loop with domain-scoped URL + heading checks (lines 107–119) |
| Negative: `aria-hidden` blocks AT access | ✅ | Asserted inside `assertLinkAccessible` (POM line 50) |
| Negative: forced `target="_blank"` breaks keyboard flow | ✅ | `not.toHaveAttribute('target', '_blank')` per-link loop (line 93) |
| Edge: unexpected link count | ✅ | `count()` vs `NAV_LINKS.length` (lines 129–132) |
| Edge: link order reordered without changing content | ✅ | DOM-order check via `getNavLinkLabelsInDOMOrder()` (lines 148–151) |
| Negative: page title mismatch / wrong page served | ✅ | `toHaveTitle(/Playwright/)` in `beforeEach` (line 66) |

### 3. Maintainability

| Item | Verdict | Detail |
|---|:---:|---|
| Single source of truth for link data | ✅ | `NAV_LINKS` constant (lines 30–53); adding a link requires one table entry |
| No duplicated assertions | ✅ | All per-link checks data-driven; no copy-paste blocks |
| POM owns accessibility contract | ✅ | `assertLinkAccessible` centralises four assertions |
| POM exposes DOM-order utility | ✅ | `getNavLinkLabelsInDOMOrder()` added to `HomePage.ts` |
| `page` not exposed through POM | ✅ | `{ page }` fixture used directly in destination tests; `homePage.page` never referenced |
| Type safety | ✅ | `NavLink` type with JSDoc on regex fields (lines 20–28) |

### 4. Clarity

| Item | Verdict | Detail |
|---|:---:|---|
| Test titles express intent, not mechanics | ✅ | "…satisfies the accessibility contract", "…navigates to the correct destination" |
| Section comments explain rationale | ✅ | Each block comment states *why*, not *what was fixed* |
| No changelog-style comments | ✅ | All "Fixes applied vs legacy spec" blocks removed |
| Inline comments explain non-obvious decisions | ✅ | API nesting note (line 40), DOM vs visual order (lines 144–146) |

### 5. Validation Quality

| Item | Verdict | Detail |
|---|:---:|---|
| Anchored href regex | ✅ | `/^\/docs/`, `/^\/docs\/api/`, `/^\/community/` — prefix-only match rejected |
| Domain-scoped URL regex | ✅ | `/playwright\.dev\/docs/` etc. — cross-domain redirect cannot pass |
| API path corrected to real href | ✅ | `/^\/docs\/api/` matches actual href `/docs/api/class-playwright` |
| Heading non-empty check | ✅ | `toContainText(/\w+/)` ensures the heading has content, not just visibility |
| No fixed waits | ✅ | All synchronisation via Playwright auto-retry assertions |

### 6. Accessibility / Compliance

| Item | Verdict | Detail |
|---|:---:|---|
| WCAG 4.1.2 Name, Role, Value | ✅ | `getByRole('link', { name, exact: true })` scoped to `<nav>`; `toBeEnabled()` |
| WCAG 2.4.4 Link Purpose | ✅ | Exact accessible name required; partial match rejected by `exact: true` |
| AT visibility (`aria-hidden`) | ✅ | `not.toHaveAttribute('aria-hidden', 'true')` in POM |
| Keyboard navigation preservation | ✅ | `not.toHaveAttribute('target', '_blank')` |

---

## Diff Summary: Refactored → Professional

### `pages/HomePage.ts`

| Change | Location | Reason |
|---|---|---|
| `assertLinkAccessible` extended with `aria-hidden` check | line 50 | AT visibility is part of the a11y contract; belongs in POM, not duplicated per test |
| `getNavLinkLabelsInDOMOrder()` added | lines 57–59 | Removes DOM crawl logic from specs; single place to update if nav structure changes |

### `tests/main.navigation.professional.spec.ts` vs `tests/main.navigation.refactored.spec.ts`

| # | Category | Change | Lines (professional) |
|---|---|---|---|
| 1 | Traceability | `test.info().annotations.push(…)` added to `beforeEach` | 60 |
| 2 | Clarity | Changelog section comments replaced with rationale comments | 77–83, 97–104 |
| 3 | Clarity | Test title: "…visible, accessible, enabled and has a valid href" → "…satisfies the accessibility contract" | 86 |
| 4 | Clarity | Test title: "…navigates to the correct page" → "…navigates to the correct destination" | 108 |
| 5 | Validation | `aria-hidden` assertion moved from spec loop into `assertLinkAccessible` POM method | POM:50 |
| 6 | Validation | `target` check: raw boolean expression → `not.toHaveAttribute('target', '_blank')` | 93 |
| 7 | Validation | Heading check: `toBeVisible()` only → `toBeVisible()` + `toContainText(/\w+/)` | 116–117 |
| 8 | Coverage | Edge: "not expose unlisted links" (iterative no-op) → `count()` vs `NAV_LINKS.length` + individual visibility | 129–139 |
| 9 | Coverage | Edge: link order delegated to `getNavLinkLabelsInDOMOrder()` with filter for non-owned links | 148–151 |
| 10 | Maintainability | `NavLink` type fields annotated with JSDoc explaining regex intent | 22–25 |

---

## Run Results

| Spec | Tests | Status |
|---|:---:|:---:|
| `tests/home.spec.ts` | 2 | passed |
| `tests/main.navigation.refactored.spec.ts` | 9 | passed |
| `tests/main.navigation.professional.spec.ts` | 9 | passed |
| **Total (production specs)** | **20** | **20 passed** |

> `tests/main.navigation.spec.ts` has one known failure (`page.locator('#docs')`) by design — it is the intentionally degraded training artefact maintained from Chapter 2 and is excluded from the production run.

---

## Final Notes

**What the professional spec adds over the refactored spec:**
- Traceability is machine-readable (annotations), not just in a comment
- The accessibility contract is fully owned by the POM; the spec delegates and states intent
- Validation is stricter at every layer: anchored href, domain-scoped URL, non-empty heading
- Edge cases are precise: count-based link set check and DOM-order assertion without hardcoding all nav links

**Open items (outside current scope):**
- `navBar` locator uses `getByRole('navigation')` without a name; if the page ever gains a second `<nav>`, add `{ name: /main/i }` to disambiguate (FND-19 from the audit)
- `page` property on `HomePage` is `readonly` public; making it `private` would enforce POM encapsulation fully (FND-12 from the audit)
- `aria-current="page"` assertion after navigation is not implemented; the site may not set this attribute — confirm before adding

---

## File Map

| File | Role |
|---|---|
| `tests/main.navigation.spec.ts` | Degraded spec — training artefact, left unfixed |
| `tests/main.navigation.refactored.spec.ts` | Repaired spec — all legacy issues resolved |
| `tests/main.navigation.professional.spec.ts` | Professional spec — full standards compliance |
| `pages/HomePage.ts` | POM — restored locators, `assertLinkAccessible`, `getNavLinkLabelsInDOMOrder` |
| `docs/legacy-test-analysis.md` | Chapter 2 issue catalogue (14 + 5 findings) |
| `docs/refactoring-summary.md` | Three-version comparison matrix (Chapter 3) |
| `docs/professional-review.md` | This file — Chapter 4 professional standards review |
