# Review: ts--types

Small collection of generic/base TypeScript type definitions (dates, arithmetic, immutability, i18n, file-system, input
specs, JSON, storage, software metadata, engagement/story-telling) re-exported from a single `module/index.ts`. Pure
type-only package, no runtime code, no classes/OOP.

## Findings

- **[Minor] G2-P20-01** — No unit tests at all. The package only has `*.typecheck.ts` files
  (`module/l1-immutable/index.typecheck.ts`, `module/l1-input/index.typecheck.ts`), which are compile-time-only checks
  (never executed, just `tsc --noEmit`'d). There is no `vitest`/mocha test file and no test script in `package.json`
  (`check` only runs `tsc --noEmit`). Given the tricky conditional-type logic in `l1-immutable` (Immutable/Mutable), at
  least keeping the typecheck files current is good, but there's zero runtime verification for anything (not a big risk
  since it's type-only, but worth noting for consistency with the rest of the monorepo which is standardizing on
  vitest).

- **[Minor] G2-P20-02** — `package.json` declares a runtime dependency on `@monorepo-private/assert`, but grep across
  `module/**/*.ts` shows it is never imported or used anywhere in this package. Looks like a leftover/unused dependency
  (auto-generated section says "auto generated some content in this file", so may be boilerplate from a template, but
  still worth pruning).

- **[Minor] G2-P20-03** — `module/l0-type-fest/index.ts` is fully commented out with a note "broken as of 2025/09" and
  is not exported anywhere (`module/index.ts` does not include `l0-type-fest`). Dead file that should either be fixed,
  removed, or tracked with a proper TODO/issue reference instead of silently rotting.

- **[Nit] G2-P20-04** — `module/l1-content/index.ts` is just two TODO comments and no actual exported code (a
  placeholder file). Same for the design questions embedded as comments in `l1-arithmetic` (e.g.
  `PositiveIntegerInRange<min, max>` doesn't actually use `min`/`max` type params — it's just documentation-only, which
  is explicitly acknowledged in the file's header comment, so not a bug, just worth flagging as an easy trap for future
  readers who might expect enforcement).

- **[Nit] G2-P20-05** — README.md doc comment for `ImmutabilityEnforcer`/`NumberMap` etc. is fine, but the README's code
  sample (`import { NumberMap } from ...`) mixes value-style imports for what are type-only exports; harmless with
  `verbatimModuleSyntax` off, but inconsistent with the `import type` used just above it in the same snippet.

No critical or major issues found — this is a small, well-scoped, type-only package with clear intent and good in-code
documentation of the trade-offs (especially in `l1-immutable`). No unnecessary classes/OOP; consistent with the
functional-programming style favored by this monorepo.
