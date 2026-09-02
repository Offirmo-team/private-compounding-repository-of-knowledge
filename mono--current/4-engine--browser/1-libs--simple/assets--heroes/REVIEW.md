# Review: `assets--heroes`

Purpose: a private package holding a single licensed hero-character illustration (image + crediting metadata + avatar
viewport info) for use in a game/RPG UI.

## Findings

### G6-P2-01 — Critical

`module/licensed/offirmo/female-001/asset.tsx` imports its author from a subpath that doesn't exist:

```
import AUTHOR from "@monorepo-private/credits/src/authors/Offirmo"
```

`credits`' `package.json` only exposes `"./authors/*": "./module/src/l3-authors/*/index.ts"`, i.e. the correct import is
`@monorepo-private/credits/authors/Offirmo` (no `/src`). This fails module resolution (`tsc --noEmit` → `TS2307`) and
would fail at runtime/bundle time too.

### G6-P2-02 — Critical

The package's single asset is out of sync with the current `Asset` type contract (same drift pattern as 2 of the 4
assets in sibling package `assets--background`):

- `asset.tsx` sets `type: "illustration"`, which isn't a valid `Asset.type` (valid values include `"imageⵧillustration"`
  etc.) — `TS2322`.
- `asset.tsx` builds the object with a `local_url` field, but `Asset` has no such property (the correct field is `url`)
  — `TS2353`.
- `index.tsx` then reads `ASSET.local_url`, which doesn't exist either — `TS2339`.

Together with G6-P2-01, this means `asset.tsx`/`index.tsx` cannot typecheck, and the module would likely throw or
silently produce `undefined` URLs if actually loaded.

### G6-P2-03 — Major

Several type-only imports are written as regular imports, violating the project's `verbatimModuleSyntax` tsconfig
setting (`TS1484`): `Thing`, `WithOnlinePresence`, `ThingWithOnlinePresence`, `Asset` in `asset.tsx`, and `Url‿str` in
`module/types.ts`.

### G6-P2-04 — Minor

`react` / `react-dom` are declared as `dependencies`/`peerDependencies`/`devDependencies`, but no source file in this
package (`asset.tsx`, `index.tsx`) contains any JSX or React import — the `.tsx` extension is used purely for
asset-metadata files. Likely an unnecessary leftover from a template (same pattern seen in `font--smallest`).

### G6-P2-05 — Minor

Unlike `assets--background` (which requests `?as=webp&width=...` via Parcel URL query params for its PNGs),
`module/licensed/offirmo/female-001/asset.tsx` loads the raw `.jpg` with no format/size hint
(`new URL("original.jpg", import.meta.url).href`) — a missed optimization opportunity, though may be intentional given
the source format.

### G6-P2-06 — Minor

`module/MANIFEST.json5` is empty (`{}`) — no `description`/`status`/`target`, unlike `font--pixel`/`font--smallest` in
this batch.

## Notes

- No top-level `README.md` for the package itself (only a per-asset `README.txt` crediting the Leonardo.ai generation) —
  same gap as `assets--background`; Minor, not separately itemized.
- No OOP/class usage — plain typed data. Good.
- No other issues found beyond the above.
