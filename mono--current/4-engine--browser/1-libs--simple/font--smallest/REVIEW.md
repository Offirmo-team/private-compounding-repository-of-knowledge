# Review: `font--smallest`

Purpose: an asset-wrapper package exposing the smallest-possible pixel webfont ("CG pixel 4x5") for discreet technical
UI text (e.g. version numbers, timestamps).

Note: this package contains a `module/~~gen/` folder (generated font artifacts: `CG-pixel-3x5`, `CG-pixel-4x5`,
`CG-pixel-4x5-mono`, plus a `notes.md`) holding unsorted/generated font variants — per review scope this was **not**
reviewed for content quality, only its presence is flagged here.

## Findings

### G6-P5-01 — Major

`doc/storypad/index.html` appears to be a stale, dead fixture:

```js
const stories = import.meta.glob("../../src/**/*.stories.(js|jsx|ts|tsx|mdx)")
```

This package's actual code lives under `module/**`, not `src/**` — this glob would match zero files. There is a second,
evidently current fixture at `module/__fixtures/storypad/index.html` with the correct glob (`"../../**/*.stories..."`),
and that's the one actually wired into `package.json`'s `_start:storypad--parcel`/`_start:storypad--vite` scripts. The
`doc/` copy is unreferenced by any script — looks like a leftover from an earlier package layout, safe to delete.

### G6-P5-02 — Minor

`README.md` contains a stray scratch note rather than clean documentation:

```
TOSORT

- Font https://managore.itch.io/m5x7
```

This reads like a personal reminder about an unrelated font, left in the public-facing `README.md`.

### G6-P5-03 — Minor

`module/4x5/index.tsx` imports its author from a subpath that doesn't exist:

```ts
import AUTHOR from "@monorepo-private/credits/src/authors/vyznev/index.ts"
```

Same wrong-subpath bug as in sibling package `assets--heroes` — `credits`' `package.json` only exposes
`"./authors/*": "./module/src/l3-authors/*/index.ts"`, i.e. the correct import is
`@monorepo-private/credits/authors/vyznev`. Fails `tsc --noEmit` (`TS2307`).

### G6-P5-04 — Minor

`module/4x5/index.tsx` builds its `Asset` with a `local_url` field, which — like `assets--heroes` — doesn't exist on the
current `Asset` type (the correct field is `url`); causes `TS2353` at `tsc --noEmit`.

### G6-P5-05 — Minor

Same `verbatimModuleSyntax` violations as the other asset packages in this review batch: `Thing`, `WithOnlinePresence`,
`ThingWithOnlinePresence`, `Asset`, `Url‿str` are imported as regular (non-type-only) imports in `module/4x5/index.tsx`
(`TS1484`).

### G6-P5-06 — Minor

`react` / `react-dom` are declared as dependencies/peerDependency/devDependencies, but none of this package's `.tsx`
files (`module/index.tsx`, `module/4x5/index.tsx`, `module/4x5/index.stories.tsx`) contain any JSX — they all just
export string constants or return template-literal strings. Likely unnecessary, same pattern as `assets--heroes`.

### G6-P5-07 — Nit

Only the "4x5" font variant is wired into `module/index.tsx`
(`export { FONT_FAMILY, CSS_CLASS } from "./4x5/index.tsx"`); the "3x5" and "4x5-mono" variants exist only as raw
generated `.ttf` files under the (out-of-scope) `~~gen/` folder, with no corresponding CSS/wrapper module exposing them.
May be intentional/future work — just noting the asymmetry.

## Notes

- Credits/README for the font itself (Ilmari Karonen, CC-0) look accurate and properly sourced (aside from the stray
  note in G6-P5-02).
- No OOP/class usage — plain function/constant exports. Good.
- No other issues found beyond the above.
