# Code Review — `@web-property-outfitter/generator--html`

Generates a full HTML document (`<!DOCTYPE html>` ... `</html>`) as a string from a small typed spec (content blocks,
metas, links, "feature" snippets), used to script/DRY-up static-site HTML page generation.

## Findings

### G12E-P1-01 — Major — No unit tests at all despite `vitest`/`mocha`/`chai` devDependencies wired up

`package.json` depends on `vitest`, `mocha`, `chai`, `@types/mocha`, `sinon`, `@monorepo-private/config--mocha`, but
there is no `*.test.ts`/`*.tests.ts`/`*.spec.ts` file anywhere in the package, and no `"test"` script in `package.json`
(only `_check`, `check:ts`, `demo`, `dev`, `watch:check:ts`). The core logic in `module/src/selectors.ts`
(`getꓽhtml‿str`, `getꓽspecⵧwith_features_expanded`, meta/link stringification, feature expansion switch) is non-trivial
and entirely untested. Given the project's push toward vitest, new tests here should use vitest directly.

### G12E-P1-02 — Major — No escaping of untrusted content when generating HTML (self-acknowledged, but still a live risk)

`_getꓽhtml__head__meta‿str` in `module/src/selectors.ts` (lines ~306-376) builds
`<meta name="${name}" content="${content}">`, `<meta http-equiv="${httpᝍequiv}" content="${content}">`,
`<meta property="${property}" content="${content}">`, and `<link rel="${rel}" href="${href}">` via naive string
interpolation, with a `// TODO escape all content for attributes!!` comment acknowledging the gap. Similarly
`getꓽhtml‿str` (line ~440) interpolates `getꓽlang(spec)` and `data_attributes.join(" ")` directly into the `<html ...>`
tag attributes, and `_getꓽhtml__body‿str`/`_getꓽhtml__head‿str` inject raw HTML/CSS/JS blocks with zero sanitization.
This is acceptable if all callers are 100% trusted authors (which seems to be the intended usage — static site
generation from developer-authored specs), but there is no guard/assertion preventing e.g. a `"` inside a title or meta
content from breaking out of an attribute and injecting extra attributes/markup. Given the tool's stated purpose (SSG
for developer content, not user input), this is low actual risk in practice, but worth calling Major since it's
explicitly flagged as unfinished in the code itself and no test protects against regressions.

### G12E-P1-03 — Minor — Dead import `assert_from` in `selectors.ts`

`module/src/selectors.ts` line 3: `import { assert_from, assert } from "@monorepo-private/assert"` — `assert_from` is
never used anywhere in the file (only `assert` is used, 5 times). Dead import should be removed.

### G12E-P1-04 — Minor — `module/src/data/index.ts` (`HTML_ELEMENTS`, `HTML_ELEMENTSⵧDEPRECATED`, `HTML_ELEMENTSⵧEXPERIMENTAL`) is exported from the file but never imported/used anywhere else in the package, and not re-exported from `module/src/index.ts`

`module/src/index.ts` only does `export * from "./types.ts"` and `export * from "./selectors.ts"` — it never re-exports
`./data/index.ts`. So these three exported constants are effectively dead code / unreachable from the package's public
API, unless intentionally kept as an internal reference table for future use. If that's the intent, a short comment
saying so would help; otherwise it's unused code that should be wired in or removed.

### G12E-P1-05 — Minor — Broken/stale import path in demo — `##demo/demo--personal-blog/index.ts` imports a fixture path that does not exist

`module/##demo/demo--personal-blog/index.ts` line 5:

```ts
import { SPEC } from "../../src/__specs/__fixtures/specs--blog--personal.js"
```

There is no `module/src/__specs/` folder; the actual fixture lives at `module/src/__fixtures/specs--blog--personal.ts`
(note also `.js` vs `.ts` extension, and no `__specs` segment). This demo entry point is broken and would fail to
run/resolve as-is.

### G12E-P1-06 — Nit — `module/src/__fixtures/specs--defaults.ts` is a byte-for-byte duplicate of `specs--blog--personal.ts` and is unused

`diff` between the two fixture files shows zero differences, and neither `specs--defaults.ts` nor
`specs--blog--personal.ts` is imported by any `.ts` file in the package except the (broken, see G12E-P1-05) demo. This
looks like a copy-paste leftover; if `specs--defaults.ts` is meant to represent different (default) content, it
currently doesn't.

### G12E-P1-07 — Nit — Several long-standing `TODO`s in the type/selector layer without tracking

Multiple inline `TODO` markers across `module/src/types.ts` (CSP type body, `robots` meta, `properties`/`itemprops`
TODO-only stubs, `referrer` TODO, `content-language` re-evaluate) and `module/src/selectors.ts` (`// TODO defaults?`,
`// TODO normalize?`, `// TODO extract to a function`, `// TODO better, using infos from author`,
`// TODO check IW10 <14k`). None are blocking, but the sheer number suggests the package is still very much a WIP
(consistent with `"status": "experimental"` in `MANIFEST.json5`) — flagged here just for visibility, not requesting
action.

### G12E-P1-08 — Nit — `console.warn` used as a "not implemented" placeholder for `analytics--google`, `site-verification--google`, `page-loader--offirmo` features

`module/src/selectors.ts` line ~167: when a caller requests one of these `FeatureSnippets`, the code silently
`console.warn`s "TODO implement feature" and moves on, rather than throwing. This means a caller who explicitly asks for
e.g. `"analytics--google"` gets a page with no analytics and only a console warning — silent-ish partial failure.
Contrast with the `default: throw new Error(...)` case for genuinely unknown features. Worth deciding if these
half-implemented features should throw too (to fail loudly) until actually implemented, especially since they're already
listed in the public `FeatureSnippets` enum and thus selectable by consumers.

### G12E-P1-09 — Nit — `notes.md` is a single one-line TODO, `README.md`/`notes.md` don't fully describe current capabilities

`module/notes.md` is just
`TODO https://github.com/h5bp/html5-boilerplate/blob/main/docs/html.md#the-order-of-the-title-and-meta-tags` (matches
the ordering comment already present in `selectors.ts`, so it's an accurate but very sparse note). `README.md` describes
the _motivation_ for the tool well but doesn't mention the actual public API (`getꓽhtml‿str`, `getꓽfeatures`,
`HtmlFileSpec`, `FeatureSnippets`) or how to use it — a newcomer reading only the README wouldn't know how to call the
library. Not a bug, just an accuracy/completeness gap worth noting.

## No other issues found

The core module (`types.ts`, `selectors.ts`, `data/index.ts`, snippet files) is otherwise consistent with the monorepo's
functional-programming conventions: no classes, functions take their spec as an explicit parameter and don't mutate it
directly (feature-expansion uses `structuredClone` before mutating the clone), naming is consistent with the surrounding
codebase's unusual-but-established Unicode-operator naming convention. `package.json` `exports`/`dependencies` look
consistent with actual imports used in the code (`typescript-string-enums`, `@monorepo-private/assert`,
`@monorepo-private/normalize-string`, `@monorepo-private/ts--types--hypermedia`, `@monorepo-private/type-detection` are
all genuinely imported and used). No outdated-dependency issues could be conclusively identified since versions are
pinned via `catalog:`/`workspace:*` (managed centrally, out of scope for a per-package review).
