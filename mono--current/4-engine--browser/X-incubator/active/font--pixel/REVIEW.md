# Review: `font--pixel`

Purpose: a tiny asset-wrapper package exposing the public-domain "PixAntiqua" pixel webfont as a CSS `@font-face` + a
reusable class, for RPG-style UIs.

## Findings

### G6-P4-01 — Major

`package.json` scripts reference tooling that isn't declared as a dependency:

```json
"scripts": {
	"_clean--pkg": "monorepo-script--clean-package …cache …dist",
	"clean": "npm-run-all _clean--pkg"
},
"devDependencies": {
	"@monorepo-private/parcel-config": "workspace:*",
	"@monorepo-private/vite--config--default": "workspace:*"
}
```

`monorepo-script--clean-package` is provided by `@monorepo-private/scripts`, and `npm-run-all` provides the
`npm-run-all` binary — **neither is declared** in `devDependencies`. Every other sibling package reviewed in this batch
(`assets--background`, `assets--heroes`, `better-console-groups`, `font--smallest`) declares both. Running `clean` in
this package in isolation (e.g. outside a hoisted workspace install) would likely fail to resolve those binaries.

### G6-P4-02 — Nit

Naming inconsistency: this package's CSS custom property/class use a generic role name (`--omr⋄font⁚rpg--pixel`,
`.omr⋄font⁚rpg--pixel`) rather than identifying the actual font, whereas sibling package `font--smallest`'s classes
mirror the real font name (`omr⋄font⁚CG-pixel--4x5`). Purely cosmetic/convention drift between the two font packages.

## Notes

- Small, simple, low-risk package as expected: one CSS file (`module/index.css`), one webfont binary
  (`webfont--pixantiqua.woff`), and an accurate 3-line `README.md` crediting the (public domain) font source
  (dafont.com).
- `MANIFEST.json5` and `package.json` (`sideEffects: true`, `hasꓽside_effects: true`) agree with each other.
- No TypeScript source in this package (correctly has no `tsconfig.json`/`check:ts` script), so nothing to typecheck.
- No dead code, no TODO/FIXME markers, no OOP/class usage (not applicable — no logic at all).
- No other issues found beyond G6-P4-01/02.
