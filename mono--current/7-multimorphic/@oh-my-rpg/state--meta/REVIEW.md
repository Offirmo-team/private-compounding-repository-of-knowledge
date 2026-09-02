# Review — @oh-my-rpg/state--meta

Holds session-scoped "meta" state about the player (login status, roles, web-diversity support) that doesn't originate
from gameplay and isn't required to persist server-side.

## Findings

- **G7-P3-01** (Major): `module/src/state.ts:41-61` — bug in `on_logged_in_refresh()`. It computes
  `sorted_roles = [...roles].sort()` and uses `sorted_roles` for the no-op comparison
  (`previous_state.roles.join(",") === sorted_roles.join(",")`), but then stores the **unsorted** `roles` parameter in
  the returned state (`roles,` on line 57) instead of `sorted_roles`. Consequences:
  - The stored `roles` array's order depends on whatever order the caller passed in, while the "no change" comparison
    assumes `previous_state.roles` is already sorted — so after the first call with unsorted input, subsequent
    comparisons against `sorted_toJoin` can spuriously report a change (extra revision bumps) or, if the caller happens
    to pass a differently-ordered same-set, fail to detect that it's actually a no-op.
  - Any other code relying on role order being canonical/sorted (e.g. deep-equal snapshot tests, migrations, persistence
    diffing) will see nondeterministic ordering.
  - Fix: store `sorted_roles` instead of `roles`.
- **G7-P3-02** (Major): No test exercises `on_start_session()` or `on_logged_in_refresh()` — `module/src/state.tests.ts`
  only covers `create()`. This is very likely why G7-P3-01 went unnoticed: a straightforward test asserting `roles`
  order after `on_logged_in_refresh(state, true, ["b", "a"])` would have caught it.
- **G7-P3-03** (Nit): `module/src/types.ts:6` — `slot_id: number // TODO rework` left as a stale TODO with no tracking
  issue reference.
- **G7-P3-04** (Nit): Legacy mocha + chai test runner (expected/consistent with the rest of the pre-vitest codebase).

No other issues found — reducers are otherwise pure/immutable, no classes/OOP, migrations (`v3 → v2` throwing guard) and
`DEMO_STATE` round-trip are covered by `migrations.tests.ts` / `examples.tests.ts`.
