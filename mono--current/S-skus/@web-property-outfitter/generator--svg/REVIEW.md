# Code Review — `@web-property-outfitter/generator--svg`

Functional (reducer + selector) library to build and stringify SVG documents programmatically from a plain `SVG` data
structure.

## Findings

### G12E-P2-01 — Critical — `addꓽcontent` is used but never exported from `reducers.ts`; the package currently fails `tsc --noEmit`

`module/src/reducers.ts` defines `function addꓽcontent(...)` (line 109) and uses it internally, but the final
`export { ... }` block (lines 292-308) does NOT include `addꓽcontent` — only `addꓽcontentꘌcontour`, `addꓽcontentꘌmire`,
`addꓽcontentⵧto_group`, etc. are exported. However:

- `module/src/index.tests.ts` line 5-12 does
  `import { createꓽempty, createꓽfrom_emoji, setꓽviewBox, setꓽbackground_color, addꓽcontent, getꓽsvg‿str } from "./index.ts"`
  — this fails to resolve.
- `module/src/index.stories.ts` calls `Reducers.addꓽcontent(...)` three times (lines 59, 75, 102) — same failure.

Running `tsc --noEmit` on this package reproduces this exact error:

```
module/src/index.tests.ts:10:2 - error TS2305: Module '"./index.ts"' has no exported member 'addꓽcontent'.
module/src/index.stories.ts:59:19 - error TS2339: Property 'addꓽcontent' does not exist on type 'typeof import(".../reducers")'.
```

This means `check:ts` (`tsc --noEmit`) is currently broken for this package, and the only unit test file
(`index.tests.ts`) cannot even compile/run. This is a real, live, verified bug — fix is trivial: add `addꓽcontent` to
the export list in `reducers.ts`.

### G12E-P2-02 — Major — `module/__fixtures/examples/index.ts` uses a broken relative import path, also breaking `tsc`

`module/__fixtures/examples/index.ts` line 1: `import type { Svg‿str } from "../../types.ts"`. From
`module/__fixtures/examples/`, going up two levels lands at the package root (outside `module/`), not at
`module/src/types.ts`. The correct relative path should be `../../src/types.ts`. Confirmed via `tsc --noEmit`:

```
module/__fixtures/examples/index.ts:1:30 - error TS2307: Cannot find module '../../types.ts' or its corresponding type declarations.
```

This cascades into `module/src/index.stories.ts` line 4 (`import { getꓽcontentꘌcat } from "./__fixtures/examples"`) also
failing to resolve, since the `package.json` `exports["./examples"]` maps to `_entrypoint.ts` (which itself just
re-exports `./index.ts`) — meaning the "examples" example content (`getꓽcontentꘌcat`, the cute-kitten SVG snippet) used
by 3 of the 6 stories is currently broken.

### G12E-P2-03 — Minor — `addHorzGrad` inner function in `reducers.ts` has an unreachable/unused return type contract issue

`module/src/reducers.ts` lines 176-195: `function addHorzGrad(spacing: number): SVGGroupElement { ... }` is declared to
return `SvgⳇGroupElement`, but the function body never returns anything (it mutates the outer closure `layer` variable
via `addꓽcontentⵧto_group` and returns nothing — no `return` statement at all). `tsc --noEmit` flags this:

```
module/src/reducers.ts:176:41 - error TS2355: A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value.
```

Beyond the type error, this function also violates the "avoid mutating inputs / no side effects on outer scope"
functional-style convention: it reassigns the outer `layer` variable from within a nested closure
(`layer = addꓽcontentⵧto_group(layer, group)`, line 194) instead of returning a new layer and letting the caller assign
it. The return type annotation should simply be removed (or changed to `void`), and ideally the function should be
rewritten to return the group and let the caller append it, consistent with the rest of the reducer style in this file.

### G12E-P2-04 — Minor — `index.tests.ts` uses mocha + chai, not vitest, despite the misleading `.tests.ts` naming and vitest being a devDependency

