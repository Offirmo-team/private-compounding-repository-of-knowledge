# Review: plugin--vite

Adds Vite dev-server scripts (demo/sandbox/storypad/start) and manages `vite.config.ts` for browser-target packages.

## Findings

- **G10-P1-01 (Major, compile error — duplicate import)** — `module/src/index.ts` imports `Node` and `State` twice from
  the same module:
  ```ts
  import type {
    PackagePathⳇRelative,
    StructuredFsⳇFileManifest,
    Node,
    State,
    Plugin,
    FileOutputAbsent,
    FileOutputPresent,
  } from "@infinite-monorepo/types-for-plugins"
  import { type Node, PATHVARⵧROOTⵧPACKAGE, type State } from "@infinite-monorepo/types-for-plugins"
  ```
  `Node` and `State` are each imported once in the `import type {...}` block and again in the second `import {...}`
  statement from the same module — TypeScript will report a duplicate-identifier error for both (`tsc --noEmit` should
  fail on this file). Only `PATHVARⵧROOTⵧPACKAGE` actually needed the second import statement; `Node`/`State` should be
  removed from one of the two.
- **G10-P2-01 (Minor)** — Hardcoded fixed dev-server port shared across demo/sandbox/storypad scripts
  (`VITE__COMMON_OPTIONS = ["--port 1981", ...]`) — same fixed-port pattern (and same port number, 1981) as
  `plugin--parcel`, so the two plugins already collide with each other on that port if a package used both; worth noting
  even though each individual plugin's own scripts wouldn't run concurrently with themselves.

No other issues found in the `onꓽnodeⵧrefine`/`onꓽapply` logic itself.
