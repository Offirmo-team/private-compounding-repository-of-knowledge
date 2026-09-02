# Review: @infinite-monorepo/spec--defaults

Purpose: tiny pure module providing `MONOREPO_SPEC_DEFAULT` (a sane default `InfiniteMonorepoSpec`) and a
`completeꓽspec()` helper that shallow-merges a partial spec over those defaults.

## Findings

### G9-P42-01 — Minor — Declared dependency on `@monorepo-private/assert` never used

File: `package.json` (dependencies) vs. `module/src/index.ts`

Same recurring pattern seen in `15-spec` and `19-graph`: `@monorepo-private/assert` is listed as a runtime dependency
but never imported. This package has actual runtime code (`completeꓽspec`), so the unused dependency is even less
justified here than in the type-only siblings.

### G9-P42-02 — Minor — `completeꓽspec` does a shallow merge only; nested fields cannot be partially overridden

File: `module/src/index.ts:20-25`

```ts
function completeꓽspec(spec: Immutable<Partial<InfiniteMonorepoSpec>>): Immutable<InfiniteMonorepoSpec> {
  return {
    ...MONOREPO_SPEC_DEFAULT,
    ...spec,
  }
}
```

Currently `InfiniteMonorepoSpec` has no deeply-nested object fields besides `package_manager__config?: any`, so this
isn't a live bug today, but if a future field (e.g. `runtimeⵧlocal: JsRuntimeSpec<...>`, which IS an object) needs
partial override, `completeꓽspec` will replace the whole object rather than merging it. Not urgent, but worth a one-line
comment noting the merge is intentionally shallow, since `runtimeⵧlocal` is already a union that can be an object
(`JsRuntimeSpec`).

### G9-P42-03 — Nit — `root_path‿abs: "NOT_YET_LOADED/"` is a stringly-typed sentinel with no dedicated type/guard

File: `module/src/index.ts:16`

The default value `"NOT_YET_LOADED/"` is a magic string used as a placeholder for a required `DirPathⳇAbsolute` before
real config loading happens. There's no exported constant or type guard (e.g. `isꓽspec_loaded(spec)`) to check for this
sentinel elsewhere, so any code comparing against it would have to hardcode the same string. Given this is a "defaults"
package, exporting a small helper/constant for this sentinel would reduce the risk of drift if the placeholder string
ever changes.

### G9-P42-04 — Nit — No README, no tests

No `README.md` and no test file for `completeꓽspec`, despite it being simple enough that a one-line vitest test (merge
fills in missing default fields, explicit `spec` fields win) would be trivial to add and would guard against accidental
default drift.

No OOP/class usage — a single pure function plus a constant, fully consistent with repo's functional style. No other
issues found; this is a small, clean package.
