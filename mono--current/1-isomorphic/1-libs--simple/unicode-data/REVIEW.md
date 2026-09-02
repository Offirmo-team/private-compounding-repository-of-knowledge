# Review: `@monorepo-private/unicode-data`

Purpose: a static data table (`CHARACTERS`/`UNICODE_CHARS`) of hand-curated Unicode emoji characters annotated with
taxonomy/tags/description metadata (e.g. "is this emoji a monster/animal"), keyed by hex code point.

## Findings

- **[Major] G2-P12-01** — `package.json`'s `scripts.check` is `"run-s check:ts"` only — unlike every other package
  reviewed in this batch, which use `"run-s test check:ts"`. There is also no `"test"` script key at all in this
  package.json. Combined with the fact that there is no `*.tests.ts` file anywhere in the package (confirmed via
  `find`), this package has **zero automated test coverage** and `check` (presumably the CI/pre-commit gate) cannot
  catch data-integrity regressions (e.g. a wrong `code_point`, a duplicate hex key, a malformed entry). Given the
  package's dependencies (`chai`, `mocha`, `@types/mocha`, `sinon`, `@types/sinon`, `vitest` are all still declared as
  devDependencies!), a test setup was clearly intended/scaffolded but never wired up or was removed along with the
  `test` script without cleaning up the now-unused devDependencies.

- **[Minor] G2-P12-02** — `README.md` is a genuinely empty file (0 bytes/lines), despite `package.json`'s `description`
  field being a full sentence ("Unicode static data featuring tags, ex. monster"). Every sibling package reviewed in
  this batch has at least a one-line README with an import example; this is the only one with no content at all.

- **[Nit] G2-P12-03** — Two entries have a placeholder/non-committal `description: "???"` (`"01f43d"` "🐽" and
  `"01f43e"` "🐾", both with `taxonomy: []`), i.e. the author flagged these as unresolved. Harmless as a scratch note,
  but worth tracking if the data is meant to ship as complete.

No `~~tosort` folder present in this package.

Manually verified (via a small script) that all 86 entries' hex-string keys correctly correspond to their `code_point`
values (e.g. `"01f400"` → `128000`), and found no duplicate keys — the data itself, as far as internal consistency goes,
is accurate. The single data file is a plain exported `const` object with no logic/functions, so there is nothing to
unit-test in the traditional sense beyond "does this literal match its own keys" — which is precisely the kind of check
that's currently absent (see G2-P12-01). No OOP/class usage. The package correctly depends on
`@monorepo-private/ts--types` (for `Immutable<T>`) rather than reimplementing it, consistent with `type-detection`.
`@monorepo-private/assert` is declared as a dependency but unused (same unused-dependency pattern noted in several
sibling packages this session) — not repeating as a separate finding since it's already a known recurring pattern across
the batch.

No other issues found beyond the missing test wiring, which is the standout issue for this package.
