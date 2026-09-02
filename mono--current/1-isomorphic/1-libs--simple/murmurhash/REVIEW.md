# Review: `murmurhash`

Tiny typed TypeScript wrapper around `murmurhash3js-revisited`, exposing `MurmurHash.v3.x64ⵧ128.hashꓽstring()` /
`.hashꓽobject()` (the latter using `@monorepo-private/json-stable-stringify` for deterministic key ordering before
hashing). Explicitly documented as non-cryptographic.

## Findings

- **G2-P4-01** (Minor) — `@monorepo-private/assert` is listed as a runtime `dependency` in `package.json` but is never
  imported or used anywhere in `module/index.ts` or `module/index.tests.ts`. Either it's dead weight left over from a
  refactor, or the module was meant to assert invariants (e.g. validate hash output length/format) and never did.
  `sinon`/`@types/sinon` are also declared but unused. `package.json` (dependencies: `@monorepo-private/assert`;
  devDependencies: `sinon`, `@types/sinon`)

- **G2-P4-02** (Nit) — `const MurmurHash3 = (_MurmurHash3_cjs as any).default` casts through `any` to reach into the CJS
  default export. This is a common/pragmatic pattern for interop with untyped or awkwardly-typed CJS packages, but since
  `@types/murmurhash3js-revisited` is already a declared devDependency, it's worth double-checking whether a typed
  access (e.g. `_MurmurHash3_cjs.default` without the `any` cast, if the types package models the default export
  correctly) would remove the `any`. `module/index.ts:7`

- **G2-P4-03** (Nit) — No test exercises the "unstable input" side — e.g. confirming that hashing two different
  objects/strings produces different hashes (only stability/equality is tested, not that this is a real hash with
  sensitivity to input changes). Minor gap, low risk given this is a thin wrapper over a well-known third-party
  algorithm. `module/index.tests.ts`

## Notes

- Package is small and otherwise clean: no classes, no mutation, single-purpose wrapper with a clear, accurate README
  (including a loud, appropriate non-cryptographic warning).
- No `~~tosort` folder present in this package.
- Tests use legacy mocha + chai; consistent with the package's era, no action needed.
- No other issues found — this package does what it says, its tests pass known-good fixture hashes, and the README
  documentation matches the actual exported API shape.
