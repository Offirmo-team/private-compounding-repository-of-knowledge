# Review — @oh-my-rpg/state--prng

Holds a serializable PRNG state (seed/algorithm/call-count) plus a "recently encountered" memory to avoid immediate
repetition when drawing random items, with an in-memory engine cache keyed by state UUID.

## Findings

- **G7-P4-01** (Minor): `consts.ts:6` — `const DEBUG = true` is exported but a `grep` across the package shows it is
  never imported/used anywhere. Either dead code, or a wiring bug where some file forgot to import and branch on it.
  Also flagged by its own `// TODO move in SXC` comment.
- **G7-P4-02** (Minor): `get_prng.ts:24-31` — `cached_prngs` is module-level mutable global state (a plain object used
  as a cache), which conflicts with the project's "avoid reading/mutating outside data" functional-programming
  guideline. The code is self-aware of the tradeoff (extensive comments explain why: PRNG engines are expensive to
  deserialize and must be reused across reducer calls) and exposes `xxx_internal_reset_prng_cache()` for test isolation,
  so this looks like a deliberate, documented exception rather than an oversight — flagging per the style-review
  request, not as a functional bug.
- **G7-P4-03** (Nit): `utils.ts:30-33` — on exhausting `max_tries`, `regenerate_until_not_recently_encountered()` does
  `console.error(state)` before throwing. Direct `console.error` bypasses the project's `SoftExecutionContext`/logger
  pattern used elsewhere in this same file's siblings (`get_prng.ts` uses `getꓽlogger().error(...)`); worth routing
  through the same logger for consistent structured logging.
- **G7-P4-04** (Nit): `state.ts:86-118` — `update_use_count(state, prng, options: any = {})`: the `options` parameter is
  typed `any`; the single known flag `I_swear_I_really_cant_know_whether_the_rng_was_used` would be easy to typo without
  a typed interface (it's only checked via a truthy property access, so a mistyped flag silently no-ops instead of
  failing).
- **G7-P4-05** (Nit): `migrations.ts:62` — `algorithm_id: use_count === 0 ? "ISAAC32" : "MT19937"` embeds a historical
  assumption (pre-v4 states always used MT19937 unless untouched) directly in the migration step with only an inline
  comment; acceptable for a one-time migration but worth double-checking against any real v3 production data before
  relying on it, since the heuristic can't be verified after the fact.

No other issues found — reducers (`create`, `auto_reseed`, `set_seed`, `register_recently_used`) are pure/immutable, no
classes/OOP, migration pipeline (v2→v3→v4) and `DEMO_STATE` are exercised by `migrations.tests.ts`; legacy mocha+chai is
used consistently with the rest of the pre-vitest codebase.
