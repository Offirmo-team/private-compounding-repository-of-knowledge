# Review: plugin--jetbrains

Intended to add JetBrains IDE (`.idea/`) gitignore handling, per its `notes.md` — currently unimplemented.

## Findings

- **G10-P1-01 (Major)** — `module/src/index.ts`'s `PLUGIN` object only implements `onꓽload`, which returns state
  unchanged — there is no `onꓽapply` (or any other hook), so this plugin currently does **nothing**. Confirmed against
  `module/notes.md`, which documents the intended behavior (write `.idea/*  !.idea/dictionaries/` to `.gitignore`) that
  was never implemented — this is a stub, not a working plugin.
- **G10-P1-02 (Minor)** — As a direct consequence, all of the plugin's imports are dead/unused: `semver`,
  `RepoPathⳇRelative`, `PATHVARⵧROOTⵧREPO`, `MonorepoPathⳇRelative`, `PATHVARⵧROOTⵧMONOREPO` — none are referenced
  anywhere in the file.
- **G10-P2-01 (Minor)** — `package.json` lists `semver` as a runtime dependency that is entirely unused given the above.

Recommendation: either finish the implementation described in `notes.md` (write the `.idea/*` gitignore exception) or
remove the plugin/dead imports until it's picked up.
