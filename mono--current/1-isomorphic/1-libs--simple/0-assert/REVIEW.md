# Review: `assert`

Semantic, low-boilerplate assertion library (pre/post-conditions, param checks) that auto-generates error messages and
throws typed `Error` subclasses; intended to replace ad-hoc `if (!x) throw ...` code.

## Findings

- **G2-P1-03** (Minor) — Unused dev dependencies: `sinon` and `@types/sinon` are declared in `package.json` but there is
  no reference to `sinon` anywhere in `module/`. `package.json:24,28`

- **G2-P1-04** (Minor) — Repeated destructuring pattern `Object.entries(x)[0] || []` to pull the single key/value out of
  a `{name: value}` "named argument" object appears 3 times with the same shape (once in `assert_from`, once in
  `forⵧparam`, once in `forⵧvalue`). Per the project's own convention ("once a similar chunk of code is reused more than
  two times, extract it"), this is a good candidate for a small shared helper, e.g. `single_entry_of(obj)`.
  `module/src/v2/index.ts:90, 105, 129`

- **G2-P1-05** (Nit) — Dead/commented-out code left in: commented-out `pre`/`post` properties in the `assert_from(...)`
  returned object, and the commented-out top-level `require`/`ensure` const declarations near the bottom of the file.
  Per project style, prefer removing rather than commenting out. `module/src/v2/index.ts:154-159, 262, 265`

- **G2-P1-08** (Nit) — `Context.object_under_check` and the `value_in_obj`/`fn_in_obj` parameters are typed `any`. Since
  these are internal-only helper types (not part of the public assertion surface), tightening to `unknown` where
  feasible would catch accidental misuse without much cost. `module/src/v2/index.ts:103,127,231`

- **G2-P1-09** (Nit) — One test is skipped (`it.skip("should capture a correct stacktrace", ...)`) with no tracking
  TODO/issue reference explaining why/when it should be revisited. `module/src/v2/index.tests.ts:53`
