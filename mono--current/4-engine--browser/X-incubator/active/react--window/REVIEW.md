# Review — react--window

Intended purpose (per package name/location): a React helper related to browser window sizing, alongside its siblings
under `4-engine--browser/1-libs--simple/`. Actual purpose cannot be determined — see findings below.

## Findings

- **G6-P17-01** (Critical) — Both source files are completely empty: `module/src/index.tsx` (0 bytes) and
  `module/src/index.stories.tsx` (0 bytes). `package.json`'s `exports` field points `"."` to `./module/src/index.tsx`,
  so importing this package from any consumer resolves to an empty module — no component, no exports, nothing.
  `git log --follow` on `module/src/index.tsx` shows it has been empty since its very first commit ("init from old
  repo", originally copied from `stack--2021/5-incubator/inactive/bhbv/client--browser--core/src/index.tsx`, itself
  already empty) — this was never implemented, just scaffolded and carried forward through multiple monorepo
  moves/renames.
- **G6-P17-02** (Major) — `package.json` declares `"@types/react"` and `react`/`react-dom` as (dev/peer) dependencies
  and is laid out like a React component package, but contains zero React code. Either this package should be
  implemented, or it should be removed/archived to avoid confusion and unnecessary dependency weight, since right now
  it's pure scaffolding with no functionality and no tests possible (there is nothing to test).
- **G6-P17-03** (Minor) — `module/MANIFEST.json5` is `{}` — no description, no metadata — consistent with the rest of
  the package being an unfilled stub.
- **G6-P17-04** (Minor) — No README, no notes.md documenting intent, so a future maintainer has no signal on what
  "react--window" was meant to do (window resize hook? window dimensions provider? portal to `window`? unclear from the
  name alone given no code exists).

## No other issues found

There is no code to review for bugs, hook correctness, XSS, dead code beyond the above, or OOP/class usage — the package
is an empty stub in its entirety.
