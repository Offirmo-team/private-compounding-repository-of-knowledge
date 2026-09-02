# Review: @monorepo-private/tui

Incubator package intended to provide Offirmo's terminal-UI (TUI) wrapper around the third-party
`@earendil-works/pi-tui` library; currently just an experimentation sandbox.

## Findings

- **TU-01 (Critical)** — The package's actual public entrypoint, `module/src/index.ts` (the file pointed to by
  `package.json`'s `exports["."]`), is a single line:
  `import { TUI, Text, Editor, ProcessTerminal } from "@earendil-works/pi-tui"`. None of these four imports are used,
  re-exported, or referenced anywhere else in the file — the file has zero exports and zero behavior. Any consumer
  importing `@monorepo-private/tui` gets an empty module. This is the strongest finding for this package: as published,
  it delivers nothing.
- **TU-02 (Major)** — The only working code lives under `module/~~sandbox/`, which is explicitly experimentation/scratch
  space, not the package's real API surface. Within that sandbox, `~~sandbox/index.ts` builds a full `TUI` (with a
  `Loader`, `Text`, `Editor`, Ctrl+C handling via `matchesKey`, and a debug handler) but never starts it — `tui.start()`
  is commented out at line 63 — so even this richer demo does nothing if run. By contrast, `~~sandbox/hello-world.ts` is
  a simpler but complete example that does call `tui.start()`. This suggests `index.ts`'s sandbox demo was left
  mid-edit.
- **TU-03 (Minor)** — `package.json`'s check script is named `"_check"` (underscore-prefixed, line 11) rather than
  `"check"`, which is the convention used by every other package in this batch (typically
  `"check": "run-s test check:ts"` or `"check": "run-s check:ts"`). There is no top-level `"check"` script at all here,
  so this package won't be picked up by any tooling/workflow that runs `pnpm check` or `run-s check` across the monorepo
  — looks like an accidental rename/typo rather than an intentional deviation.
- **TU-04 (Minor)** — No `README.md` in this package. For an incubator package with a still-empty real entrypoint and
  only sandbox demos, a short note on intended scope/status would help distinguish "not started yet" from "broken".
- **TU-05 (Nit)** — No tests at all (no `*.tests.ts` files) despite `vitest`/`mocha`/`chai`/`sinon` devDependencies
  present — expected at this early incubator stage, not a real gap yet given there's no real API to test.

No other issues found. `tsc --noEmit` passes cleanly (0 errors). `@monorepo-private/assert` is declared as a dependency
but not imported anywhere in `module/src/` or `module/~~sandbox/` — consistent with the same recurring unused-dependency
pattern seen elsewhere in this batch, though less noteworthy here given how little code exists yet. No unnecessary
OOP/class usage in this codebase's own code; `~~sandbox/theme.ts`'s `new Chalk({ level: 3 })` is third-party (`chalk`)
class usage, not a style violation. No command-injection/shell concerns — no subprocess spawning; this package only
wires up an interactive terminal UI.
