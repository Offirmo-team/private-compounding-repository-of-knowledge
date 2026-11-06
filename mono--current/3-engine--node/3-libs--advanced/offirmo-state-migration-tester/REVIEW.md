# Review: @monorepo-private/state-migration-tester

Dev-tool helper for testing "migrate state to latest schema version" logic: builds Mocha suites from snapshot JSON
files, plus a JSON-diff helper that ignores UUID-only differences.

Note: this package contains a `module/src/~~tosort/2023/cjs/` folder holding unsorted/legacy (pre-TS, CJS) code slated
for removal — not reviewed here.

## Findings

- **SMT-01 (Major)** — The public API (`itㆍshouldㆍmigrateㆍcorrectly`) is typed entirely against Mocha
  (`describe: Mocha.SuiteFunction`, `context: Mocha.SuiteFunction`, `it: Mocha.TestFunction`,
  `expect: Chai.ExpectStatic`), and its implementation actively depends on `context()`, a Mocha-only concept with no
  Vitest equivalent, plus `sinon.useFakeTimers`/`beforeEach`/`afterEach` globals. Since the repo's stated direction is
  migrating new unit tests to Vitest, this helper cannot be used as-is from a Vitest test file (no `context`, different
  globals injection model). Worth flagging now since other packages depending on this helper will hit a wall when
  migrated.
- **SMT-02 (Minor)** — `README.md` exists but is completely empty. Either fill it in with basic usage (there's a good
  example available in `module/src/migration_assertion/__test--basic/index.tests.ts`) or remove the file.
- **SMT-03 (Minor)** — `advanced-json-diff/index.ts`: `_is_valid_uuid` has a
  `// XXX TODO where does this comes from??? We should have a lib!` comment — the UUID format check (`"uu1"` prefix +
  fixed length 24) is bespoke/duplicated logic that should probably live in a shared UUID lib instead of being
  reimplemented here.
- **SMT-04 (Minor)** — `advanced-json-diff/index.ts` line 4: `// TODO use a validating stringifier!` — outstanding TODO
  with no tracking issue reference.
- **SMT-05 (Nit)** — Heavy use of `any` in the public `Options` type (`LATEST_EXPECTED_DATA: any`,
  `migrate_toꓽlatest: (state: any, ...) => any`, `clean_json_diff` params typed `any`). Since this is explicitly a
  testing helper acting on arbitrary state shapes, some `any` is reasonable, but
  `LATEST_EXPECTED_DATA`/`migrate_toꓽlatest` could at least be made generic (`<T>`) for better call-site type safety.
- **SMT-06 (Nit)** — Tests use legacy mocha + chai (`describe`/`context`/`expect` from chai), consistent with the
  pre-vitest-migration convention — expected/fine for now, but ties back to SMT-01.
- **SMT-07 (Nit)** — Identifiers use non-ASCII "house style" separators (`ㆍ`, `ꓽ`, `ⵧ`, `‿`) consistently with the rest
  of the monorepo. Not a bug, but worth noting these can be awkward to type/grep for contributors unfamiliar with the
  convention.

No critical or blocking bugs found; the core diff/migration-assertion logic itself (snapshot discovery, hint-file
generation, immutability check, up-to-date check) reads correctly and is exercised by its own example-based tests.
