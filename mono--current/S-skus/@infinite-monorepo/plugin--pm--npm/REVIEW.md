# Review: plugin--npm

Writes npm-specific config (`.npmrc` `engine-strict`, package.json `engines`/`devEngines`, `.gitattributes` lockfile
merge strategy) when npm is the active package manager.

## Findings

- **G10-P1-01 (Critical, functional bug)** — In the `package_manager__selector` IIFE:
  ```js
  const vmin‿obj = semver.minVersion(package_manager.versionsⵧacceptable)
  assert(!!vmin‿obj, "semver issue")
  const relevant = [vmin‿obj.major, vmin‿obj.minor, vmin‿obj.minor] // BUG
  ```
  `.minor` is used twice; it should be `[vmin‿obj.major, vmin‿obj.minor, vmin‿obj.patch]`. As written, the computed
  version selector string always duplicates the minor component into the patch slot (e.g. a real version `10.2.5` would
  incorrectly become `10.2.2`), which is wrong for any version whose patch differs from its minor. This affects whatever
  downstream `engines`/`devEngines` value gets written to package.json.
- **G10-P2-01 (Nit)** — `module/notes.md` has a typo: `.nopmignore` should be `.npmignore`.

No other issues found — the two-phase logic (always write `.gitignore`/`.npmrc` entries, only touch
package.json/`.gitattributes` when npm is the active package manager) is otherwise sound.
