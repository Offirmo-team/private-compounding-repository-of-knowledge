# Review: 1-isomorphic/X-incubator/active/http-client

Isomorphic, functional wrapper around the global `fetch` providing a small typed HTTP client
(`get`/`post`/`put`/`patch`/`delete`/`request`) with base-URL/origin locking, timeouts, JSON parsing, optional schema
validation, and a structured error hierarchy.

## Findings

- **G1-P5-01 (Critical)** — The package does not type-check. `pnpm check:ts` (`tsc --noEmit`) fails with 15 errors. Root
  cause: `RequestOptions<T>` in `module/src/types.ts` declares `body`, `headers`, `timeout‿ms`, `signal`, `schema` as
  **required** fields, while `client.ts` and the tests consistently treat them as optional (`Partial<MethodOptions<T>>`,
  `MethodOptions<T> | undefined`, `RequestOptions<T> = {}`). This is compounded by the shared `Immutable<T>` utility
  type (from `@monorepo-private/ts--types`) resolving to `never` for `unknown`-typed fields (e.g. `body: unknown`), and
  by `PositiveInteger` (`NonNegativeInteger<number>`) resolving to `never` for a generic `number`, so assigning any real
  `duration‿ms: number` fails. As shipped, `_check`/`check:ts` cannot pass.

- **G1-P5-02 (Major)** — `HttpClientError` is re-exported from `index.ts` with `export type { HttpClientError }`, i.e.
  type-only. Consumers importing it from the package's public entry point therefore cannot use it as a value
  (`instanceof HttpClientError` from outside the package is a TS1361 compile error: "cannot be used as a value because
  it was exported using 'export type'"). None of the concrete subclasses (`HttpRequestError`, `HttpResponseError`,
  `HttpTimeoutError`, `HttpResponseValidationError`) are exported at all. The whole point of a typed error hierarchy for
  an HTTP client is broken for anyone consuming it through `index.ts`.

- **G1-P5-03 (Major)** — `module/src/client.tests.ts` uses `catch (err: HttpClientError)` in 4 places. This is invalid
  TypeScript (TS1196 — catch-clause type annotations must be `any` or `unknown`); the test file itself doesn't compile
  and accounts for 4 of the 15 errors counted in G1-P5-01.

- **G1-P5-04 (Major — Security)** — `_execute_request` validates that the _requested_ URL's origin matches the
  configured base origin (a good SSRF guard against absolute/protocol-relative path injection — verified: `//evil.com`,
  `\\evil.com`, `http:evil.com` etc. are all rejected or safely folded under the base). However, the actual `fetch()`
  call in `client.ts` sets no `redirect` option, so it defaults to `"follow"`. A 3xx response from the (origin-approved)
  target can silently redirect the request to any other host — including internal/metadata endpoints — completely
  bypassing the origin check, since that check only runs on the pre-request URL, never on
  `response.url`/`response.redirected`. Given the package explicitly implements an origin allow-list, this gap defeats
  its own stated security intent.

- **G1-P5-05 (Major)** — The existing mocha test suite performs real, live network calls instead of stubbing `_fetch`
  (which `module/src/fetch.ts` exists specifically to make stubbable). Running `pnpm test` confirms it: the "should
  correctly merge pathes -- AA" test attempts a real TCP connection to `api.linkedin.com`, hits a 10s connect timeout,
  and then fails the mocha 2000ms test timeout. The suite is flaky/slow and will fail with no network access (e.g.
  sandboxed CI). `sinon`/`@types/sinon` are declared as devDependencies (presumably for exactly this purpose) but are
  never imported anywhere in the package.

- **G1-P5-06 (Minor)** — Header-merge bug: the default `"content-type": "application/json"` (added when `body` is
  present) is merged via plain-object spread with caller-supplied headers. Object keys are case-sensitive but HTTP
  header names are not, so a caller trying to override with `"Content-Type"` (different casing) does not replace the
  default — both keys survive the spread and, once handed to the platform `Headers`/`fetch()`, get silently combined
  into one comma-joined value (verified: `application/json, application/xml`) instead of the override taking effect.

- **G1-P5-07 (Minor)** — Dead/unreachable exports: `isRetryableError`, `isRetryableStatus`, and the concrete error
  subclasses (`HttpRequestError`, `HttpResponseError`, `HttpTimeoutError`, `HttpResponseValidationError`) are defined in
  `errors.ts` but never re-exported from `index.ts`. Combined with G1-P5-02, essentially the entire error-classification
  surface is unusable from outside the package without a deep import into `module/src/errors.ts`.

- **G1-P5-08 (Minor)** — Leftover `TODO`: `const logger = console // TODO SXC` in `client.ts`. `HttpClientOptions` has
  no way to inject a custom logger even though the comment signals this is intentionally unfinished.

- **G1-P5-09 (Nit)** — Commented-out dead code in `HttpClientOptions` (`//retry: RetryOptions;`,
  `//circuitBreaker: CircuitBreakerOptions;`) referencing types that don't exist anywhere in this package. Either
  implement, remove, or track as a backlog item instead of leaving it commented in source.

- **G1-P5-10 (Nit)** — `module/MANIFEST.json5` is an empty `{}`. The sibling incubator package
  (`.../active/data-structures/module/MANIFEST.json5`) fills in `description` and `status` — worth doing the same here
  for consistency/discoverability.

- **G1-P5-11 (Nit)** — No `README.md` exists for this package (the sibling `data-structures` package has one), so there
  is no usage documentation to verify accuracy against the code/exports.

- **G1-P5-12 (Nit)** — `webstorm--tests--unit.run.xml` still points its `working-directory` at
  `.../1-isomorphic/2-libs--cross-cutting/http-client`, a path that no longer exists — stale IDE run config left over
  from before the package was moved to `X-incubator/active`.

- **G1-P5-13 (Nit)** — `@monorepo-private/assert` is declared as a runtime `dependency` in `package.json` but is never
  imported anywhere in `module/src` — unused dependency.

No `~~tosort` folder is present in this package. No class/OOP misuse found beyond the `Error` subclass hierarchy in
`errors.ts`, which is an idiomatic and expected use of `class` (required by the platform `Error`/`instanceof` contract),
consistent with the sibling `utils--error` package's style.
