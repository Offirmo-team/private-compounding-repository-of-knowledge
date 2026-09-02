# Review: @infinite-monorepo/spec--load

Loads the raw chain of `.monorepo` config files (from fs root down to cwd) used later to build the infinite-monorepo
dependency graph.

## Findings

### G9-P43-01 (Minor) — Dead dependency: `@monorepo-private/assert` is declared but never imported

`package.json` lists `@monorepo-private/assert` as a runtime dependency, but `module/src/index.ts` never imports or uses
it (no `assert`/`assert_from` reference anywhere in the package). Either it's vestigial or a future TODO was dropped;
should be removed or the intended usage added.

### G9-P43-02 (Minor) — Empty `MANIFEST.json5` / no description

`module/MANIFEST.json5` is `{}`. Compare to `03-pkg-infos-resolver` and `60-pkg-analyzer` in the same monorepo, which
set a `description`. This package's purpose (loading the raw spec chain) isn't documented anywhere (no README either).

### G9-P43-03 (Nit) — Single-function module, thin package boundary

The whole package is one re-exported function (`loadꓽspecⵧchainⵧraw`), which is just a documented, narrowly-typed
wrapper around `@monorepo-private/load-config`'s `loadꓽconfigⵧchain(".monorepo", …)`. This is consistent with the
monorepo's fine-grained package style, so not flagged as a real problem — just noting the package is essentially a
1-line adapter.

### G9-P43-04 (Nit) — No tests

There are no test files in this package (`module/src/index.ts` is the only source file). Given the function is a thin
wrapper with non-trivial async chain-walking behavior delegated to `load-config`, a small vitest test (e.g. asserting it
forwards `from` correctly, or a smoke test with a temp directory) would help guard against regressions when
`load-config`'s `Result` shape changes.

No OOP/class usage found (function is a plain async function) — good adherence to the functional style.
