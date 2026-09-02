# REVIEW — @tbrpg/state--energy

Consumable/replenishing energy-bar state (like most mobile games), using exact fractions for time-accurate regeneration
with a faster "onboarding" refill rate that tapers off.

## Findings

- **G11-P11-01** (Major) — `module/src/state.ts`'s `use_energy(state, qty = 1, now_ms)` and
  `restore_energy(state, qty = 1, now_ms)` never validate that `qty` is positive. `use_energy` only guards the _result_
  (`if (available_energy.s < 0) throw`), so calling `use_energy(state, -5)` would silently _add_ 5 energy (bypassing the
  max-energy cap enforced elsewhere, since the post-subtraction result is never capped at `u_state.max_energy`) instead
  of throwing — a caller passing a negative/garbage `qty` (e.g. from unchecked user input or a bug elsewhere) corrupts
  state rather than failing loudly. Likewise `restore_energy(state, -5)` would silently _remove_ energy while bypassing
  `use_energy`'s "not enough energy" guard entirely, and also bypasses the `total_energy_consumed_so_far` bookkeeping
  that `use_energy` maintains — so a negative `qty` there desyncs `total_energy_consumed_so_far` from actual energy
  changes, which feeds directly into the onboarding-refill-rate formula in `selectors.ts`
  (`get_current_energy_refilling_rate_per_ms`). Given the team's focus on negative-resource edge cases, this is the
  clearest gap in the package: an explicit `assert(qty > 0, ...)` at the top of both functions would close it.
- **G11-P11-02** (Minor) — Both `module/src/state.ts` and `module/src/selectors.ts` import `assert_from` from
  `@monorepo-private/assert` but never call it (only plain `assert(...)` is used in each file) — unused import in two
  files.
- **G11-P11-03** (Nit) — `module/src/selectors.ts:15` has an open
  `// must be smaller than .5 for rounding reasons (TODO why?)` — a real unresolved question about a safety-critical
  constant (`MAX_ALLOWED_REFILLING_RATE_PER_MS`), not just deferred cleanup.
- **G11-P11-04** (Nit) — `module/src/state.ts:22` `// TODO now should be set through sinon, no need` on `create()`'s
  `now_ms` parameter — suggests the explicit-timestamp-parameter pattern (used throughout for testability) is considered
  technical debt by the author, though it's consistently applied and works fine as-is.
- **G11-P11-05** (Nit) — `module/src/state.ts` contains a large commented-out dead code block (lines 76-84, the
  "NOOOOOOO!" comment) explaining why an early-return optimization was rejected, plus several commented-out
  `console.log`/`dumpꓽanyⵧprettified` debug lines throughout `state.ts` and `selectors.ts`. The explanatory comment for
  the rejected optimization has genuine value (documents a real footgun), but the dead commented-out code itself could
  be removed now that the reasoning is captured in prose.
- **G11-P11-06** (Nit) — `module/src/selectors.ts`'s `debugTTNx`/`debugTTN` (a `memoize_one`-wrapped function) has an
  entirely commented-out body — it's a no-op function that does nothing today, called from `get_milliseconds_to_next()`
  for no effect. Dead scaffolding that could be removed until actually needed.

## State-transition correctness

Aside from G11-P11-01, this is a well-guarded package: `update_to_now()` correctly handles clock-went-backward (logs a
warning and no-ops rather than corrupting state), sub-tick calls (no-op), and caps `available_energy` at
`u_state.max_energy` after the refill loop. The refill loop itself is defended by a `safety_counter` with an
`assert(safety_counter > 0, "UTN: infinite loop?")` to catch runaway iteration, and an
`assert(energy_gained_in_this_iteration.valueOf() > 0, ...)` to catch stalled progress — good defensive engineering for
a loop whose termination depends on external fraction math. `use_energy()` guards against spending more energy than
available (throws `"not enough energy left"`) and against negative elapsed time (throws `"time went backward"`).
`restore_energy()` correctly caps at `max_energy`. The onboarding refill-rate formula
(`get_current_energy_refilling_rate_per_ms`) asserts `total_energy_refilled_so_far >= 0` and caps the computed rate at
`MAX_ALLOWED_REFILLING_RATE_PER_MS`, with a defensive `getꓽlogger().error(...)` dump before the final assert if the cap
is exceeded — good production-debuggability. The one real gap is the missing `qty > 0` validation noted in G11-P11-01.

## Style / functional-programming compliance

No unnecessary classes/OOP; pure functions and plain types throughout (aside from the necessary `Fraction` class from
the third-party `fraction.js` library, which is an external API constraint, not a project style violation). State
updates consistently use spread (`{ ...t_state, ... }`) rather than mutation.

## Tests

Uses legacy mocha + chai (expected/fine for existing code) plus `@monorepo-private/state-migration-tester`'s
`itㆍshouldㆍmigrateㆍcorrectly` snapshot-based migration tests (both "blank" and "active" state specs) — a heavier test
setup than most sibling `@tbrpg` packages reviewed so far, reflecting the extra complexity of the fraction-based refill
math and schema migrations. `state.tests.ts` coverage is notably thorough for a game-balance-sensitive package: multiple
"should not allow playing more than X times in 24 hours" and "should not be exploitable" scenarios directly test
anti-cheese/anti-exploit properties of the refill algorithm, using `sinon`'s fake clock for deterministic timing. No
pending/skipped tests found. No test explicitly exercises negative `qty` (consistent with the gap in G11-P11-01).
