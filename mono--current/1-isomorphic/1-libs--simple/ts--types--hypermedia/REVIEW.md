# Review: ts--types--hypermedia

## Findings

- **[Major] G2-P21-01** — `getꓽuriⵧnormalized‿str()` (`module/01-links/selectors.ts`) declares support for
  `Uri‿str | SchemeSpecificURIPart | Hyperlink | URL` inputs, but the `SchemeSpecificURIPart`/`URL` branches are
  unimplemented:

  ```ts
  let url‿obj: URL = (() => {
    throw new Error(`Not implemented!`)
  })()
  ```

  Any caller passing a `URL` instance or a `SchemeSpecificURIPart` value will throw at runtime despite the type
  signature promising support. `module/01-links/selectors.tests.ts` only exercises string inputs (`TEST_CASES` are all
  raw strings), so this broken path has zero test coverage and would only surface in production use. Either implement
  the missing branches or narrow the type signature to only what's actually supported.

- **[Minor] G2-P21-03** — Several modules with real runtime logic have no test file at all:
  - `module/02-links--email/index.ts` — `isꓽEmail‿str()`, `assertꓽEmail‿str()`, and the multi-branch
    `_validateꓽhas_email_structure()` validation logic are completely untested.
  - `module/60-ohateoas/reducers.ts` — `createꓽaction__base`, `createꓽaction`, `createꓽactionꘌnoop`,
    `createꓽactionꘌupdate_to_now`, `createꓽactionꘌset`, `createꓽactionꘌhack` (the HATEOAS-style action-creator logic
    referenced in the README) have no tests.
  - `module/90-semantic/10-with-online-presence/selectors.ts`, `module/90-semantic/30-thing/selectors.ts`,
    `module/90-semantic/40-thing--with-online-presence/selectors.ts` — no test files; the `assert(...)`-guarded throwing
    branches in `30-thing/selectors.ts` and `40-thing--with-online-presence/selectors.ts` are untested.

  Email validation and the ohateoas reducers are the most consequential of these to leave unverified.

- **[Minor] G2-P21-04** — `module/10-html/selectors.tests.ts` has an empty test body:
  `describe("when NOT enough specs", function () {})`. The corresponding error-throwing branch of `getꓽdimensions2D()`
  (insufficient specs / aspect-ratio mismatch) is documented as a test section but never actually asserted.

- **[Nit] G2-P21-05** — `module/50-webpage/types.ts` has a comment `// See also HtmlFileSpec` /
  `// TODO clarify cf. other type HtmlFileSpec`, but `HtmlFileSpec` does not exist anywhere in the codebase (confirmed
  via grep) — a dangling reference to a type that was presumably renamed or never created.

- **[Nit] G2-P21-06** — `module/90-semantic/40-thing--with-online-presence/selectors.ts`'s `_getꓽcontact()`:

  ```ts
  function _getꓽcontact(thing: Immutable<ThingWithOnlinePresence>): Url‿str {
    if (thing.contact) return normalizeꓽurl(thing.contact)
    const url = thing.contact || ThingSelectors.getꓽauthor__contact(thing)
    assert(url, "Thing: should have at last a point of contact!")
    return url
  }
  ```

  The `thing.contact ||` on the second line is dead — the function already returned early when `thing.contact` was
  truthy. Harmless but confusing; simplify to `const url = ThingSelectors.getꓽauthor__contact(thing)`.

- **[Nit] G2-P21-07** — `module/90-semantic/20-author/index.tests.ts` only covers the "empty" Author case (no
  `intro`/`email`/`contact`). The override paths of `getꓽintro`, `getꓽemail`, `getꓽcontact` when those fields are
  actually provided are untested.

- **[Nit] G2-P21-08** — `module/__specs/_shared.ts` (exposed via the `./_expect` export subpath and consumed by other
  packages' tests) mixes `node:assert`'s `strict as assert` with chai's `expect` in the same file. Stylistically
  inconsistent, and two of the `expect(...)` calls (`expectㆍtoㆍbeㆍaㆍvalidㆍSocialNetworkLink`, lines 29-38) are
  missing a chai assertion chain (e.g. `.to.be.true`) — as written, `expect(booleanExpr, msg)` alone does not actually
  assert anything in chai, so these checks are silent no-ops. Worth fixing to `expect(booleanExpr, msg).to.be.true`.
