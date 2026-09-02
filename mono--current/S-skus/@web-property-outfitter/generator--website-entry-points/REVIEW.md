# Code Review — `@web-property-outfitter/generator--website-entry-points`

Top-level generator that assembles all the "entry point" files of a website/webapp
(index/404/error/about/contact/support/terms/privacy-policy HTML pages, webmanifest, favicons/icons, well-known files,
robots/humans/ads/trust.txt, host-specific config files, and optionally a scaffolded JS/TS app) into a single
`WebPropertyBundle` map and writes them to disk, orchestrating `generator--html` and `generator--svg`.

## Findings

### G12E-P3-01 — Major — Package-wide `tsc --noEmit` failure (20 distinct errors across ~9 files), several of which are compile-breaking bugs specific to this package

Running `tsc --noEmit -p tsconfig.json` fails with 20 errors. The following are genuine, in-scope bugs (as opposed to
pre-existing errors surfacing from other packages' own source, e.g. `generator--svg`'s `reducers.ts`,
`generator--html`'s `snippet--normalize-url.ts`, `json-stable-stringify`, `ts--types--hypermedia`, which are out of
scope / already tracked in their own package reviews):

- `module/src/__fixtures/specs--blog--personal/index.ts:70` — uses `PRESETꘌblog` but never imports it (`TS2304`).
- `module/src/__fixtures/specs--game--tbrpg/index.ts:96` — uses `PRESETꘌappⵧimmersive` but never imports it (`TS2304`),
  and line 13 imports from `"../.."` which resolves outside `module/` entirely (`TS2307`, should be
  `"../../../src/index.ts"` or similar).
- `module/##demos/demo--pure-defaults/index.ts` — 3 errors (`TS2741`): assigns partially-populated literals to
  fully-required types `Author`, `WithOnlinePresence`, `WebPage` instead of using `Partial<...>`, so this "pure
  defaults" demo does not actually compile.
- `module/src/generate--html/snippets/js/snippet--github-pages--redirect-extensionless.ts` — uses browser globals
  (`location`) under this package's node-flavoured `tsconfig.json` (no DOM lib), 6 errors (`TS2304`) plus one
  implicit-`any` (`TS7006`). Same class of issue as an existing finding in `generator--html`'s own
  `snippet--normalize-url.ts`, but this is a distinct file inside _this_ package.
- `module/src/generate--html/pages--common/selectors.ts:2` and `module/src/selectors/index.ts:337` — both do
  `const chroma = ((await import("chroma-js")) as any).default as chroma.ChromaStatic`; `@types/chroma-js@3.1.2` no
  longer exports `ChromaStatic`, producing `TS2694`/`TS7022` in both files (duplicated pattern, likely copy-pasted).
- `module/src/selectors/index.ts:349` — imports `Emoji` as a value import but only uses it as a type
  (`getꓽiconⵧemoji(...): Emoji`), violating `verbatimModuleSyntax` (`TS1484`).

This means `check:ts` is currently broken for the package as a whole.

### G12E-P3-02 — Major — Icon/favicon generation is largely unimplemented despite being explicitly named in the package's purpose

`module/src/generate--icons/index.ts`:

```ts
function generateꓽfile(spec, size): Svg‿str | Buffer {
  throw new Error(`NIMP!`)
  /* ... commented-out real implementation using Resvg ... */
}
function generateꓽfixed_sizes(spec): EntryPoints {
  console.warn(`TODO generate fixed size icon files!`, getꓽicon__sizes(spec))
  return {}
}
```

Only `generateꓽinline` (the inline-SVG-emoji fallback used inside HTML `<link rel="icon">`) actually works. Fixed-size
PNG/ICO icon generation — despite `getꓽicon__sizes` in `selectors/index.ts` computing an elaborate list of required
sizes (16/192/512/1024 depending on PWA-install intent) — is entirely unimplemented, so any consumer relying on
generated favicon/PWA icon files gets none, silently (a `console.warn`, not a thrown error) in the
`generateꓽfixed_sizes` case, and an outright crash in the `generateꓽfile` case if ever called. Given `MANIFEST.json5`'s
own description explicitly lists "favicons" as a core capability, this is a significant functionality gap.

### G12E-P3-03 — Minor — Dead `assert_from` import, pervasive across the entire package (37 files)

