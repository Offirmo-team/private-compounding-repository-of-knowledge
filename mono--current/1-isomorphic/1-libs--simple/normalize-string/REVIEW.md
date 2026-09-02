# Review: `@monorepo-private/normalize-string`

Purpose: a collection of pure `string -> string` normalizer functions (unicode, case, email, URL, filesystem path,
handle/nickname, language tag, arrays) plus small combinators and normalization assertions.

## Findings

- **[Minor] G2-P7-01** — `module/l4-assertions/index.ts` (and the whole `l4-assertions` feature) has no test file at all
  (no `l4-assertions/index.tests.ts`), unlike every other sub-folder which has a matching `.tests.ts`.
  `assertꓽstringⵧnormalized` and `assertꓽstringⵧnormalized_and_trimmed` are exported from the package root but exercised
  nowhere.

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

- **[Nit] G2-P7-05** — `package.json` declares `sinon` and `@types/sinon` as devDependencies, but no file in the package
  uses `sinon` (grep found zero references). Likely copy-pasted from a shared package.json template; harmless but is
  dead weight in the dependency graph.

- **[Nit] G2-P7-06** — Exotic identifier style (`ꓽ`, `ⵧ`, `‿`, `ₓ` used as word-separators inside identifiers, e.g.
  `normalizeꓽemailⵧreasonable`, `_normalizeꓽschemeꘌhttpₓ`) is unusual and could trip up tooling/IDEs/search, though it
  appears to be an intentional, consistent house style across the whole monorepo (seen in every package reviewed) rather
  than a defect specific to this package.

No OOP/class misuse found — the package is implemented entirely as pure functions and function factories
(`combineꓽnormalizers`, `default_to`), consistent with the project's functional-programming guidance. No
outdated-looking deps beyond the sinon note above. README code sample matches the actual exports. Test coverage for the
L3 normalizers (base, content, email, fs, handle, misc, url, arrays) is thorough and self-checking (each test file
asserts that every exported normalizer has a corresponding test case, and vice versa). Tests use the legacy mocha+chai
stack, consistent with "existing tests are fine" guidance — no new tests were added here to migrate.

No other issues found.
