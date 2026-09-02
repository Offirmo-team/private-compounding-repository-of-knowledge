# Review: plugin--package-json

The most complex plugin: assembles each package's `package.json` (name, engines, exports, scripts, dependencies) and a
monorepo-level `resolutions`/`devEngines` block.

## Findings

- **G10-P1-01 (Critical)** — Any package with `pkg_details.isꓽpublished === true` crashes the entire `onꓽapply`
  operation:
  ```js
  if (pkg_details.isꓽpublished) {
      pkg.repository = ...
      pkg.homepage = ...
      pkg.bugs = { url: "..." }
      pkg.files = ["dist", PURE_MODULE_CONTENT_RELPATH]
      throw new Error(`Not implemented!`)
  }
  ```
  The fields are computed first, then an unconditional `throw` is reached — meaning publishing support is stubbed out
  but wired into a live code path. Regardless of whether any package is currently flagged `isꓽpublished`, this is a
  ticking time bomb: the moment one is, the whole apply run fails. Needs either a real implementation or an explicit
  early-return/guard with a tracked TODO instead of a hard throw in the main path.
- **G10-P2-01 (Major, stale comment vs. code)** — `enginesⵧcleaned` is computed as literally `{}`; the actual filtering
  logic meant to strip the non-standard `"browser"` engine key (which reportedly confuses Parcel) exists only inside a
  large commented-out block (`/*Object.fromEntries(...)*/`) above it. The narrative comment describing the filtering no
  longer matches what actually executes — this directly violates the project's own review guideline to check that
  comments match the code, and likely means the Parcel-confusing `"browser"` key is no longer actually being stripped
  anywhere.
- **G10-P3-01 (Minor, fragility)** — The generated `test` script invokes mocha via an internal path
  (`./node_modules/mocha/bin/mocha.js`), with the code's own comment acknowledging `WARN internal, may break`. This is a
  self-flagged fragile dependency on mocha's internal file layout.
- **G10-P4-01 (Nit)** — Several acknowledged TODOs: exports-building (`// TODO clarify`, `// TODO what if no main?`,
  `// TODO should be auto if main`), `resolutions: { sharp: "^0.34" }` marked `// TODO move somewhere else`,
  `devEngines.runtime` marked `// TODO review if useful`, size-limit script commented out with
  `// TODO 1D resurrect this feature`.
- **G10-P5-01 (Nit, style)** — Dynamic property-path writes via `setꓽpropertyⵧdeep(pkg, path, value)` driven by
  `pkg_details._manifest._overrides?.files?.packageᐧjson`. Paths are sourced from local package manifests (not
  external/attacker input), so injection risk is low, but as a general pattern this is worth keeping an eye on if
  manifest sourcing ever changes to include less-trusted input.

No other issues found beyond the above.