`import { assert_from, assert } from "@monorepo-private/assert"` is imported in 37 files across the package, but
`grep -rn "assert_from(" module --include="*.ts"` returns zero matches — `assert_from` is never actually called
anywhere. This is the same dead-import pattern flagged in the other two `@web-property-outfitter` packages
(`generator--html`, `generator--svg`), but here it is far more widespread (single digits there vs. 37 files here),
suggesting it's likely copy-pasted boilerplate at the top of every new file in this package. Worth a bulk cleanup pass.

### G12E-P3-04 — Minor — Duplicate `case ".ts":` branch in `generate.ts`'s file-writing switch; one branch is dead code

`module/src/generate.ts` (~lines 106-113), inside `writeꓽwebᝍpropertyᝍfiles`'s per-extension formatting switch:

```ts
case ".ts":
    file__content = await Prettier.format(file__content, { ...PRETTIER_OPTIONS, parser: "typescript" })
    break
case ".ts":
    file__content = await Prettier.format(file__content, { ...PRETTIER_OPTIONS, parser: "acorn" })
    break
```

Two `case ".ts":` labels in the same `switch` — JS/TS switch statements only ever match the first one, so the second
branch (using the `"acorn"` parser, presumably intended for a different extension such as `.js`) is unreachable dead
code. Likely a copy-paste-and-forgot-to-change-the-case-label bug; the second case's extension needs correcting (e.g.
`.js`) or the branch should be removed.

### G12E-P3-05 — Minor — Contrast-ratio `assert` only checks truthiness, not the documented "> 4.5:1" threshold

`module/src/generate--html/pages--common/selectors.ts:145`:

```ts
assert(chroma.contrast(colorⵧbackground, colorⵧforeground), `fg/bg contrast should be > 4.5:1!`)
```

`chroma.contrast(...)` returns a number (the actual contrast ratio); `assert(value, msg)` only throws when `value` is
falsy (`0`, `NaN`, etc.), never when the ratio is merely below the 4.5 threshold mentioned in the message. In practice
this assertion can basically never fire even when a spec's chosen colors are visually low-contrast (e.g. ratio `1.2`) —
the check should be `assert(chroma.contrast(...) >= 4.5, ...)`.

### G12E-P3-06 — Minor — No test script or test files at all, despite vitest/mocha/chai devDependencies

`package.json` `scripts` only has `_check`, `check:ts`, `demo`, `dev`, `watch:check:ts` — no `"test"` script, and no
`*.test.ts`/`*.tests.ts`/`*.spec.ts` file exists anywhere in the package (confirmed by search). Yet `devDependencies`
include `vitest`, `mocha`, `chai`, `sinon`, `@types/mocha`, `@monorepo-private/config--mocha` — the same test-tooling
footprint as the other two sibling packages, but here completely unexercised. Given the amount of non-trivial logic
(selectors, icon-size computation, webmanifest assembly, HTML page composition), this is a significant test-coverage
gap, consistent with the `"status": "experimental"` in `MANIFEST.json5` but still worth flagging as this package is the
most complex of the three.

### G12E-P3-07 — Nit — `_getꓽtitle` in `selectors/index.ts` silently falls back to a hardcoded `"Hello, World!"` string

`module/src/selectors/index.ts:150` returns the literal `"Hello, World!"` when no title can otherwise be inferred from
the spec, rather than throwing or warning. This is a plausible intentional friendly default, but it can silently ship a
joke placeholder title into a real generated page if a caller forgets to set `title`/`author.name`/etc. Worth at least a
`console.warn` alongside the fallback.

### G12E-P3-08 — Nit — `ads.txt` and a few other misc root files are generated with literal placeholder content

`module/src/generate--misc-root-files/index.ts` unconditionally emits:

```ts
[`.../ads.txt`]: `placeholder, placeholder, DIRECT, placeholder`,
[`.../trust.txt`]: `datatrainingallowed=no`,
```

`ads.txt`'s placeholder content is not valid/meaningful ad-network data — if a caller doesn't override it, this
non-functional placeholder ships as-is to a real deployed site. Low severity since it's clearly a placeholder, but worth
either omitting the file entirely when not configured, or documenting that it must be overridden.

### G12E-P3-09 — Nit — `CODE_TEMPLATEⵧGENERIC` in `generate--src/index.ts` bakes in leftover dev-scratch content and its own copy of the dead `assert_from` import

