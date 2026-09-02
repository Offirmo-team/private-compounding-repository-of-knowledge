# Review: @monorepo-private/credits

Lib for crediting creators (mainly of assets) and tracking recent usage of assets for dynamic crediting — a small
in-memory registry (`l2-aggregator`) plus a growing collection of hard-coded author profiles (`l3-authors/*`).

## Notes on skipped content

Per the review scope rules, the following scratch/generated folders were **not reviewed** for content (presence only
noted):

- `module/##demo/` — contains a single `index.ts` which is just a `// TODO demo printed in the terminal` stub (trivial
  enough to mention, see finding below)
- `module/src/~~demo/browser/` and `module/src/~~demo/node/` — alternate demo entry points

## Findings

### G3-P10-01 — Severity: Critical — Missing type import causes a compile error

`module/src/l3-authors/MapleLeaf68/index.ts` uses `Url‿str` as a type cast
(`const WEBSITE = "http://www.rw-designer.com/user/50229" as Url‿str`) but only imports `Author` at the bottom of the
file:

```ts
import type { Author } from "@monorepo-private/ts--types--hypermedia"
```

`Url‿str` is a regular exported type from `@monorepo-private/ts--types--hypermedia` (not global/ambient — confirmed by
checking that package's source), so this is a genuine "Cannot find name 'Url‿str'" error under `tsc --noEmit`. Every
other author file (e.g. `vyznev/index.ts`) correctly imports both `Author` and `Url‿str`. This will break the package's
own `check:ts` script.

### G3-P10-02 — Severity: Major — Zero test coverage despite full test tooling being present

No `.tests.ts` file exists anywhere in this package, and `package.json` has no `test` script at all — yet `chai`,
`mocha`, `sinon`, `@types/mocha`, and `vitest` are all listed as devDependencies. None of the real logic
(`registerꓽasset_usageⵧload/start/end`, `getꓽassetsⵧrecents`, `getꓽurl`, `getꓽpath`) is tested. Per the migration
guidance, any new tests here should be written in vitest.

### G3-P10-03 — Severity: Minor — `getꓽassetsⵧrecents(n)` ignores its own parameter

```ts
function getꓽassetsⵧrecents(n = 12): Immutable<Array<Immutable<Asset>>> {
  return STORE.assetsⵧrecents
}
```

in `module/src/l2-aggregator/index.ts`. The `n` parameter is never used in the body; the function always returns the
entire `assetsⵧrecents` array (itself already capped at 12 by `.slice(0, 12)` in `registerꓽasset_usageⵧstart`). Calling
`getꓽassetsⵧrecents(3)` still returns up to 12 items — the signature promises a slice that never happens.

### G3-P10-04 — Severity: Minor — `registerꓽasset_usageⵧend` is an empty stub

```ts
function registerꓽasset_usageⵧend(asset: Immutable<Asset>): void {
  // TODO useful?
}
```

in `module/src/l2-aggregator/index.ts`. It's exported and presumably called by consumers expecting some bookkeeping
(paired with `…ⵧload`/`…ⵧstart`), but currently does nothing. Either implement it or remove it from the public API until
it's needed.

### G3-P10-05 — Severity: Minor — `package.json`'s `demo` script points at a non-functional stub

The `demo` script runs `module/##demo/index.ts`, whose entire content is `// TODO demo printed in the terminal` —
running `npm run demo` currently does nothing. The actually-working demo logic (using `terminal-image` and the
`__example/scifi-city-solar-01` asset) lives instead in the excluded `module/src/~~demo/node/index.ts`, which nothing in
`package.json` references.

### G3-P10-06 — Severity: Minor/Legal — Example asset shipped with an explicitly unresolved license

`module/src/__example/scifi-city-solar-01/LICENSE` reads:

```
LICENSE PENDING

This is an undistributed prototype.

I will contact the author of the image to ask for permission to use it if sth ever get released.
```

This is a real risk if the package/example is ever published or the image bundled into a release — permission for
`original.jpg` has not been obtained from its author. Additionally, the sibling `README.md` in the same folder says
"license: see license.txt", but the actual file is named `LICENSE` (no `.txt`, different case) — a stale/incorrect
cross-reference.

### G3-P10-07 — Severity: Nit — Module-level mutable singleton (`STORE`) as implicit global state

`module/src/l2-aggregator/index.ts` defines a module-level
`const STORE: AssetStore = { assetsⵧall: new Set(...), assetsⵧrecents: [] }` that all the exported functions read/mutate
as a side effect. This is a reasonable pattern for a process-wide registry, but it does sit against the project's
general FP guidance ("functions should avoid reading any outside data not provided as an input"). Flagging as a style
note, not a bug — a registry likely needs _some_ shared state.

### G3-P10-08 — Severity: Nit — `_getꓽurl_tobind` / `_getꓽpath_tobind` use a `this`-binding, OOP-adjacent idiom

Still in `l2-aggregator/index.ts`:

```ts
function _getꓽurl_tobind(this: Immutable<Asset>): Url‿str {
  return getꓽurl(this)
}
```

consumed via `.bind(ASSET)` in `__example/scifi-city-solar-01/index.credits.ts`. This isn't a class, but the TS
`this`-parameter + `.bind()` pattern mimics OOP method binding rather than a plain function taking the asset as an
explicit argument. A plain curried/partial-application helper (e.g.
`bindꓽasset(asset) => ({ getꓽurl: () => getꓽurl(asset), ... })`) would be more idiomatic for this codebase's stated FP
style, though the current form is functional and does work.

### G3-P10-09 — Severity: Nit — Misplaced personal notes file

`module/src/l3-authors/Offirmo/wishlist.md` contains a list of unrelated URLs (creativeconfidence.com, danpink.com book
pages, scottmccloud.com comics-theory pages) with no apparent connection to crediting the "Offirmo" author. Looks like a
stray personal note that ended up in the wrong folder.

### G3-P10-10 — Severity: Nit — No README at package root

There's no `README.md` describing the package's layout (`l1-types` → `l2-aggregator` → `l3-authors/*`) or how to add a
new author profile; the only README present is the asset-specific one inside `__example/scifi-city-solar-01/`.

No other issues found beyond the above — the `l1-types`, `l2-aggregator`, and `l3-authors/*` code (aside from G3-P10-01)
is otherwise straightforward and consistent with the project's functional style (no classes, plain data + pure
functions).
