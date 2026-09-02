# Review — @monorepo-private/practical-logger--browser

Browser implementation of Offirmo's practical logger: wraps `practical-logger--core` with browser-specific console sinks
(styled-CSS output tuned per browser, or a plain no-CSS fallback).

Note: this package contains a `module/~~tosort/2025/better-console-groups/practical-logger.ts` file (legacy/unsorted
code) — not reviewed here.

## Findings

- **G5-P11-01** (Nit) — `module/src/sinks/advanced/chromium.ts`, `firefox.ts`, and `safari.ts` are near-duplicate
  implementations (same overall structure, differing only in font-size constants, margins, and `has_details_indicator`
  logic — confirmed via diff) with independently tuned magic numbers. This is deliberate per-browser CSS tuning rather
  than accidental copy-paste, but the three-way duplication means any structural change (e.g. adding a new line segment)
  has to be replicated three times; worth considering a shared template parameterized by per-browser style constants if
  these evolve further.
- **G5-P11-02** (Nit) — README badges reference `stack--current/2-foundation/practical-logger--browser` (old path) while
  the package now lives under `4-engine--browser/2-libs--cross-cutting/` — stale path, cosmetic only. README also has
  two literal `TODO` placeholders ("TODO codepen", "On IE11: TODO").
- **G5-P11-03** (Nit) — `module/src/sinks/common.ts:29-30`: commented-out dead code (`//.slice(0, MIN_WIDTH)`,
  `//if (str.length < MIN_WIDTH)`) left in `to_uniform_level`.

No other issues found — package.json dependencies match actual imports, legacy mocha+chai tests exist (`index.tests.ts`,
`sinks/common.tests.ts`, `sinks/advanced/common.tests.ts`) and are fine per the project's migration policy (existing
code, not required to be vitest), and there is no OOP/class usage — sinks and the logger factory are plain
functions/closures.