The large JS-scaffold template string used to generate `services/auth.ts`, `services/loader.ts`,
`controllers/state--app.tsx`, `controllers/flux.tsx`, and `view/index.tsx` for consumers contains, inside the template
literal itself, both `import { assert_from, assert } from "@monorepo-private/assert"` (so the dead-import pattern gets
propagated into every generated app) and a commented-out block that appears to be a naming-convention cheat-sheet
(`/*function getꓽXYZⵧfoo‿v2()... */`) left over from development. This gets copied verbatim into every scaffolded app
produced by this tool — worth cleaning up before this path is relied upon.

### G12E-P3-10 — Nit — Required disclosure: `module/~~tosort/` folders present (contents not reviewed, per review scope rules)

`module/~~tosort/2023/` (`html--boilerplate`, `iframe--loading`, `xoff`) and `module/~~tosort/2024/`
(`real-favicon-generator`) exist. Per review scope, their contents were not reviewed; noting presence only.

### G12E-P3-11 — Nit — Generated/checked-in artifacts under `~~gen/` and demo `~~output/` folders

`module/~~gen/` contains a 2.3MB screenshot PNG (`Screenshot 2024-11-14 at 17.17.22.png`) checked into git, plus smaller
generated content under `page--404/~~gen/` (another screenshot) and AI-generation transcripts under
`page--privacy-policy/~~gen/genai-20250514/` and `page--terms-and-conditions/~~gen/genai-20250514/`
(`prompt.txt`/`result.md` — the ChatGPT-style prompts used to draft the privacy-policy/terms boilerplate text,
interesting as provenance but arguably not meant to ship in the repo). Additionally,
`module/##demos/demo--personal-blog/~~output/` and `module/##demos/demo--pwa--tbrpg/~~output/` are full checked-in
generated build outputs (HTML pages, webmanifest, a scaffolded `app/` tree, icons, `_headers`/`_redirects`) — i.e. build
artifacts from running the demo, committed to git rather than gitignored. Per review scope, contents not deep-reviewed;
flagging only the checked-in-generated-output pattern and the oversized PNGs.

### G12E-P3-12 — Nit — `generate--html/index-html/temp.md` looks like an accidentally-dropped scratch/draft file

`module/src/generate--html/index-html/temp.md` contains what appears to be an early draft of
`generateꓽhtml__head__style`/`generateꓽhtml__head__script`/`generateꓽhtml__head__meta`/`generateꓽhtml__head`/`generateꓽhtml__body`
function bodies, pasted as raw (badly-reflowed) code inside a markdown file rather than committed as `.ts` — reads like
a leftover scratch buffer from writing `selectors.ts`, not actual documentation. Low severity, but likely safe to delete
since it doesn't describe anything not already implemented in the real `selectors.ts`/`index.ts` files.

### G12E-P3-13 — Nit — No `README.md` at the package root

Unlike `generator--html` and `generator--svg` (which each have a `README.md`, itself flagged as incomplete in their own
reviews), this package has no `README.md` at all — only `module/MANIFEST.json5`'s one-line description and the large,
unstructured `module/notes.md` scratchpad (a dump of TODOs and reference links spanning CSP tooling, app-store CLI
tools, PostHog, PWA articles, and even an apparently-unrelated block of ad-tracking URL examples). A newcomer has no
onboarding doc for this, the most complex of the three packages.

## No other issues found

Beyond the items above, the package is internally consistent with the monorepo's conventions: no classes, `Immutable<T>`
parameters used throughout, reducers/selectors are pure functions, and the elaborate `WebPropertySpec` type in
`types.ts` is well-documented with links to relevant specs. `package.json` dependencies (`@monorepo-private/assert`,
`@monorepo-private/fs--output-file`, `@monorepo-private/json-stable-stringify`, `@monorepo-private/normalize-string`,
`@monorepo-private/timestamps`, `@monorepo-private/ts--types--hypermedia`, `@resvg/resvg-js`,
`@web-property-outfitter/generator--html`, `@web-property-outfitter/generator--svg`, `chroma-js`, `prettier`,
`typescript-string-enums`) are all genuinely imported and used somewhere in the code (`@resvg/resvg-js` only inside the
currently-dead `generateꓽfile` implementation, see G12E-P3-02). The individual page generators (`about`, `contact`,
`page--support`, `page--404`, `page--error`, `page--privacy-policy`, `page--terms-and-conditions`) are thin, consistent
wrappers around a shared `pages--common/selectors.ts::getꓽhtml_doc_spec`, which is a clean composition pattern. No
outdated-dependency issues could be conclusively identified since versions are pinned via `catalog:`/`workspace:*`
(managed centrally, out of scope for a per-package review).
