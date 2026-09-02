# REVIEW — @tbrpg/state--wallet

Simple currency-slot state (coins, tokens) with add/remove reducers guarding against negative balances.

## Findings

- **G11-P13-01** (Minor) — `package.json` lists `@monorepo-private/assert` as a dependency, but it is not imported
  anywhere in `module/src/**` (no `assert`/`assert_from` import at all, unlike sibling packages where at least
  `assert_from` was imported-but-unused) — unused dependency, same recurring pattern flagged across
  `l22-logic--monsters`, `l24-logic--adventures`, `l25-logic--adventure--resolved`, `l26-logic--shop`,
  `l30-state--energy`, `l31-state--achievements`.
- **G11-P13-02** (Minor) — `state.tests.ts:46` has a pending test `it("should cap to a limit")` (no callback) directly
  under `add_amount` tests, but `add_amount()`/`_change_amount_by()` in `state.ts` have no upper bound at all —
  `coin_count`/`token_count` can grow without limit. Unlike sibling packages where a resource cap is implemented and
  just needs more test coverage, here the pending test suggests a cap was intended but never built — worth confirming
  with product whether unbounded currency is by design or a gap.
- **G11-P13-03** (Nit) — `state.tests.ts:78` has a second pending test, `it("should yield all currency slots")`, for the
  `iterables_currency()` generator — currently zero test coverage for that function.
- **G11-P13-04** (Nit) — `iterables_currency(state)` takes a `state: Immutable<State>` parameter but never reads it (the
  generator body is `yield* ALL_CURRENCIES`, a fixed constant unrelated to the passed state) — dead/unused parameter;
  either the signature should drop `state` or the intent (e.g. only yielding currencies with a non-zero balance) was
  never implemented.
- **G11-P13-05** (Nit) — `_change_amount_by()` and `get_currency_amount()` both cast through
  `(state as any)[state_entry]` to do computed-key property access — same class of type-safety-bypass already flagged in
  `l25-logic--adventure--resolved` (G11-P9-04). A typed lookup (e.g. a `Record<Currency, keyof State>` map or a small
  typed accessor) would avoid the blanket `any` cast.

## State-transition correctness

This is a clean, well-guarded reducer: `add_amount()` rejects `amount <= 0` and `remove_amount()` rejects both
`amount <= 0` and removing more than the current balance (`"can't remove requested amount, not enough credit!"`), both
via clear thrown errors rather than silent clamping — a stricter (and arguably safer) approach than the capping-based
guards seen in sibling packages (`l24-logic--adventures`' wallet-loss capping, `l30-state--energy`'s max-energy
capping). `create()` and `_change_amount_by()` are pure, non-mutating. The only real gap is the missing upper bound
noted in G11-P13-02.

## Style / functional-programming compliance

No unnecessary classes/OOP; pure functions and plain types throughout, consistent with project conventions.

## Tests

Uses legacy mocha + chai (expected/fine for existing code) plus the standard `@monorepo-private/state-migration-tester`
migration-spec tests (blank + active state). Core `add_amount`/`remove_amount` nominal and error-throwing paths are well
covered. Two pending tests noted above (G11-P13-02, G11-P13-03). No `~~tosort` folder present in this package.
