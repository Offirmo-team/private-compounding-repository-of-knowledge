# Review: @infinite-monorepo/types-for-plugins

A convenience barrel package that re-exports the combined public surface (`graph`, `package-details`, `plugin`,
`primitives`, `spec`, `structured-file-manifest`, and select `state` types) that a plugin author needs, so plugin
packages can depend on one package instead of six.

## Findings

### G9-P52-01 (Minor) — Dead dependency: `@monorepo-private/assert` declared but unused

Same pattern as `51-plugin`: `package.json` depends on `@monorepo-private/assert`, but the single source file
(`module/src/index.ts`) is pure `export * from ...` / `export type { ... }` statements with no runtime code and no
reference to `assert`.

### G9-P52-02 (Minor) — Wildcard re-exports risk silent symbol collisions

`index.ts` does `export * from` six different packages (`graph`, `package-details`, `plugin`, `primitives`, `spec`,
`structured-file-manifest`) plus a named `export type` from `state`. If any two of those packages ever export a symbol
with the same name, TypeScript will silently drop/ambiguate one of them (or error, depending on the exact overlap) with
no compile-time signal pointing back to this barrel file. Given the codebase's heavy use of short, glyph-decorated names
(`ꓽ`, `ⵧ`, `ⳇ`), collisions across independently-evolving packages are more likely than in a plain-ASCII naming scheme.
No current collision was found, but this is a structural risk worth a comment or an explicit named re-export list if
it's ever bitten before.

### G9-P52-03 (Nit) — Curated (not wildcard) re-export from `state`, inconsistent with the rest of the file

Unlike the other six `export *` lines, the `state` re-export is deliberately narrowed to
`{ State, FileOutputAbsent, FileOutputPresent }`. This is presumably intentional (avoiding exposing `state`'s
reducers/selectors as "plugin types"), but it's undocumented — a one-line comment explaining why `state` is
special-cased here (while `plugin`, which also pulls in an implicit dependency on `state` internally, is not) would help
future maintainers avoid "fixing" the inconsistency by mistake.

### G9-P52-04 (Nit) — No tests

Expected for a type re-export barrel with zero runtime logic; not a real gap.

No OOP/class usage in this package's own code (it has none beyond re-exports). No other issues found.
