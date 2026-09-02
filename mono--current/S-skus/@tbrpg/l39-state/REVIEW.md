# REVIEW — @tbrpg/state

Overall TBRPG root state: composes all sub-package states (avatar, energy, inventory, wallet, achievements, prng,
engagement, meta, codes) into one aggregate `State`, with the top-level reducers (create/play/autoplay/codes/base),
schema migrations, and selectors.

## Findings

- **G11-P16-01** (Info) — `module/src/~~tosort/` exists, containing `2019/` (with a `migrations_of_blank_state_specs`
  subfolder and a `20190121_10h34.json` snapshot) and `2024/engagement/`. Per review scope, its contents were not
  reviewed — flagging presence only.
- **G11-P16-02** (Minor) — Unlike almost every sibling `@tbrpg` state/logic package reviewed in this batch (`l22`,
  `l24`, `l25`, `l26`, `l30`, `l31`, `l32`, `l33`, `l34`), `@monorepo-private/assert` is **not** an unused dependency
  here: `assert()` is actively called in `data/codes.ts` (3 call sites, validating `CodeSpec` shape at module load) and
  `reducers/create.ts` (1 call site, asserting `prng_state.call_count === 0` post-creation). However, `assert_from`
  specifically — imported in `migrations/index.ts`, `data/codes.ts`, and `reducers/create.ts` — is never called anywhere
  in `module/src/**` (confirmed via grep for `assert_from(`), so it's a partially-unused import across all three files,
  distinct from the "fully unused dependency" pattern in siblings.
