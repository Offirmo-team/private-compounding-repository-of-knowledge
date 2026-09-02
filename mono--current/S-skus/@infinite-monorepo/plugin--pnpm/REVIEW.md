# Review: plugin--pnpm

The most complex package-manager plugin: discovers pnpm workspaces (via `pnpm-workspace.yaml` + glob), manages
pnpm-specific config (`.npmrc`, `pnpm-workspace.yaml`, hoisting/security settings), and writes the pinned
`packageManager` field.

## Findings

- **G10-P1-01 (Critical, reachable crash)** — In `onꓽnodeⵧdiscoveredⵧfirst_time`, when an existing `pnpm-workspace.yaml`
  is found with a `packages` field and the plugin is NOT in `"SSoT"` mode, the code unconditionally throws:
  ```js
  workspaces_lines: (() => {
      const MONOREPO_WORKSPACES_RELPATHS = packages as string[]
      throw new Error("Not implemented hybrid fusion?")
  })()
  ```
  This is a real, reachable crash for any non-SSoT-mode monorepo that already has a populated `pnpm-workspace.yaml` with
  `packages:` — a very plausible real-world state, not just a hypothetical edge case.
- **G10-P1-02 (Minor, likely bug/naming inconsistency)** — In the same code path, the state update spreads into a key
  literally named `spec:` —
  ```js
  state = {
      ...state,
      spec: { ...state.specⵧroot, package_manager: "pnpm", workspaces_lines: ... },
  }
  ```
  Every other read/write of this data elsewhere in the codebase uses the key `specⵧroot`, not `spec`. This looks like a
  naming bug (would silently create a stray `spec` key alongside the real `specⵧroot` rather than updating it) — moot
  today only because the immediately-preceding line throws first, but should be fixed together with G10-P1-01 since
  fixing the throw would expose this second bug.
- **G10-P2-01 (Minor, security-adjacent, self-flagged)** — `onꓽnodeⵧdiscoveredⵧbfs` resolves workspace `packages` glob
  patterns with `globSync`, with the code's own comments **`// TODO beware path traversal`** and
  **`// TODO 1D use the exact same algorithm/blob as pnpm`**. Patterns come from local `pnpm-workspace.yaml`
  (developer-controlled config, not external input), so actual exploitability is low, but this is exactly the kind of
  self-acknowledged risk area worth tracking to completion rather than leaving as a TODO indefinitely.
- **G10-P2-02 (Minor)** — Two filter callbacks in the same discovery loop are no-ops marked `// TODO filter out common`
  and always `return true` — dead/placeholder logic, same pattern as seen in `plugin--bolt`.
- **G10-P3-01 (Minor)** — `onꓽapply` writes a hardcoded `packageManager: "pnpm@11.10.0+sha512...` string with 5 older
  pinned version+hash strings left commented out below it as history, marked `// TODO dynamic`. This is accumulating
  dead-comment history in the source rather than relying on git history/changelog — worth cleaning up, though harmless.
- **G10-P4-01 (Info — folder presence)** — Package contains a `~~tosort` folder: `module/~~tosort/2026/workspace.ts`.
  Its content was not reviewed per review-scope rules, but its presence is noted here as required.
- **G10-P5-01 (Nit)** — `type PnpmSpec = JSONObject // TODO` — placeholder typing, not yet refined.

Positive notes (not issues): `module/src/find-workspace-packages.ts` is a clean, well-documented pure function with
clear rationale for not depending on `@pnpm/fs.find-packages` directly. `module/src/config/workspace.ts`'s two config
presets (`strictest`/`RECOMMENDED`) are well-reasoned and the `delete config.shamefullyHoist` workaround is properly
linked to the upstream pnpm issue (#7312) it's working around.
