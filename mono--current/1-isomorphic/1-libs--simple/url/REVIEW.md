# Review: @monorepo-private/url

Tiny isomorphic helper for URL manipulation (currently: appending UTM marketing parameters to a URL).

## Findings

### G2-P13-01 (Major) — `tsc --noEmit` fails for this package

Running `check:ts` fails, not because of this package's own code, but because its dependency chain pulls in
`ts--types--hypermedia/module/90-semantic/20-author/selectors.ts:30`, which does
`import assert from "@monorepo-private/assert"` — but `@monorepo-private/assert` has no default export (only named
`assert` / `assert_from`). This means `pnpm --filter @monorepo-private/url check` currently fails. Root cause lives in
`ts--types--hypermedia`, not in `url` itself, but it blocks this package's own `check` script and is worth flagging here
since it's directly observable when reviewing this package.

### G2-P13-02 (Minor) — No tests at all

The package has zero test files (no `*.tests.ts`), yet `package.json`'s `devDependencies` include `chai`, `mocha`,
`sinon`, `@types/mocha`, `@types/sinon`, `vitest`, and `@monorepo-private/config--mocha` — and the `check` script only
runs `check:ts` (no `test` script is even defined), so the test tooling is entirely unused dead weight for this package.
Given the migration to vitest, if a test is added for `addꓽutm_params` (worth doing — see G2-P13-03), it should be
written in vitest, not mocha/chai.

### G2-P13-03 (Minor) — `addꓽutm_params` is unexercised

The single exported function has no test coverage. It's simple, but not trivial: it mutates/normalizes a URL string via
`new URL(url).toString()`, which will change URL encoding/casing (e.g. re-encode existing query params) as a side effect
— worth a test to lock in that behavior and to check that existing query parameters are preserved and that an invalid
`url` throws a clear error (currently it'll throw the native `TypeError [ERR_INVALID_URL]` from `new URL()`, not a
project-style assertion error).

### G2-P13-04 (Nit) — No README

Every sibling package in this batch except `utils--sort` has a `README.md`; this one doesn't. Not required for such a
small package, but worth adding a one-liner + usage example for consistency, especially since the function name uses a
non-obvious naming convention (`addꓽutm_params`, `Url‿str`).

## Summary

No functional bugs found. The package is small, correct in its one function, and free of OOP/class misuse. The two real
issues are: (1) an inherited `tsc` failure via a transitive dependency, and (2) a complete absence of tests despite test
tooling being wired up in `package.json`.
