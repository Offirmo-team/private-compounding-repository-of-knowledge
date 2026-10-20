- **[Minor] G2-P7-02** — `module/l3-normalizers/3-url/index.ts`, function `_normalizeꓽschemeꘌhttpₓ`: the `catch (e)`
  block declares `e` but never uses it (`throw new Error("Invalid URL!")` swallows the original error/message). Should
  either use `catch` without a binding or include `e`/`e.message` in the thrown error to keep diagnostics useful.

- **[Minor] G2-P7-03** — `module/l3-normalizers/3-url/index.ts`, `default:` branch of `_normalize_per_scheme` does
  `console.warn(...)` for unknown schemes instead of using the repo's own logging/assert utilities (the file already
  imports from `@monorepo-private/assert`-adjacent patterns elsewhere in the package). A stray `console.warn` in a "pure
  normalizer" library is a side effect that's easy to miss and not mockable/testable; consider surfacing it via a return
  value or throwing, consistent with how unknown data is otherwise handled in the same function (e.g. malformed emails
  throw).

- **[Nit] G2-P7-04** — Several `TODO`s left in the source (acceptable, but flagging for visibility): `1-base/index.ts`
  (NFKC conversion, emoji stripping), `2-handle/index.ts` (extra WhatsApp-style username rules), `3-url/index.ts`
  (tracker removal, trailing slash, URI encoding normalization, forbidden-domain checks, more schemes, `URL.canParse`),
  `2-content/index.ts` (split/reattach around punctuation). None of these are bugs, just documented gaps in scope.
