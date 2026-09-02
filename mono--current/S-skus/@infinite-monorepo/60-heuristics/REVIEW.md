# Review: @infinite-monorepo/heuristics

Provides a set of small pure predicate/inference functions (ignored-file/folder detection, dependency-type inference)
used by the pkg-analyzer to classify files found while scanning a pure module.

## Findings

- **G9-P60H-01** (Minor) — `@monorepo-private/assert` is declared as a runtime `dependency` in `package.json` but is
  never imported or used anywhere in `module/index.ts`. Dead dependency.

- **G9-P60H-02** (Major) — No unit tests exist for this package at all, despite it consisting entirely of branchy,
  special-cased predicate logic (`isꓽignored_file`, `isꓽin_ignored_folder`, `isꓽin_unstructured_folder`,
  `inferꓽdeptype_from_caller`) that is easy to silently regress (e.g. adding/removing an extension case). `mocha`,
  `chai`, `sinon`, `vitest`, `@types/mocha`, `@types/sinon` are all declared as devDependencies, yet `package.json` has
  no `"test"` script and there isn't a single `*.tests.ts` file in the package.

- **G9-P60H-03** (Nit) — `module/MANIFEST.json5` is empty (`{}`), with no `description`, unlike sibling packages such as
  `60-pkg-analyzer` which document their purpose there.

- **G9-P60H-04** (Nit) — No `README.md` for the package.

- **G9-P60H-05** (Nit) — Several self-documented TODOs are left as future work (not currently actionable bugs):
  `.svg`/`.md`/`.json*` handling in `isꓽignored_file` notes "TODO 1D find a way to detect deps (use parcel?)" / "TODO 1D
  improve" for cases where these formats could technically reference other resources.

## Notes

- The package is pure functional style throughout (no classes/OOP) — consistent with the monorepo's FP guidelines.
- `module/index.ts` follows the "callers above callees" convention reasonably (all four exports are independent, no
  internal caller/callee ordering issue).
