# Review: page-loaded

Purpose: exposes `document`'s "DOMContentLoaded" and "load" readiness states as two ordered, awaitable singleton
promises (`ೱᐧDOMContent_loaded`, `ೱᐧpage_loaded`), computed once at module-import time.

## Findings

- **G6-P11-01 (Major)** — README example uses a name that doesn't exist. `README.md` shows
  `import { ೱᐧDOMContentLoaded } from "@monorepo-private/page-loaded"`, but the actual exported symbol in
  `module/index.ts` is `ೱᐧDOMContent_loaded` (with an underscore before `loaded`, matching the naming style of the other
  export `ೱᐧpage_loaded`). Copy-pasting the README example will throw at import time (named export not found) / fail
  typecheck. Either the README or the export name needs fixing.

- **G6-P11-02 (Major)** — No tests exist for either exported promise, despite both encoding non-trivial browser-timing
  logic (three separate `readyState` branches per export, cross-promise ordering guarantee between `ೱᐧDOMContent_loaded`
  and `ೱᐧpage_loaded`). This is exactly the kind of race-condition-prone code (see G6-P11-03, G6-P11-04) that benefits
  most from unit tests with a mocked `document`/`window` (e.g. via vitest + jsdom, simulating each `readyState` value
  and the `DOMContentLoaded`/`load` events firing at different times relative to module evaluation).

- **G6-P11-03 (Minor)** — Both promises can hang forever with no way to detect it. `Promise.withResolvers()` is used and
  `reject` is destructured in both IIFEs (lines 24, 55) but never called anywhere — if the `load` (or, theoretically,
  `DOMContentLoaded`) event is somehow never fired (e.g. non-standard embedding contexts, some headless/test
  environments that don't dispatch `load`), `ೱᐧpage_loaded`/`ೱᐧDOMContent_loaded` simply never settle, and any `await`
  on them hangs silently with no timeout or diagnostic. Since `reject` is captured but dead, this looks like it was
  intended to be wired to a timeout/error path and never was.

- **G6-P11-04 (Minor)** — Declared dependency `@monorepo-private/assert` (in `package.json`) is not used anywhere in
  `module/index.ts` — no import, no assertion call. Either dead/stale dependency entry, or a signal that some planned
  input validation (e.g. asserting `document`/`window` exist before use) was never added.

- **G6-P11-05 (Nit)** — Copy-paste debug-log mislabeling. In the `ೱᐧDOMContent_loaded` IIFE's "already loaded" branch
  (lines 37-38), the second debug line incorrectly says `` `ೱᐧpage_loaded: resolving…` `` instead of
  `` `ೱᐧDOMContent_loaded: resolving…` ``. Only affects console output when the module-level `DEBUG` flag is flipped to
  `true`; cosmetic only, but could mislead someone debugging load-order issues.

No other issues found. The core `readyState`-branching logic itself is correct for all three states (`loading` /
`interactive` / `complete`) for both events, correctly handles the "already fired" race by checking `readyState` before
attaching a listener, and the explicit chaining of `ೱᐧpage_loaded` through `ೱᐧDOMContent_loaded.then(...)` correctly
guarantees resolution order even when the page is already fully loaded at import time. No unnecessary OOP/class usage —
pure functions and closures throughout.
