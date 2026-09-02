# Review: style-once

Purpose: idempotently inject a `<style>` (inline CSS) or `<link rel="stylesheet">` (external CSS) element into
`document.head`, keyed by an `id`, so that importing the same styles multiple times only inserts them once.

## Findings

- **G6-P13-01 (Major)** — `document.getElementById(id)` existence check doesn't verify the element is actually a
  style/link tag it previously created. If any other element on the page already happens to have the same `id` (e.g. a
  `<div id="style">`, matching the README's own example `id: "style"`), `style_once()` silently returns that unrelated
  element instead of ever inserting the requested `<style>`/`<link>` — the CSS is never applied, and no error or warning
  is raised. Given `id` is caller-chosen and there's no namespacing/prefix convention enforced, this is a plausible
  real-world collision (especially with a generic id like `"style"` as shown in the package's own README). Consider at
  least checking `existing‿elt.tagName` matches what's expected (`STYLE`/`LINK`) before treating it as "already
  inserted", or scoping ids with a package-specific prefix.

- **G6-P13-02 (Minor)** — Inconsistent mutual-exclusivity / required-ness validation ordering. The `css`/`href` conflict
  check (`if (css && href) throw ...`) and the "neither provided" check (`throw ... "you must provide css or href!"`)
  are both correct, but they live inside the `element` IIFE which only runs when `existing‿elt` is falsy — meaning a
  caller invocation with a bad/contradictory `Params` (e.g. both `css` and `href`, or neither) will _not_ throw at all
  if an element with the same `id` already happens to exist. The validation is therefore only partially enforced,
  dependent on call order / prior state, which could hide caller bugs during development (first call with a mistake
  succeeds silently on a rerun because the "already exists" branch short-circuits).

- **G6-P13-03 (Minor)** — `style‿elt.innerHTML = css` sets untrusted-looking content via `innerHTML` rather than
  `textContent`. For a `<style>` element the browser doesn't parse the assigned string as HTML (it's treated as raw CSS
  text), so this isn't an XSS vector in the traditional sense — but using `innerHTML` here is misleading to
  readers/reviewers and will commonly get flagged by security linters/SAST tools scanning for `innerHTML` writes.
  `textContent` (or `style‿elt.append(document.createTextNode(css))`) communicates intent more precisely and avoids that
  noise, especially since `css` could originate from a template string built from partially-dynamic data.

- **G6-P13-04 (Nit)** — Redundant JSDoc contradicting the project's "avoid trivial comments" guidance. The block comment
  above `style_once` (lines 10-16) restates the `Params` type verbatim
  (`@param {{ id: string; css?: string; href?: string; document?: Document }} options`) and the already-obvious return
  type (`@returns {HTMLElement}`) — this is exactly the kind of redundant-with-the-type-signature documentation the
  codebase's own conventions ask to avoid. The one-line prose description above it ("Insert the specified CSS...") is
  useful and worth keeping; the `@param`/`@returns` tags add no information beyond the `Params` interface already
  declared just above.

- **G6-P13-05 (Minor)** — No tests exist despite non-trivial DOM branching (4 combinations of css/href presence, plus
  the "already exists" short-circuit, plus custom `document` injection support). The `document` parameter is clearly
  designed to be injectable for testability (defaults to `window.document`), but that seam isn't exercised by any test —
  a natural fit for a vitest test using a mocked/jsdom `Document` covering: css-only, href-only, both provided (should
  throw), neither provided (should throw), and idempotency on second call with the same `id`.

No unnecessary OOP/class usage — the whole package is one pure-ish function (its only side effect, DOM mutation, is
intrinsic to its purpose) plus a plain `Params` type; no classes involved.
