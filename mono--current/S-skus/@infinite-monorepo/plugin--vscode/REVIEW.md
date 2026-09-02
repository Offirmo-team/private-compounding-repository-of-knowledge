# Review: plugin--vscode

Intended to write `.vscode/settings.json` (per `notes.md`, e.g. `{ "deno.enable": true }`) and gitignore `.vscode/*`
except `extensions.json` — currently unimplemented.

## Findings

- **G10-P1-01 (Major)** — `module/src/index.ts`'s `PLUGIN` object only implements `onꓽload`, which returns state
  unchanged — there is no `onꓽapply`, so nothing is ever written. This mirrors `plugin--jetbrains` exactly: a documented
  intent in `notes.md` that was never implemented.
- **G10-P1-02 (Minor)** — Consequently, several imports are dead/unused: `semver`, `RepoPathⳇRelative`,
  `PATHVARⵧROOTⵧREPO`, `MonorepoPathⳇRelative`, `PATHVARⵧROOTⵧMONOREPO`.
- **G10-P2-01 (Minor)** — `package.json` lists `semver` (and its `@types/semver` devDependency) as dependencies that are
  entirely unused given the above.

Recommendation: implement the behavior described in `notes.md` (write `.vscode/settings.json` with `deno.enable: true`,
and the corresponding gitignore exception for `extensions.json`) or strip the dead imports/deps until it's picked up —
same recommendation as for `plugin--jetbrains`.
