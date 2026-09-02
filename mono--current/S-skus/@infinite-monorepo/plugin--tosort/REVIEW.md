# Review: plugin--tosort

Note: `plugin--tosort` is a real plugin package (not a `~~tosort` scratch folder) and is reviewed normally per
team-lead's instructions.

Appears to be an early scaffold/copy-paste of the pnpm plugin's structure, intended to eventually handle vendored
dependencies, but currently mostly a stub with one reachable crash.

## Findings

- **G10-P1-01 (Critical, reachable crash)** — In `onꓽapply`, for any "package" node with vendored dependencies:
  ```js
  if (pkg_details.depsⵧvendored.size > 0) {
    throw new Error(`Not implemented!`)
  }
  ```
  Any package with vendored deps unconditionally crashes the whole apply operation, with no fallback/guard.
- **G10-P1-02 (Major, missing import — confirmed)** — Every function signature in `module/src/index.ts` uses
  `Immutable<State>` / `Immutable<Node>`, but the file's only import is
  `import type { Plugin, Node, State } from "@infinite-monorepo/types-for-plugins"` — `Immutable` is never imported.
  Confirmed this is a genuine bug (not a global ambient type) by checking `package.json`: unlike every other plugin
  reviewed in this batch, `plugin--tosort` does **not** list `@monorepo-private/ts--types` as a dependency at all
  (neither `dependencies` nor `devDependencies`). Every other plugin explicitly does
  `import type { Immutable } from "@monorepo-private/ts--types"`. This should fail `tsc --noEmit` with "Cannot find name
  'Immutable'."
- **G10-P2-01 (Minor, dead code)** — `PLUGIN_ENTRY = Symbol("tosort")` and `interface PluginStateⳇSpec {}` are declared
  but never used anywhere in the file (no `reduceꓽplugin_area` call references them) — leftover copy-paste from the pnpm
  plugin's structure.
- **G10-P2-02 (Minor, dead code)** — `onꓽload` has a commented-out line
  `//state = StateLib.declareꓽfile_manifest(state, manifestꓽpnpmᝍworkspaceᐧyaml)` referencing a symbol that isn't even
  imported/defined in this file — further evidence of stale copy-paste from the pnpm plugin.
- **G10-P3-01 (Minor)** — `onꓽnodeⵧdiscoveredⵧfirst_time` and `onꓽnodeⵧdiscoveredⵧbfs` are both complete no-ops (empty
  switch branches returning state unchanged).
- **G10-P4-01 (Minor)** — `package.json` lists `types-for-plugins` under `devDependencies` despite live usage in
  `src/index.ts` — same misclassification pattern noted in `readme`/`license`/`changelog`.

Recommendation: either finish implementing vendored-dependency handling and add the missing `ts--types` dependency +
import, or reduce this to an explicit "not yet implemented, intentionally no-op" stub without the crash-on-use landmine.
