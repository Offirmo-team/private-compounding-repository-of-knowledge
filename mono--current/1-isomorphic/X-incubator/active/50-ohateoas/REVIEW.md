# Review: @monorepo-private/ohateoas

Tech-demo library defining a new Hypermedia/HATEOAS format ("OHA") — types, a representation layer, a minimal server
interface, and client-side reducer/selectors to drive a generic HATEOAS-consuming frame (usable by a terminal or React
UI).

## Notes on skipped content

This package contains several scratch/generated/unsorted folders that were **not reviewed** for content, per the review
scope rules:

- `module/~~gen/` (a stray inspiration image at the package root)
- `module/src/~~gen/` (inspiration screenshots/video)
- `module/src/~~demo/`
- `module/src/~~sandbox/`
- `module/src/~~tosort/2025/` — a fairly large amount of legacy/unsorted code (server.ts, terminal/, web/ React+SSR
  files, to-migrate.ts, utils.ts) seemingly slated for migration into the real `src/` tree or removal
- `module/src/__fixtures/example--10-check-for-updates/~~gen/` and `module/src/__fixtures/example--30-tbrpg/~~gen/`
  (inspiration images)

These are excluded from the findings below.

## Findings

### G3-P9-01 — Severity: Critical — Broken test file: imports two non-existent modules

`module/src/30-server/state--frame/reducers.tests.ts` imports `{ LIB } from "./consts.ts"` and
`{ getꓽSXC } from "./sec.ts"`, but neither `consts.ts` nor `sec.ts` exists in `module/src/30-server/state--frame/` (only
`index.ts`, `types.ts`, `selectors.ts`, `reducers.ts`, `reducers.tests.ts` exist). `LIB` and `getꓽSXC` are also never
used in the test body. This test file cannot currently compile/run; `npm test` (mocha, matching `**/*.tests.ts`) will
fail on this file.

### G3-P9-02 — Severity: Major — Legacy mocha/chai test, only one test file for a package with substantial logic

The only test file in this package is `module/src/30-server/state--frame/reducers.tests.ts`, and even that is broken
(see G3-P9-01). It uses mocha + chai (`import { expect } from "chai"`), consistent with the legacy convention (noted,
not flagged as a bug per project convention). Non-trivial logic in `10-representation/selectors.ts` (`getꓽcta`,
`getꓽlinks`, `getꓽengagements`), `01-types/selectors.ts` (`promote_toꓽOHAHyperLink`), `01-types/type-guards.ts`, and
`40-client/selectors.ts` (`deriveꓽaction`) has zero test coverage. Given the migration guidance, any new tests here
should use vitest.

### G3-P9-03 — Severity: Minor — Inconsistent action-blueprint hint key across fixtures: `change` vs `change_type`

The real type `OHAHyperActionBlueprint["hints"]` (in `01-types/types.ts`) declares the field as `change_type`, and
`10-representation/selectors.ts`'s `getꓽcta()` switches on `hints.change_type`. However
`__fixtures/example--30-tbrpg/index.ts` (line 120) and `__fixtures/example--40-hyperspace/index.ts` (line 88) both set
`change: "reduce"` / `change: "none"` instead of `change_type`. Since these blueprints are cast with
`as OHAHyperActionBlueprint`, TypeScript does not catch the typo, but at runtime `getꓽcta()`'s `change_type` switch will
silently fall through to the default case (`▶️ ` prefix) instead of the intended emoji, and the field is otherwise
dead/ignored. This is exactly the kind of "fixture referencing/duplicating logic incorrectly" case worth flagging: these
are real reviewable examples, not scratch code.

### G3-P9-04 — Severity: Minor — Duplicate/near-duplicate fixture content

`__fixtures/example--30-tbrpg/index.ts` and `__fixtures/example--40-hyperspace/index.ts` are almost byte-for-byte
identical (same `URIꘌROOT`, `URIꘌEQUIPMENT`, routing switch, "Welcome to The Boring RPG!" text, etc. — diff shows only
trivial import-order/style differences). Likewise `__fixtures/example--10-check-for-updates/index.ts` and
`__fixtures/example--20-glim/index.ts` overlap heavily (both model a JetBrains-Toolbox-style "installed products / check
for updates" demo, one uses `chalk`/random for an added ice-cream-shop feature). It's unclear whether
`example--40-hyperspace` is intentionally showing an evolution of `example--30-tbrpg`, or a stale leftover copy that
should be deleted or clearly differentiated in its own README/comment.

### G3-P9-05 — Severity: Minor — Inconsistent `.ts` vs `.js` extensions in relative imports

Most relative imports use the real `.ts` extension (e.g. `./types.ts`, `../../01-types/index.ts`), but a few files
import with `.js` even though only `.ts` sources exist: `01-types/type-guards.ts` (`from "./types.js"`),
`30-server/state--frame/reducers.ts` (`from "./types.js"`), `30-server/state--frame/selectors.ts` (`from "./types.js"`).
This works today only because the bundler/TS resolver tolerates it, but it's inconsistent with the rest of the
codebase's explicit `.ts` convention and is easy to get wrong when files get renamed/moved.

### G3-P9-06 — Severity: Minor — Dead/unreachable code after `throw` in fixture

In `__fixtures/example--30-tbrpg/index.ts`, the `"/session/adventures/last"` case does:

```ts
case "/session/adventures/last": {
    throw new Error(`Not implemented!`)
    links[OHALinkRelation.continueᝍto] = "/session/adventures/"
    break
}
```

The `links[...] = ...` and `break` are unreachable dead code after the unconditional `throw`. Minor since it's a
fixture/example, but worth cleaning up as it may confuse readers about intended behavior.

### G3-P9-07 — Severity: Minor — `notes.md` files are just scratchpads / stale TODOs, not documentation

`module/notes.md` is a long braindump of hypermedia design philosophy (useful for context but not really "package
documentation" — there is no README.md at all for this package). `module/src/30-server/notes.md` contains a single
one-line TODO ("TODO use https://itty.dev/itty-router/ !") which duplicates intent already visible in the code; consider
moving it into a code comment or a tracked issue instead of a loose file.

### G3-P9-08 — Severity: Nit — Misleading/redundant comment in `30-server/consts.ts`

```ts
// is this really needed?
export const ROOT_URI: Uri‿str = normalizeꓽuri‿str("")
```

`ROOT_URI` is used in `state--frame/reducers.ts` (`create()`, default `ↆget` param) and by multiple fixtures, so it
clearly is needed — the comment is stale self-doubt left in the code and should be removed.

### G3-P9-09 — Severity: Nit — `package.json` description undersells scope; no README

The `package.json`/`MANIFEST.json5` description ("A reinvention of hypertext to enable advanced HATEOAS web
applications") matches the `notes.md` intent, but there is no `README.md` at the package root describing the actual
module layout (`01-types` → `10-representation` → `30-server` → `40-client`) or how to run the fixtures/examples
(`./examples/*` export map entry). A short README pointing at `module/src/__fixtures/` would help onboarding.

No other issues found beyond the above — the reviewed `src/01-types`, `src/10-representation`, `src/30-server` (incl.
`state--frame`), and `src/40-client` code is otherwise consistent with the project's functional style (no classes, pure
selectors/reducers, immutable state updates via spread).
