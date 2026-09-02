# Review: `@monorepo-private/random`

Purpose: a from-scratch (2023 rewrite of a Random.js fork) PRNG/RNG library — pluggable engines (ISAAC32, Math.random(),
a stubbed MT19937) plus distribution combinators (bool, integer, weighted bool) and convenience sugar (`getꓽrandom`,
`getꓽengine`).

## Findings

- **[Major] G2-P8-01** — `module/src/engines/MT19937/index.ts` is a full stub (just two comment lines, no
  implementation), yet the type system fully wires it in: `PRNGState.algorithm_id` includes `"MT19937"`
  (`module/src/types.ts:21`), and `sugar.ts`'s `getꓽengine.prng.from_state()` has a live
  `case "MT19937": throw new Error("Not Implemented")` branch. Any code that round-trips a persisted `PRNGState` (e.g.
  saved seed/state fixtures) can silently type-check while being guaranteed to throw at runtime if the algorithm ever
  ends up as `"MT19937"`. Since ISAAC32 is stated (in `types.ts`'s type union and README) to be preferred anyway,
  consider either removing `"MT19937"` from the public type union until it's implemented, or clearly marking it
  experimental/unsupported in the type itself (e.g. via a comment) so this can't surprise a consumer months from now.

- **[Minor] G2-P8-02** — `module/src/distributions/dice.ts` and `module/src/distributions/real.ts` are stubs containing
  only a `// TODO one day` comment and an unused `import type { Int32, RNGEngine } from "../types.ts"`. They are not
  re-exported from `distributions/index.ts`, so they're dead weight rather than a live API gap, but the unused imports
  would trip `noUnusedLocals`/lint if ever enabled, and their presence with no tracking issue makes it unclear whether
  they're planned or abandoned.

- **[Minor] G2-P8-03** — `package.json` declares `@monorepo-private/assert` as a real (non-dev) `dependency`, but it is
  never imported anywhere in the package (confirmed via grep — zero matches for `@monorepo-private/assert` in
  `module/`). Instead, `module/src/embedded-deps/assert/index.ts` reimplements an equivalent `assert()` function locally
  ("local assertion to avoid dependencies"), and that local copy is what's actually used (e.g. in
  `engines/__fixtures/_shared.ts`). Either drop the unused workspace dependency, or drop the embedded duplicate and use
  the real dependency — right now the package pays the coupling cost of the dependency without getting the benefit of a
  single source of truth.

- **[Minor] G2-P8-04** — `module/src/embedded-deps/types/index.ts` re-exports via `export * from "./immutable.js"` /
  `"./misc.js"`, using `.js` extensions, while every other import in this package (and in sibling packages like
  `normalize-string`) consistently uses explicit `.ts` extensions. Likely a copy-paste from a differently-configured
  template; harmless under the current TS/bundler config but inconsistent with the rest of the codebase.

- **[Nit] G2-P8-05** — Several sizeable commented-out dead-code blocks: `module/src/types.ts:36-51` (a full hypothetical
  `ImmutableRNGEngine`/`ImmutablePRNGEngine` design), `module/src/distributions/_internal.ts` (commented `_UInt53`
  variant), and commented `console.log` debug blocks in `distributions/bool.ts` and `distributions/integer.ts`. None are
  harmful, but they add noise; worth deleting (git history preserves them) or turning into tracked TODOs if the design
  is still intended.

- **[Nit] G2-P8-06** — `module/src/engines/ISAAC/index.ts` and `module/src/engines/MathRandom/index.ts` each carry a
  `@ts-expect-error` suppression (`TS2322`, plus a `TS2532` in ISAAC) to make `is_prng()` satisfy the
  `this is PRNGEngine` type guard / to paper over a possibly-undefined access. This is a reasonable pragmatic escape
  hatch for a type-guard limitation, but two suppressions in a small package is worth a one-line comment (already
  partially present) pointing at _why_ the type can't be expressed cleanly, so a future refactor doesn't reintroduce the
  same friction blindly.

- **[Nit] G2-P8-07** — `sugar.ts` attaches `.weighted` directly onto the `_getꓽrandom_generator_ofꓽbool` function object
  (`_getꓽrandom_generator_ofꓽbool.weighted = getꓽrandom_generator_ofꓽboolⵧweighted`) and then casts the whole thing via
  `as { (): ...; weighted: ... }`. It works, but is a slightly unusual pattern (function-as-namespace) that could
  instead be a plain object literal (`{ bool: fn, boolⵧweighted: fn }`) for clarity — purely a style suggestion, not a
  bug.

- **[Nit] G2-P8-08** — `sugar.ts` (the package's main convenience surface) has no dedicated test file; it's only
  exercised indirectly via 3 smoke tests in `module/src/index.tests.ts` (bool generator, weighted bool generator,
  integer generator) and never tests `getꓽengine` (e.g. `prng.from_state`, `for_unit_tests`, the `MT19937` throw path).
  The underlying engines/distributions are thoroughly tested, but the glue code that most consumers will actually call
  is the thinnest-tested part of the package.

- **[Nit] G2-P8-09** — `README.md` ends with a dangling `TODO review <link> TODO review <link> TODO review <link>` list
  (external RNG libraries to evaluate) and the package's `notes.md` has a single-line `TODO review seedrandom`. Fine as
  a scratchpad, just flagging for visibility per review instructions.

No `~~tosort` folder present in this package.

No OOP/class misuse — engines and distributions are implemented as factory functions returning plain objects
(`getꓽRNGⵧISAAC32()`, `getꓽRNGⵧMathᐧrandom()`), consistent with the project's functional-programming guidance. The
ISAAC32 engine itself is unusually well tested: it includes the official reference test vectors from burtleburtle.net
(randvect.txt/randseed.txt) plus a thorough `discard()` test suite and a shared `itᐧshouldᐧbeᐧaᐧvalidᐧengine` fixture
(statistical shape/spread/seeding/state-save-restore checks) reused across both engines. Tests use the legacy mocha+chai
stack, consistent with "existing tests are fine" guidance — no new tests were added here to migrate. `vitest` is a
declared devDependency but unused, same as every other package reviewed so far.

No other issues found.