- **G11-P16-03** (Minor) — `reducers/internal.ts`'s `_enhance_an_armor`/`_enhance_a_weapon` (lines 217-260) fetch the
  currently-equipped item via `InventoryState.getꓽitem_in_slot(state.u_state.inventory, InventorySlot.armor) as Armor`
  (weapon: same pattern) with a hard `as Armor`/`as Weapon` cast and **no null check**, then immediately call
  `ArmorLib.is_at_max_enhancement(slotted)`/`WeaponLib.is_at_max_enhancement(slotted)` on the result — this is
  structurally the same unguarded-cast shape as `l25-logic--adventure--resolved`'s Critical null-deref finding
  (G11-P9-01). Here it appears safe in practice: `create()` always equips a starting weapon+armor, and no
  `unequip_item()` function exists in `@tbrpg/state--inventory` (confirmed in that package's review, G11-P14-04) — so
  both slots are always populated for the lifetime of a state. Downgraded from Critical to Minor because the game
  invariant currently holds, but it's an implicit, undocumented invariant with no defensive `assert`/comment at the call
  site — if inventory ever grows an unequip feature (as hinted by the pending tests in `l33`), this would become a live
  null-deref.
- **G11-P16-04** (Nit) — `reducers/play/play_adventure.ts` imports nothing unused, but its two sibling files have
  copy-paste leftovers: `reducers/play/play_good.ts` imports `pick_random_bad_archetype` from `@tbrpg/logic--adventures`
  but only uses `pick_random_good_archetype`; `reducers/play/play_bad.ts` imports `pick_random_good_archetype` but only
  uses `pick_random_bad_archetype`. Both files' import blocks are near-identical, suggesting one was cloned from the
  other without trimming.
- **G11-P16-05** (Nit) — `reducers/codes/index.ts`'s `attempt_to_redeem_code` calls `reset_and_salvage(state as any)`
  twice (for `REBORN`/`REBORNX`) — a type-safety-bypassing `as any` cast, same class of issue as `l25`'s G11-P9-04 and
  `l32`'s G11-P13-05.
- **G11-P16-06** (Nit) — `reducers/create.ts` has a commented-out dead "start engagements" block annotated
  `/* TODO review if it's the right place! Or should it be inferred instead? ... */`, plus a `re_seed()` export with
  `console.warn("TODO review manual seeding!")` fired whenever a manual seed is passed — both flag genuine open design
  questions rather than trivial cleanup, worth resolving rather than leaving as permanent dead/warn code.
- **G11-P16-07** (Nit) — `reducers/autoplay.ts`'s `_autoplay()` has `// TODO magic number!!!` on a hardcoded `8` used as
  a divisor when estimating "days needed" for a target play count — the author's own comment flags this as a known rough
  estimate.
- **G11-P16-08** (Nit) — `reducers/base.ts`'s `on_start_session`, `on_logged_in_refresh`, `update_to_now`, and
  `acknowledge_engagement_msg_seen` have **zero direct test coverage** — no `base.tests.ts` exercises them (that file
  only contains two pending/unimplemented `it(...)` stubs for unrelated inventory-management scenarios, see G11-P16-09).
  `equip_item`/`switch_class`/`rename_avatar` are at least exercised indirectly through `autoplay.tests.ts`'s
  bulk-autoplay runs, but the four functions above are entirely untested.
- **G11-P16-09** (Nit) — `reducers/base.tests.ts` is nearly an empty stub: it contains only two pending (uncalled)
  `it(...)` placeholders ("should allow un-equiping an item", "should allow equiping an item, correctly swapping...",
  "should allow selling an item") under a `describe("inventory management", ...)` block — none of `base.ts`'s actual
  exported reducers are named or tested here despite the file's name suggesting it should cover them.
- **G11-P16-10** (Nit) — `data/achievements.ts`'s final processing pipeline filters out any `RAW_ENTRIES` lacking
  `getꓽstatus` (e.g. "Registered" and "Blown Away" in
  `RAW_ENTRIES_ENGAGEMENT`/`RAW_ENTRIES_SECRETS", both marked with adjacent `//
  TODO`) — these are intentionally-incomplete, silently-dropped achievement definitions rather than a bug, but worth flagging since a reader skimming `RAW_ENTRIES`
  would assume all listed achievements are live.

## State-transition correctness

This package composes well-guarded sub-state reducers and adds its own solid guards on top: `create()` resets
`revision: 0` only after all sub-`create()` side effects complete, and asserts `prng_state.call_count === 0` to catch
any sub-state accidentally consuming PRNG entropy during setup. `switch_class()` validates the target class against
`getꓽavailable_classes()` before accepting it (throwing otherwise). `_auto_make_room()` throws
`"inventory is full and couldn't free stuff!"` rather than silently failing if it can't free space — a good fail-fast
choice. The tri-state `complete_or_cancel_eager_mutation_propagating_possible_child_mutation` pattern (used in
`on_logged_in_refresh`, `_autoplay`, `attempt_to_redeem_code`) correctly threads
`previous_state`/`updated_state`/`state` to avoid double-incrementing revision when nothing actually changed — verified
across all three call sites. `play_adventure.ts`'s boot-time completeness assertions
(`PRIMARY_STATS_BY_CLASS`/`SECONDARY_STATS_BY_CLASS` checked against `Enum.keys(CharacterClass).length`) mirror the same
"lookup table completeness" pattern seen in `l34-state--character`, correctly catching a missing class entry at module
load rather than at first use. The one real correctness gap is G11-P16-03 (implicit-but-currently-safe non-null
invariant on equipped slots).

## Style / functional-programming compliance

No unnecessary classes/OOP; pure functions and plain types throughout, consistent with project conventions. State
updates consistently use spread rather than mutation across all reducers reviewed. The internal-vs-public reducer split
(`internal.ts`'s `_`-prefixed functions not re-exported from `reducers/index.ts`, with an explicit WARN comment
documenting their contract) is a clean piece of API design worth calling out positively.

## Tests

Uses legacy mocha + chai (expected/fine for existing code) plus `@monorepo-private/state-migration-tester`'s
`itㆍshouldㆍmigrateㆍcorrectly` for both blank and active (real `DEMO_STATE` savegame) migration specs — the heaviest
test setup of any `@tbrpg` package reviewed so far, reflecting this package's role as the schema-migration aggregation
point. Coverage is strong for `create`, `autoplay`, `codes` (all 8 redeemable codes plus an invalid-code case), `play`
(every adventure archetype is round-tripped through `play()` in a loop), `migrations` (including two "known failure"
real legacy savegames from 2018), and `salvage` (5 scenarios spanning v4 through "total crap" input). `base.ts` is the
significant gap (G11-P16-08/09). No `~~tosort` folder content was reviewed (G11-P16-01) but its presence is noted.
