# Review — @oh-my-rpg/state--codes

Holds the state (reducer + selectors + migrations) for tracking redemption of cheat/reward codes.

## Findings

- **G7-P1-01** (Nit): `state.ts:37-40` — the fallback `CodeRedemption` literal sets `last_redeem_date_minutes: ""` cast
  via `as CodeRedemption`, which papers over the fact that `""` isn't a valid `HumanReadableTimestampUTCMinutes`.
  Harmless since the field is overwritten on the same line right after, but the cast hides a type mismatch that a reader
  might trust.
- **G7-P1-02** (Nit): `types.ts:15-16` — `// TODO rename to redemption?` left in `CodeRedemption` interface; stale
  naming TODO, no functional impact.
- **G7-P1-03** (Minor): Test coverage is asymmetric — `selectors.tests.ts` explicitly defers detailed
  redemption-condition testing to itself and `state.tests.ts` only covers the "always"/"never" paths via
  `attempt_to_redeem_code`, relying on selectors tests for the count-limit logic. Not wrong, but the split makes it easy
  to lose coverage if either file changes independently. No actual gap found, just a fragile arrangement.
- **G7-P1-04** (Nit): Uses legacy mocha + chai (`test` script in `package.json`), consistent with the rest of the
  pre-vitest codebase — expected, not a defect.

No other issues found — the module is small, side-effect free, avoids classes/OOP, keeps functions pure (no mutation of
inputs), and migration/example-state round-trip tests are present and pass logically on inspection.
