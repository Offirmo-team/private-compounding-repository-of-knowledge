# Review: @monorepo-private/get-parent-package-name

Intended to resolve and log the name/version of the nearest `package.json` for a given `import.meta` — but currently
broken.

## Findings

- **GP-01 (Critical)** — The package does not compile. Running `tsc --noEmit` (the package's own `check:ts` script)
  produces 3 errors in `module/src/index.ts`:
  1. `get_parent_package_json` is declared to return `string` (line 3) but the function body never returns anything
     (only `console.log`s) — TS2355.
  2. `findPackageJSON(import_meta)` (line 4) is called with an `ImportMeta` object, but Node's `findPackageJSON` (from
     `node:module`) expects a `string | URL` — the caller should pass `import_meta.url`, not `import_meta` itself —
     TS2345.
  3. `findPackageJSON` can return `undefined`, but `readFileSync(pkgPath, "utf8")` (line 5) requires a defined
     `PathOrFileDescriptor` — TS2769, since `pkgPath` is typed `string | undefined`. Running `npm run check:ts` in this
     package fails outright. This is a broken/unshippable state, not a style nit.
- **GP-02 (Major)** — Even ignoring the type errors, the function's actual behavior doesn't match its name/intent:
  `get_parent_package_json` never returns the package name (or JSON) — it only `console.log`s `pkg.name` and
  `pkg.version` as a side effect, then implicitly returns `undefined`. Any caller relying on the declared `string`
  return type gets `undefined` at runtime. The function needs to actually `return pkg.name` (matching the package's own
  name, "get-parent-package-name") or `return pkg` if the full JSON is wanted.
- **GP-03 (Minor)** — No tests at all (no `*.tests.ts` files), despite `mocha`/`chai`/`vitest` devDependencies. A single
  basic test invoking this function against its own `package.json` would have caught all of the above immediately.
- **GP-04 (Minor)** — Unusual code layout: imports (`readFileSync`, `findPackageJSON`) are placed at the _bottom_ of the
  file (lines 11-12), after the function that uses them, rather than at the top. This isn't a TS/JS problem (import
  hoisting handles it) but is inconsistent with typical style and this repo's own convention of ordering callers above
  callees for _functions_ — imports are a different case, but placing them at the end without a stated reason looks like
  an editing artifact left behind rather than a deliberate stylistic choice.
- **GP-05 (Nit)** — No README.md describing intended usage, which would have made the broken return-value bug (GP-02)
  more obviously wrong.

Given the criticality of GP-01/GP-02, this package appears to be an unfinished draft rather than production-ready code —
it should not be depended on by other packages until fixed.
