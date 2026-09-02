# Review — @infinite-monorepo/primitives

Purpose: a grab-bag of shared primitive types used across `@infinite-monorepo` tooling — versioning specs, JS
runtime/package-manager descriptors, programming-language/quality-status enums, and dependency-type definitions.

## Findings

- **G9-P13-01 (Major)** — `tsc --noEmit` fails for this package, but entirely because of its dependency on
  `@infinite-monorepo/pkg-infos-resolver` (imported for `PkgFQName`, `PkgName`, `PkgNamespace`, `PackageJson` types in
  `01-primitives.ts:19,64`): the compiler pulls in `03-pkg-infos-resolver/module/src/state/reducers.ts` and
  `selectors.ts`, which have real bugs (duplicate `State` import, `ǃ.for_param`/`ǃ.for_value` typos vs. actual
  `forⵧparam`/`forⵧvalue` API — see the `03-pkg-infos-resolver` review, G9-P03-01). This package's own two source files
  (`01-primitives.ts`, `10-tools.ts`) contain no type errors themselves, but `pnpm check` for `13-primitives` is
  currently broken as a direct consequence of the upstream bug. Fixing `03-pkg-infos-resolver` will fix this too.
- **G9-P13-02 (Nit)** — No README, no tests. The package is purely type/const declarations (no runtime logic beyond the
  `DEPENDENCY_TYPES`/`PKG_MANAGERS` arrays), so risk is low, but there's nothing documenting the intended scope/boundary
  of "primitives" vs. what belongs in the consuming packages (`01-known-versions`, `03-pkg-infos-resolver`,
  `12-structured-file-manifest`, etc.) which this one itself depends on and re-exports types from.
- **G9-P13-03 (Nit)** — `01-primitives.ts:25` `QualityStatus` and its comment: the inline comment
  `// EXPERIMENTAL rating of modules TODO clarify` plus `// below that, checks are not expected to work` documents an
  ordering-dependent semantic (union order implies threshold: "stable" then below-that things get progressively less
  checked) but nothing in the type system enforces or reflects that ordering — a plain string union has no ordering
  semantics at runtime. If ordering is meaningful, consider modeling it as an ordered array (like `DEPENDENCY_TYPES`)
  with a derived type, consistent with how `DEPENDENCY_TYPES` already does it a few lines below in the same style.
- **G9-P13-04 (Nit)** — Multiple `// TODO clarify` / `// TODO review` markers left on `VersionSpecification`,
  `QualityStatus`, and inside `DEPENDENCY_TYPES` comments (`"script"`, `"vendored"`) — flagging as known, acknowledged
  debt, not a new finding beyond noting it's tracked nowhere except inline comments.

No class/OOP usage in this package — everything is plain interfaces, type aliases, and `as const` arrays, consistent
with the repo's FP style.

No other issues found.
