# Review: @monorepo-private/utils--error

Utilities for JS/TS error creation, field taxonomy, and normalization (`createError`, `normalizeError`,
`try_or_fallback`, `XError`/`XXError` types), plus an in-progress `v2` rewrite (selectors, error-shape guards,
chaos/live-test scaffolding) exposed as a separate `./v2` entry point.

Note: this package contains a `module/~~sandbox` folder (a single scratch `index.ts` demo file) holding unsorted/legacy
code, per instructions not reviewed for content — not part of the compiled/test surface.

## Findings

### G2-P15-01 (Major) — `v2/selectors/index.tests.ts` is not a test file; it's a stale duplicate of production code

Despite the `.tests.ts` naming convention (which the mocha/test glob `'./module/**/*.tests.ts'` picks up),
`v2/selectors/index.tests.ts` contains no `describe`/`it`/assertions at all — it's a verbatim-looking but _outdated_
copy of `getꓽmessage`/`getꓽname` from `v2/selectors/index.ts`, missing the newer additions (`getꓽattribute`, `isꓽError`,
`isꓽErrorⵧrsrc_not_found`) that exist in the real file. Because it matches the test glob, if this package ever moves off
`--bail`-tolerant mocha or the runner treats "no tests found in file" as an error, this could break CI; more
importantly, it's silently dead, confusing duplicate code masquerading as a test suite. It should either be deleted, or
turned into real tests for `v2/selectors/index.ts` (which currently otherwise has zero coverage for `getꓽattribute`,
`isꓽError`, `isꓽErrorⵧrsrc_not_found`) — new tests should use vitest per project policy.

### G2-P15-02 (Minor) — `v2` klasses export unused, dead error classes

`v2/klasses/index.ts` defines and exports `NotFoundError`, `AssertionFailedError`, `AssumptionNotMetError` (all
`extends Error {}`, no added behavior). Only `NotFoundError` is actually used (in `v2/selectors/index.ts`'s
`isꓽErrorⵧrsrc_not_found`). `AssertionFailedError` and `AssumptionNotMetError` have zero usages anywhere in the package.
Either they're planned for future use (fine, but worth a TODO comment) or they're dead exports that should be removed.
Also, per project conventions ("AVOID OOP/classes except when the API really mandates it"), these are borderline —
subclassing `Error` is common/idiomatic even in FP codebases since `instanceof Error` checks are load-bearing (e.g.
`thrown instanceof NotFoundError`), so this is a reasonable exception, not a violation.

### G2-P15-03 (Minor) — `v2/state/debug.ts` and `v2/state/strict.ts` are empty placeholder files

Both are 0 bytes, imported by nothing, and not re-exported from `v2/state/index.ts` (which only re-exports
`./selectors/index.ts`, not `./state/*` at all — so `state/index.ts` doesn't even use its own directory). This looks
like early scaffolding for a "debug mode vs strict mode" feature that never got built. Not harmful, but dead directory
structure; consider removing until actually implemented, or add a TODO/notes.md explaining intent (there is a sibling
`__specs/cloudflare--workers/notes.md` and `utils--chaos/README.md` / `utils--live-test/README.md` showing the pattern
of leaving design notes — these two files have neither content nor notes).

### G2-P15-04 (Minor) — `v2` normalization (`toWellFormed().normalize("NFC")`) is unused elsewhere and untested

`v2/selectors/index.ts`'s `getꓽname`/`getꓽmessage`/`getꓽattribute` unicode-normalize every string field
(`.toWellFormed().normalize("NFC")`), a stricter/newer behavior than the "v1" equivalent in the (dead) `.tests.ts` file
and than `fields.ts`/`types.ts` in v1. This is a reasonable defensive improvement (guards against unpaired surrogates
and non-canonical unicode in untrusted thrown values) but has zero test coverage — worth a small vitest suite given it's
a deliberate security/robustness feature, not incidental.

### G2-P15-05 (Nit) — `README.md` and `CHANGELOG.md` describe only the v1 API

Both docs cover `createError`/`normalizeError`/field constants (v1) but don't mention the `./v2` entry point,
`v2/selectors`, `isꓽErrorⵧrsrc_not_found`, or the chaos/live-test utilities at all. Not a bug, but the v2 surface is
effectively undocumented for consumers.

### G2-P15-06 (Nit) — Inconsistent duplication of `getꓽmessage`/`getꓽname` between v1 and v2 with different behavior

`fields.ts`/`types.ts` (v1) and `v2/selectors/index.ts` both implement "safely extract a message/name from an unknown
thrown value" but with materially different semantics (v1's `isꓽError()` requires `message`+`name`+`stack` all being
strings; v2's `isꓽError()` — via `isꓽErrorShapeⳇBase` — only requires `name`+`message`, and separately applies unicode
normalization). This may be intentional evolution for v2, but there's no note explaining why v2 relaxed the `stack`
requirement, which could cause behavior drift for consumers migrating from v1 to v2.

## Summary

The v1 API (`createError`, `normalizeError`, `try_or_fallback`, field constants) is solid, well-tested (mocha/chai,
pre-existing — fine per project policy), and thoughtfully documented (CHANGELOG, README, inline rationale comments). The
in-progress `v2` rewrite is where the real issues concentrate: a mislabeled non-test file (G2-P15-01, the most
actionable item), some dead/placeholder code, and a documentation gap. No OOP misuse beyond the reasonable
`extends Error` pattern, no security issues found (the v2 unicode-normalization is if anything a hardening measure).
