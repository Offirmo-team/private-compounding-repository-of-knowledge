# Review: `promise-try`

Single-function polyfill/shim for `Promise.try()` (`Promise.resolve().then(fn)`), added as a stopgap until native
`Promise.try` lands in Node LTS / TS lib target.

## Findings

- **G2-P5-01** (Minor) — `@monorepo-private/assert` is declared as a runtime `dependency` but never imported/used in
  `module/src/index.ts`. Same unused-dependency pattern seen in sibling packages (`murmurhash`, etc.).
  `sinon`/`@types/sinon` devDependencies are likewise unused. `package.json`

- **G2-P5-02** (Nit) — No test verifies that `fn` throwing _synchronously_ is actually caught and turned into a
  rejection specifically for the case where `fn` itself is not an arrow-wrapped throw but a genuinely synchronous throw
  path distinct from a rejected promise return — the existing "rejection" test already covers this correctly
  (`promiseTry(() => { throw test_error })`), so this is a very minor completeness note, not a real gap: the two
  existing tests (resolution + synchronous-throw-becomes-rejection) already cover the core value proposition of
  `Promise.try` (that's the whole point of the wrapper). No further gap found.

## Notes

- This package is intentionally trivial (3 lines of actual logic) and has no real issues: the implementation is the
  well-known, correct `Promise.resolve().then(fn)` pattern (linked source: 2ality.com), it's pure/stateless, has no
  classes, and its two tests cover both the resolve and reject paths adequately.
- No `~~tosort` folder present in this package.
- Tests use legacy mocha + chai; consistent with the package's era, no action needed.
- `README.md` accurately explains the rationale (native `Promise.try` availability timeline) and matches the actual
  export shape (`default` + named `promiseTry`). The `##demo/demo.ts` demo script matches its documented `npm run demo`
  script and correctly exercises the rejection path.
- No security concerns (no I/O, pure control-flow utility).
