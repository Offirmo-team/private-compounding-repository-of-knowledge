# Review — @monorepo-private/css--utils--diagnostics

A CSS-only stylesheet that visually flags problematic/deprecated/inaccessible/insecure HTML patterns (empty elements,
deprecated tags/attributes, missing alt text, insecure links, etc.) for use during development.

Note: this package contains a `module/~~tosort` folder (`2025/debug/index.stories.ts`, `2025/debug/index.css`) holding
unsorted/legacy code slated for removal — not reviewed here.

## Findings

- **G5-P1-01** (Minor) — `module/src/index.stories.ts:1` sets `const LIB = "@monorepo-private/css--foundation"` and the
  `Intro()`/`ResetꓽBase()` demo text describes "a CSS foundation layer" and CSS reset/normalization advice. This looks
  like copy-pasted content from a different package (`css--foundation`/`css--reset`) — it doesn't describe this
  package's actual purpose (diagnostics overlay styling) at all.
- **G5-P1-02** (Minor) — `package.json` declares a runtime dependency on `@monorepo-private/assert`, but nothing under
  `module/src` imports or uses it. Looks like leftover/dead dependency (possibly copied from another package's
  package.json, consistent with G5-P1-01).
- **G5-P1-03** (Minor) — `module/src/index.stories.ts:602` (`ColorsAsCSSVariablesTable`) has a stray
  `console.log({ radixes, caption })` left in — debug leftover, should be removed.
- **G5-P1-04** (Nit) — `module/src/index.stories.ts` contains sizeable blocks of commented-out code
  (`BackdropsBackgrounds`, `Fonts`, part of `Containers`, `Experimental`) and two stub functions (`Containers()`,
  `Experimental()`) that just `return "TODO"`. Consider removing or tracking as real TODOs rather than leaving dead/stub
  code in the stories file.
- **G5-P1-05** (Nit) — No `README.md` at the package root, unlike several sibling packages in this batch (e.g.
  `parcel--toolbox`, `react--error-boundary`). Not required, but the `package.json` description ("Some CSS utilities")
  is generic/uninformative given the actual specific purpose (diagnostics overlays).

No other issues found — the CSS diagnostic rules themselves (deprecated tags/attributes, empty-element detection,
accessibility and security-oriented selectors) are sensible and well-organized by severity, with clear section comments.
No classes/OOP (N/A, pure CSS). No tests exist, but this is a static CSS file with no logic to unit test, so that's
expected.
