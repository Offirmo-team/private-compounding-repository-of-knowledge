# Review: `assets--background`

Purpose: a private package holding a handful of licensed background illustrations (image + crediting metadata) for use
as full-screen backgrounds.

## Findings

### G6-P1-01 — Critical

Two of the four asset modules don't conform to the current `Background`/`Asset` type contract, and the package fails its
own `check:ts` (`tsc --noEmit`).

- `module/licensed/Albert_Weand/adventurers/index.ts` and
  `module/licensed/Digital_Moons/parallax-forest-background/index.ts` build `Background` with a flat `url:` field and
  `Asset.type: "background"`.
- The current types (`module/types.ts` → `Background.asset: Asset`, and `credits`' `Asset` type) require
  `Background = { asset: Asset, ... }` and `Asset.type` to be one of
  `"image" | "imageⵧphoto" | "imageⵧillustration" | ...` — `"background"` isn't a valid value, and a top-level `url`
  isn't a valid `Background` property.
- The other two assets (`LisadiKaprio/sunny-sky`, `Offirmo/two-travelers`) already use the up-to-date `{ asset: Asset }`
  shape and typecheck cleanly.
- Concretely, `tsc --noEmit` reports 4 local errors (2 per stale file): `TS2353` (unknown `url` property) and `TS2322`
  (`"background"` not assignable to `Asset["type"]`).

### G6-P1-02 — Major

The package's declared public entry point doesn't expose any of the actual assets.

- `package.json` → `"exports": { ".": "./module/index.ts" }`, and `module/index.ts` is only
  `export * from "./types.ts"`.
- So importing `@monorepo-private/assets--background` gives you the `Background` **type**, but none of the four concrete
  background constants (`BG` in each `licensed/*/index.ts`).
- The only real consumer found in the repo
  (`4-engine--browser/X-incubator/inactive/client--browser/.../app-content/index.tsx`) doesn't even import via the
  package name — it reaches into a sibling `to-export-to-own-package/assets--background/...` staging folder by relative
  path, suggesting this package is mid-extraction and not yet actually wired up anywhere.

### G6-P1-03 — Major

`package.json` declares `"sideEffects": false`, which is likely inaccurate: every asset module (`adventurers`,
`parallax-forest-background`, `sunny-sky`, `two-travelers`) calls `registerꓽasset_usageⵧload(ASSET)` at module top level
— a genuine side effect on import, used for dynamic crediting. A bundler trusting `sideEffects: false` could tree-shake
that registration call away.

### G6-P1-04 — Minor

`module/licensed/Digital_Moons/space/` is an incomplete asset: it only has a `README.txt` and a `todo/` subfolder
containing unprocessed source PNGs and their own readme — there's no `index.ts`, so it isn't wired into the package at
all (unlike the other four licensed assets).

### G6-P1-05 — Minor

`module/notes.md` and `module/MANIFEST.json5` are effectively empty/unused: `notes.md` is a single stray Parcel-docs
link, and `MANIFEST.json5` is just `{}`. Compare `font--pixel`/`font--smallest` in this same review batch, whose
`MANIFEST.json5` documents `description`/`status`/`target`.

### G6-P1-06 — Nit

Dead commented-out code: `focusesⵧhorizontal`/`focusesⵧvertical` are left commented out (not filled in, not removed) in
`parallax-forest-background`, `sunny-sky`, and `two-travelers`.

### G6-P1-07 — Nit

`adventurers/index.ts` has a `// TODO broken` next to its canonical crediting URL, left unaddressed.

## Notes

- No OOP/class usage — plain typed data objects and pure factory-style modules throughout. Good.
- No unit tests exist, but there's essentially no logic to test (typed data + a side-effecting registration call); not
  flagging test coverage separately given the type-safety failures above are the more actionable issue.
- No other issues found beyond the above.
