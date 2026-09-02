# Review — @infinite-monorepo/structured-file-manifest

Purpose: defines the `StructuredFsⳇFileManifest` type (and its `DEFAULT_HINTS` default value) describing how a single
structured file (format, formatting hints, doc links) should be tracked/managed within the monorepo tooling.

## Findings

- **G9-P12-01 (Minor)** — `tsc --noEmit` fails, but the errors all originate from this package's dependency
  `@monorepo-private/read-write-any-structured-file` (its `StructuredFileFormat` type is imported here) and from
  `@monorepo-private/json-stable-stringify` (a transitive dependency pulled in through the type-check graph), not from
  this package's own two-file source. This package's own code (`module/src/index.ts`, 24 lines) is type-error-free in
  isolation; the failures are pre-existing issues in upstream workspace packages and out of scope for this review, but
  worth flagging since `pnpm check` for this package will currently fail end-to-end because of them.
- **G9-P12-02 (Nit)** — No README, and no tests. The package exports a single interface + one default-value constant;
  given how small and declarative it is, this is low risk, but the type has several unresolved `// TODO` markers
  embedded (`TODO fix loop should be AnyRepoFilePathⳇRelative`,
  `TODO improve @monorepo-private/read-write-any-structured-file instead`, `TODO externalize`,
  `TODO should match the format?`, `TODO 1D normalize`) suggesting the shape is still considered provisional/unstable —
  worth a short README note that this type is not yet finalized, for consumers (there are ~13 other
  `@infinite-monorepo/plugin--*` packages and `50-state` that import `StructuredFsⳇFileManifest`).
- **G9-P12-03 (Nit)** — `$schema` field type is oddly narrow/inconsistent: it accepts only
  `` `https://www.schemastore.org/${string}.json` `` or `` `https://json.schemastore.org/${string}` `` (note the first
  requires a literal `.json` suffix baked into the template, the second doesn't require any suffix at all) — this
  pairing looks like it was written ad hoc rather than derived from an actual pattern, and is marked itself with
  `// TODO 1D normalize`. Not a bug since it's already flagged as known debt, just confirming it.

No other issues found. This is a small, clean, purely-declarative FP-style module (a type + a plain-object constant, no
classes) with no logic to speak of, so most of the checklist (bugs, security, dead code) doesn't apply.
