# Review: @monorepo-private/marketing--creator

Static marketing/identity data for Offirmo's "creator" persona: an `AUTHOR` object (name, email, canonical URL, social
links) built from `@monorepo-private/ts--types--hypermedia` types, with one test asserting it's a valid `Author`.

## Findings

### G2-P17-01 (Major) — `tsc --noEmit` fails for this package

Same root cause as in `url` and the other `marketing--*` packages: `check:ts` fails because the dependency chain pulls
in `ts--types--hypermedia/module/90-semantic/20-author/selectors.ts:30`, which does
`import assert from "@monorepo-private/assert"` — but `@monorepo-private/assert` has no default export (only named
`assert`/`assert_from`). `pnpm --filter @monorepo-private/marketing--creator check` currently fails. Root cause is in
`ts--types--hypermedia`, not here, but it's directly observable and blocking for this package.

### G2-P17-02 (Minor) — Single test only validates overall shape, not individual field content

`index.tests.ts` only calls `expectㆍtoㆍbeㆍaㆍvalidㆍAuthor(AUTHOR)`. That's reasonable given the package is just
static data, but it means typos in individual social handles/URLs (e.g. a wrong ArtStation/GitHub/Instagram handle)
would not be caught unless the shared validator checks each URL is reachable/well-formed per network — it only checks
shape/parseability, not correctness of content. Low priority for a private marketing-data package, but worth knowing the
test's actual guarantee is weaker than "the author info is correct."

### G2-P17-03 (Nit) — No README

Same as `url`/`utils--sort`: no `README.md`. Very low priority for a private, single-purpose static-data package.

## Summary

Trivial, correct static-data package. No logic bugs, no OOP, no dead code. The only real issue is the inherited `tsc`
failure from `ts--types--hypermedia` (G2-P17-01), shared with the other `marketing--*` packages and `url`.