Per the explicit check requested: `module/src/index.tests.ts` imports `{ expect } from "chai"` and uses mocha's global
`describe`/`it` (no imports for those, relying on the mocha global test runner registered via the `test` npm script,
which invokes `mocha` with `@monorepo-private/config--mocha`). This is legacy mocha+chai, not vitest — consistent with
the monorepo's known migration-in-progress state, so this is not a bug per se, just documented as requested. Note
`vitest` is listed in `devDependencies` but appears completely unused (no vitest config, no `.test.ts` file, no script
invokes it) — it looks like a vestige of an in-progress or planned migration that never happened for this package.

### G12E-P2-05 — Minor — Thin test coverage: only `getꓽsvg‿str()` is tested; `reducers.ts` mutation/update logic, `selectors.ts` (`getꓽlayer`, `getꓽviewbox__dimensions`, `getꓽsvg‿strⵧgroup`), and `types-guards.ts` (`isꓽSVG`, `isꓽSVGGroupElement`) have no dedicated tests

`index.tests.ts` only covers 4 cases (emoji/simple/viewbox/background) through the high-level `getꓽsvg‿str`. Functions
like `updateꓽlayer` (has non-trivial `found`/`has_change` bookkeeping in `reducers.ts` lines 86-107), `addꓽlayer`'s
`assert(layer.id, ...)` guard, and `getꓽlayer`'s not-found assertion in `selectors.ts` are untested. Given the migration
direction, any new tests added here should be vitest, per project convention.

### G12E-P2-06 — Minor — `createꓽfrom_file` is a stub that always throws, with no test and no TODO tracking beyond the message itself

`module/src/reducers.ts` lines 286-288:

```ts
function createꓽfrom_file(raw: Svg‿str): Immutable<SVG> {
  throw new Error("NIMP!")
}
```

It's exported... actually checked: it is NOT exported either (only defined, never included in the `export { ... }`
block) — so it's fully dead/unreachable code from outside the module. If it's a placeholder for future work, fine, but
as-is it's unused code with an unused parameter (`raw` is never read), which a linter would likely flag.

### G12E-P2-07 — Nit — `module/~~sandbox/index.ts` references packages not declared in `package.json` (`@prettier/plugin-xml`, `prettier`, `@resvg/resvg-js`)

This is scratch/sandbox code (per the ignore rules, not held to core-library standards), but flagging for awareness:
`module/~~sandbox/index.ts` imports `prettier`, `@prettier/plugin-xml`, and `@resvg/resvg-js`, none of which appear in
this package's `dependencies`/`devDependencies`. Presumably it relies on hoisted workspace installs elsewhere, or is
simply not meant to be run standalone from this package. Not fixing since it's sandbox code, just noting for
completeness.

### G12E-P2-08 — Nit — `module/~~gen/inkscape.svg` generated artifact checked into git

Per the ignore rules for `~~gen` folders, contents were not reviewed, but noting its presence — a single generated SVG
file, not a large binary, so no action needed.

### G12E-P2-09 — Nit — `notes.md` reads as a scratchpad of unresolved TODOs/links rather than actionable docs

`module/notes.md` is a loose collection of "TODO review other builder", "TODO some svgo?", "TODO use an xml builder?"
bullet points and bare links — consistent with `"status": "experimental"` in `MANIFEST.json5`, so this is expected for a
WIP package, just noted for visibility.

### G12E-P2-10 — Nit — `README.md` is a 3-bullet use-case list, doesn't mention the actual public API (`createꓽempty`, `createꓽfrom_emoji`, `getꓽsvg‿str`, etc.) or usage example

Minor documentation completeness gap, not a bug.

## No other issues found

Aside from the items above, the core files (`types.ts`, `types-guards.ts`, `selectors.ts`, most of `reducers.ts`,
`consts.ts`) follow the monorepo's functional conventions well: no classes, reducers return new objects via spread
rather than mutating their `svg`/`svg_group` inputs (e.g. `setꓽviewBox`, `addꓽlayer`, `updateꓽlayer`,
`addꓽcontentⵧto_group` all return fresh objects), and naming is consistent with the codebase's established
Unicode-operator convention. `package.json` `exports`/dependencies otherwise line up with actual imports
(`@monorepo-private/assert`, `@monorepo-private/ts--types--hypermedia` are genuinely used). No outdated-dependency
issues could be conclusively identified since versions are pinned via `catalog:`/`workspace:*` (managed centrally, out
of scope for a per-package review).
