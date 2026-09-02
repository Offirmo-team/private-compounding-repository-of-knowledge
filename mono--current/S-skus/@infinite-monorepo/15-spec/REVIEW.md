# Review: @infinite-monorepo/spec

Purpose: pure type-only package defining the `InfiniteMonorepoSpec` shape (the monorepo's own configuration schema:
mode, runtimes, workspaces, package manager, codegen namespaces) plus a generic `ToolSpec` type.

## Findings

### G9-P15-01 — Minor — `ToolSpec` is defined but unused anywhere in the codebase

File: `module/src/index.ts:20-24`

`ToolSpec` (extends `VersionSpecification`, adds `name`/`executable`/`requirement_level`) has no consumers across the
monorepo (only its own definition matches when searching for the symbol). Either it's speculative/forward-looking (fine
to keep, but consider a comment noting intended future use) or it's dead code that should be removed.

### G9-P15-02 — Minor — Declared dependency on `@monorepo-private/assert` never used

File: `package.json` (dependencies) vs. `module/src/index.ts`

The package is type-only (no runtime code, no imports of `assert`), yet lists `@monorepo-private/assert` as a runtime
`dependency`. Since this package exports only types (`export type { ... }`), it likely doesn't need this as a real
dependency at all — probably left over from a generator template or copy-paste from a sibling package. Same
auto-generation trailer comment
(`"// @infinite-monorepo/plugin--package-json": "auto generated some content in this file"`) suggests this is
tool-generated and may be low priority to fix by hand, but worth flagging since it inflates the install graph for a
types-only package.

### G9-P15-03 — Nit — No README

Package has no `README.md` at all (unlike `14-package-details`, which at least has a stub). Given this defines the
central config schema for the whole tool, a short description would help onboarding.

### G9-P15-04 — Nit — No tests

Type-only package, so unit tests have limited value (no runtime behavior to exercise), but there's also no compile-time
type test (e.g. a `.tests.ts` exercising `completeꓽspec`-style construction) that would catch shape drift. Low priority
given the nature of the package.

No OOP/class usage — purely type declarations, consistent with repo conventions. No bugs found in the actual type
definitions (cross-checked `LocalJsRuntimeKey`, `JsRuntimeSpec`, `PackageManagerKey`, `PackageManagerSpec` from
`@infinite-monorepo/primitives`, and `SemVerⳇExact`/`DirPathⳇAbsolute`/etc. from `@monorepo-private/ts--types` — all
resolve correctly).
