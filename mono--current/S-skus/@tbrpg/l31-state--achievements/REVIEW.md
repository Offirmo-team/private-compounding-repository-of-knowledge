# REVIEW — @tbrpg/state--achievements

Tracks per-player statistics (play counts, encountered monsters/adventures, coins/tokens/items gained) and derived
achievement unlock status, with a sticky "never revoke an unlocked achievement" invariant.

## Findings

- **G11-P12-01** (Minor) — `module/src/state.ts:3` imports `assert_from` from `@monorepo-private/assert` but never calls
  it (only plain `assert(...)` is used) — unused import, same recurring pattern flagged across `l22-logic--monsters`,
  `l24-logic--adventures`, `l25-logic--adventure--resolved`, `l26-logic--shop`, and `l30-state--energy`.
- **G11-P12-02** (Minor) — `module/src/selectors.tests.ts` is an empty stub: `describe(...) {}` has no `it()` blocks at
  all, and its imports (`expect`, `enforceꓽimmutable`, `getꓽSXC`, `create`) are all unused.
  `getꓽlast_known_achievement_status` and `isꓽachievement_already_unlocked` in `selectors.ts` have zero direct test
  coverage (they're only exercised indirectly via `state.tests.ts`'s `on_achieved` tests).
- **G11-P12-03** (Minor) — `on_played()` in `state.ts` never validates that
  `coins_gained`/`tokens_gained`/`items_gained` are non-negative before accumulating them
  (`stats.coins_gained += coins_gained`, etc.). A caller passing a negative value (e.g. a bug upstream, or a "loss"
  adventure outcome mistakenly routed through this reducer) would silently decrement these cumulative tracking stats,
  which feed directly into achievement-unlock conditions elsewhere. Lower severity than the analogous
  `l30-state--energy` gap (G11-P11-01) since these are read-only derived tracking counters rather than a
  capped/spendable resource, but the same "unvalidated quantity parameter" pattern.
- **G11-P12-04** (Nit) — `on_achieved()`'s sticky-achievement guard is written as a redundant double-negative:
  ```ts
  if (last_known_status === AchievementStatus.unlocked) {
    assert(last_known_status !== AchievementStatus.unlocked, `${LIB}: achievements are sticky, they can't be removed!`)
  }
  ```
  The outer `if` condition is the exact negation of the `assert`'s condition, so entering the branch guarantees the
  assert always throws — correct behavior (any attempt to move an achievement away from `unlocked` fails loudly,
  matching the "sticky" comment), but the construct reads as confusing/circular. Could be simplified to an unconditional
  `assert(last_known_status !== AchievementStatus.unlocked, ...)` with identical behavior.
- **G11-P12-05** (Nit) — Several TODOs mark substantial unfinished modeling rather than trivial cleanup:
  `wiki: null // TODO` and `flags: null // TODO` in `types.ts` are entirely unimplemented sub-systems (with a list of
  planned-but-absent fields in comments: places, mysteries, people/organizations, events);
  `AchievementDefinition.session_uuid` has `// TODO rename to temporary ID (need migration)`; `achievements` field has
  `// TODO rename as "last_known_achievement_status" ? or "snapshot"`; `statistics` has `// TODO externalize?`; and
  `has_account`/`is_registered_alpha_player` have `// TODO review redundancy`.

## State-transition correctness

Aside from G11-P12-03, this package is well-behaved: `on_played()` takes a "shortcut + drop immutability" shallow copy
of `state.statistics` (explicitly commented as such) but only mutates freshly-spread nested objects
(`good_play_count_by_active_class`, `bad_play_count_by_active_class`, `encountered_adventures`, `encountered_monsters`),
never the frozen originals — safe despite the informal phrasing. `on_achieved()` correctly no-ops on a no-change
(`if (last_known_status === new_status) return previous_state`) and enforces the sticky-unlock invariant (G11-P12-04 is
a style note, not a correctness bug). `_on_activity()`'s day-rollover bump correctly threads `previous_revision` to
avoid double-incrementing `revision` when both a stat change and a day change happen in the same call.
`examples.tests.ts` has a nice invariant check — asserting `migrate_toꓽlatest(DEMO_STATE)` returns the exact same object
reference as `DEMO_STATE` — which keeps the demo fixture honest against schema drift.

## Style / functional-programming compliance

No unnecessary classes/OOP; pure functions and plain types throughout, consistent with project conventions.

## Tests

Uses legacy mocha + chai (expected/fine for existing code) plus `@monorepo-private/state-migration-tester`'s
`itㆍshouldㆍmigrateㆍcorrectly` for both blank and active state migration specs, mirroring `l30-state--energy`'s setup.
`state.tests.ts` covers `create()` defaults, `on_played()` for both good/bad paths (including fight-won/fight-lost
adventure-key detection and cumulative counter updates), and `on_achieved()`'s reveal/unlock transitions — solid core
coverage. `selectors.tests.ts` is an empty stub (G11-P12-02). No pending/skipped tests found. No `~~tosort` folder
present in this package.
