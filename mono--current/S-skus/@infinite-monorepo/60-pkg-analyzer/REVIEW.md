# Review: @infinite-monorepo/pkg-analyzer

Walks a "pure module" directory tree, classifies every file it finds, and aggregates the results (entry points,
languages used, declared dependencies inferred from imports) into a `PureModuleDetails` object used to generate
build-related files.

## Findings

- **G9-P60A-01** (Critical) — `getꓽProgLangs()` (module/src/index.ts:405-439) has a typo in the JSON case:
  `case [".json", ".jsonc", ",json5"].includes(ext):` — note the leading comma instead of a dot in `",json5"`. Any file
  with the `.json5` extension (this exact package ships `MANIFEST.json5` files as its manifest format!) will fall
  through to the `default` branch and throw `Unsupported language for extension ".json5"`. This looks like it would
  break analysis of any pure module using a `MANIFEST.json5`, unless `.json5` files are always filtered out earlier by
  `isꓽignored_file()` (in `@infinite-monorepo/heuristics`, which does special-case `.json5` as ignored) — but if that
  heuristic ever changes, or if any other `.json5` file exists in a module that isn't caught by that early filter, this
  function crashes. At minimum this is dead/wrong code that should be fixed to `".json5"`.

- **G9-P60A-02** (Major) — Debugging leftovers: three `debugger` statements gated on `if (fqname === debug_pkg)` (lines
  91-93, 322-324, 396-398), with `debug_pkg` hardcoded to `"x"` (a commented-out real package name
  `@infinite-monorepo/pkg-infos-resolver` sits right next to it). This is scratch debugging code that leaked into
  committed source and should be removed before shipping.

- **G9-P60A-03** (Major) — Dead code path: in the `catch (err)` block of the per-package analysis in
  `70-operation--apply` isn't this file, but locally in this file there's an equivalent smell: `updateⵧfrom_files` at
  line 91-93 has commented-out large blocks of "MIGRATION" logic (lines 63-82) with a hardcoded
  `throw new Error("Not implemented!")` above them that make the entire `manifest_data` derivation branch for non-SSoT /
  non-empty package.json dead/unreachable except for the trivial `{}` case. It's unclear if this migration codepath is
  still needed; if it's truly obsolete, the ~20 lines of commented code and the `throw` should be removed (matches the
  file's own `// TODO remove migration! (should no longer be needed)` at line 9).

- **G9-P60A-04** (Minor) — `_walk_files_NotGitIgnored()` (line 693) keeps ~10 lines of a previous, admittedly-broken
  implementation as a comment (`/* previous version, not ignoring properly ... */`) referencing two GitHub issue links.
  Given it's explicitly marked as superseded/broken, this should be deleted rather than kept as a comment block.

- **G9-P60A-05** (Minor) — `module/##demo/index.ts` calls
  `getꓽpackage_details(__dirname + "/../../../../../1-stdlib/timestamps/module", { indent: "   " })`, but
  `module/src/index.ts` does not export any function named `getꓽpackage_details` — it only exports `updateⵧfrom_files`.
  This demo script is broken/stale and would fail immediately on import (no such export) if run via the `demo` npm
  script or the checked-in `webstorm--demo.run.xml` run configuration. Also the hardcoded relative path
  `../../../../../1-stdlib/timestamps/module` is brittle and specific to one contributor's checkout.

- **G9-P60A-06** (Minor) — No unit tests despite non-trivial branching logic (scoring functions for entrypoint
  candidates, extension-to-language mapping, migration/normalization assertions). `mocha`/`chai`/`sinon`/`vitest` are
  declared as devDependencies but there is no `"test"` script in `package.json` and no `*.tests.ts` file in the package.

- **G9-P60A-07** (Minor) — Dependency mismatch: `@monorepo-private/assert` is declared as a runtime `dependency` in
  `package.json`, but the code uses Node's built-in `import { strict as assert } from "node:assert"` instead — the
  workspace `@monorepo-private/assert` package is never imported anywhere in this package. Likely a leftover/unused
  declared dependency.

- **G9-P60A-08** (Nit) — `throw err; return {...}` dead code after a throw does not apply here (this pattern is in
  `70-operation--apply`, see that review) — not repeated here, no finding.

- **G9-P60A-09** (Nit) — `module/notes.md` is a short scratch note containing an "overrides" JSON5 snippet with no prose
  explaining what it's for or whether it's still relevant; borderline dead documentation.

## Notes

- The package is pure-functional in style (no classes), consistent with monorepo conventions.
- `README.md` is absent; the package's purpose is only documented via the one-line `description` in `package.json`.
