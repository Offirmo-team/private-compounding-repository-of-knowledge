# Review: @infinite-monorepo/package-details

Purpose: pure functional model (`PureModuleDetails`) plus reducers/selectors for gathering and manipulating per-package
metadata (deps, entrypoints, scripts, target runtime) used to regenerate `package.json`/`tsconfig.json` across the
monorepo tooling.

## Findings

### G9-P14-01 — Major — `assert(!!details._manifest[k])` rejects valid falsy overrides in `updateⵧfrom_manifest`

File: `module/src/reducers.ts:168`

The loop that copies manifest fields onto `details` asserts the value is truthy before copying:

```ts
if (unprocessed_keys.has(k)) {
    assert(!!details._manifest[k])
    ;(details as any)[k] = details._manifest[k]
    ...
}
```

Several fields in `PureModuleManifest` are legitimately falsy: `isꓽpublished: false`, `isꓽapp: false`,
`hasꓽside_effects: false`, `scripts: {}` (empty object is truthy but an unset value could be `{}`... more importantly
booleans `false` are the common/likely override). A manifest explicitly overriding e.g. `isꓽpublished: false` (arguably
the most common override for this exact field, since the default is already `false` in `create()`, so the interesting
case is setting it explicitly) will throw an `assert` failure instead of applying the override. This looks like a
copy-paste guard that should instead check `k in details._manifest` (already guaranteed by `unprocessed_keys.has(k)`)
rather than truthiness of the value.

### G9-P14-02 — Minor — Dead/unreachable branch: `if (i) return path__segments[i]` in namespace inference

File: `module/src/reducers.ts:22-27`

```ts
const namespace: PureModuleDetails["namespace"] = (function _inferꓽns(): PkgNamespace {
  const i = path__segments.findLastIndex((s) => s.startsWith("@"))
  if (i) return path__segments[i]
  return default_namespace
})()
```

`findLastIndex` returns `-1` when nothing matches, not `0`/falsy on "not found" alone — but if the LAST matching
`@namespace` segment happens to be at index `0` of the (already-popped) `path__segments` array, `i` is `0`, which is
falsy, so the condition wrongly falls through to `default_namespace` even though a match was found. This is an edge case
(only triggers when the namespace segment is the very first remaining path segment, e.g. resolving from a root path with
a short prefix) but is a real bug: the correct check is `i !== -1` or `i >= 0`.

### G9-P14-03 — Minor — Fragile name inference via manual digit-stripping

File: `module/src/reducers.ts:13-20`

```ts
let segment = path__segments.pop()!
while (segment.length > 1 && "0123456789-".includes(segment[0]!)) segment = segment.slice(1)
return segment
```

This strips any leading digits/dashes one character at a time (used to remove ordering prefixes like `"14-"` from folder
names). It will also strip legitimate leading digits from a package name that isn't just a numeric prefix (e.g. a folder
literally named `123-foo` becomes `foo`, but a folder named `3d-renderer` becomes `renderer` losing the `3d`). Given
this is explicitly marked `// TODO those inference are specific` the author is aware of the fragility; flagging for
visibility since it silently mangles names outside the intended `NN-name` convention.

### G9-P14-04 — Minor — Unbounded/no-op branch in `_addꓽdependency` silently ignores conflicting details

File: `module/src/reducers.ts:390-393`

```ts
if (deps.has(dep_name)) {
  // TODO 1D check conflicts
  return details
}
```

If a dependency is added twice with different `dep_details` (e.g. different version range), the second call is silently
dropped with no warning, unlike `addꓽscript` which asserts on conflicting values (`reducers.ts:236-239`). This is a
known gap (there's a TODO) but is inconsistent with the sibling function's stricter behavior — worth aligning.

### G9-P14-05 — Nit — No unit tests

Package has zero test files despite exposing fairly intricate reducer logic (`reconcile`,
`addꓽdependency`/`removeꓽdependency` type-moving rules, `updateⵧfrom_manifest`). Given `devDependencies` already include
`vitest`, this would be a good candidate for coverage, especially for the `reconcile()` dependency-type-moving logic and
the manifest-copy bug above (G9-P14-01), which unit tests would have caught immediately.

### G9-P14-06 — Nit — README is a one-line stub

`README.md` only contains an import example, no description of the package's purpose or API. Low priority since this is
an internal tooling package, but worth flagging per review scope.

No OOP/class usage found — module is fully functional (types + pure reducers/selectors), consistent with repo
conventions.
