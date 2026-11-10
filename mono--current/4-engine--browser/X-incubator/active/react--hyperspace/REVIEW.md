# Review — react--hyperspace

A React component rendering a pure-CSS "hyperspace warp" animation (Noah Blon's classic CSS-only starfield effect) with
a selectable image preset and CSS filter overrides.

## Findings

- **G6-P15-01** (Minor) — `getꓽCssⳇfilter__value(effect_spec.filters)` result is assigned to
  `style["--o⋄hyperspace--filter"]` (`module/src/index.tsx:105`) without any escaping/validation of the filter string
  before it lands in an inline `style` attribute. Filters come from static presets and typed `CssⳇFilterSpec` today, so
  this is low risk in practice, but if this component is ever wired to less trusted/user-provided
  `overrides`/`extra_filters` props, unescaped CSS values injected into `style` could allow CSS injection (e.g. breaking
  out via `"); background-image: url(...)"`-style payloads if `getꓽCssⳇfilter__value` doesn't sanitize). Worth
  confirming `getꓽCssⳇfilter__value` sanitizes its inputs, or documenting that `filters`/`overrides` must never come
  from untrusted input.
- **G6-P15-02** (Minor) — `effect_spec.filters.push(...extra_filters)` (line 90) **mutates** `effect_spec.filters`,
  which is a direct reference to `PRESETS[preset].filters` after the shallow-spread
  `{ ...PRESETS["classic"], ...PRESETS[preset]!, ...overrides }` — the spread only copies the top-level `effect_spec`
  object, not the nested `filters` array. Since `PRESETS` is a module-level singleton, every call to
  `<HyperSpace preset="X" extra_filters={[...]} />` permanently appends `extra_filters` onto that preset's shared array,
  corrupting `PRESETS[preset]` for the entire app lifetime (memory leak of accumulating filters + a real
  cross-render/cross-preset bug: rendering the same preset a second time re-uses the polluted array and grows unbounded
  on repeated mounts). This directly violates the project's "avoid mutating inputs" functional-programming guidance and
  is the most concrete bug in this package.
- **G6-P15-03** (Minor) — Unconditional `console.log` on every render (`module/src/index.tsx:82`,
  `` `🔄 <HyperSpace>` ``) with no `DEBUG`/`_debug` gate, unlike sibling packages (`react--starry-sky` gates
  similarly-worded logs behind `DEBUG`). Left-over debug noise.
- **G6-P15-04** (Nit) — Dead/unused import: `useEffect` and `use` (from `"react"`, line 1) are imported but never
  referenced anywhere in the component.
- **G6-P15-05** (Nit) — `duration1`/`duration2` fields are referenced only as comments in the `HyperspaceEffectSpec`
  interface (lines 12-13) — no actual prop lets a caller tune the animation speed; the CSS hardcodes
  `--o⋄hyperspace--duration1: 12s` in `index.css:41`. Either wire these up or drop the placeholder comments per the
  "avoid comments that aren't truly needed" guidance.
- **G6-P15-06** (Nit) — `PRESETS.test` is a duplicate of `PRESETS.fiery` (identical `src_image`/`filters`) purely for
  the author's own manual QA ("currently under test"); harmless but is effectively throwaway/dead content shipped in the
  module.
- **G6-P15-07** (Minor) — No tests exist (mocha/chai or vitest) for this package. Given the mutation bug above
  (G6-P15-02), a basic unit test asserting that rendering the same preset twice with different `extra_filters` does not
  leak filters across renders would have caught it.
- **G6-P15-08** (Nit) — `module/notes.md` is stale scratch content (two commented-out CSS `background-image` lines with
  garbled comment syntax) that reads like leftover copy-paste debris rather than a note; consider cleaning up or
  removing.
- A stray `module/src/.DS_Store` file is checked into `module/src/` — not a code issue but should probably be
  gitignored.

No `dangerouslySetInnerHTML` or DOM manipulation is used; the component is pure JSX. No OOP/class usage — consistent
with the project's functional style.
