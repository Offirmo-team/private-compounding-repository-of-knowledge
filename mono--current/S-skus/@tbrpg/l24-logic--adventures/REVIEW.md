# REVIEW — @tbrpg/logic--adventures

Adventure archetype definitions (good/bad, story/fight), reward/outcome modeling, and randomized coin-gain/loss
generation for the tbrpg game, with a large bundled i18n flavor-text table.

## Findings

- **G11-P8-01** (Info) — `module/src/~~tosort` exists, containing a single file `cheatsheet.js`. Per review scope, its
  contents were not reviewed — flagging presence only.
- **G11-P8-02** (Minor) — `module/src/index.ts:3` imports `assert_from` from `@monorepo-private/assert` but never calls
  it anywhere in the file (only plain `assert(...)` is used). Unused import — dead code that should be removed.
- **G11-P8-03** (Nit) — `module/src/index.ts` mixes two different `@monorepo-private/random` call styles for
  interval-based integer generation within the same function (`generate_random_coin_gain_or_loss`):
  `getꓽrandom.generator_of.integer.between(interval[0], interval[1])(rng)` for the `lossꘌsmall` case vs.
  `getꓽrandom.generator_of.integer.in_interval(interval)(rng)` for the default case. Same inconsistency already flagged
  across weapons/armors (see l21-logic--armors review, G11-P6-07) — worth standardizing on one call style project-wide.
- **G11-P8-04** (Nit) — `types.ts`'s `AdventureArchetype["outcome"]` has `item_spec: null // TODO` — an outcome field
  that is always `null` today (never populated in `index.ts`'s `ALL_ADVENTURE_ARCHETYPES` construction, which hardcodes
  `item_spec: null`), i.e. currently dead/unused modeling surface with an open TODO.
- **G11-P8-05** (Nit) — `types.ts`'s `AdventureArchetype` interface carries `// TODO rewrite using an array of gains` —
  a real modeling-gap TODO (the current shape hardcodes one boolean/typed field per possible outcome type rather than a
  list), consistent with the recurring schema-versioning/modeling TODOs already flagged in sibling packages
  (`l10-definitions`, `l20-logic--weapons`, `l21-logic--armors`).
- **G11-P8-06** (Nit) — `module/src/index.tests.ts` has a pending/unimplemented test:
  `it("should provide an amount proportional to the player level")` (no callback) — real, non-trivial logic
  (`COINS_GAIN_MULTIPLIER_PER_LEVEL` scaling) exists in `generate_random_coin_gain_or_loss()` but isn't covered by this
  test.
- **G11-P8-07** (Nit) — `module/src/data/index.tests.ts` has two tests with no assertions at all
  (`it("brags about the number of stories", ...)` and `it("auto helps to fix the errors", ...)`) — both only
  `console.log`, so they trivially pass regardless of outcome. These read as dev-tooling helpers (the second literally
  generates suggested `ENTRIES` rows for i18n keys missing a descriptor) rather than real tests; fine as authoring aids,
  but worth distinguishing from actual test coverage since they inflate the visible test count without verifying
  behavior.
- **G11-P8-08** (Nit) — `module/notes.md` is informal scratch/brainstorm design notes (adventure idea drafts, a
  followers list) checked into the package alongside real source. Harmless, but consider moving such scratch content out
  of `module/` (e.g. into a `~~tosort`/notes area) to keep the package's shipped surface focused.
- **G11-P8-09** (Nit) — `module/src/data/i18n_en.ts` contains ~18 `xxx_`-prefixed message entries (e.g.
  `xxx_flammable_village`, `xxx_dragon_admirer`, `xxx_book_smart`, ...) that are deliberately filtered out of the final
  `messages` export via `.filter((key) => !key.startsWith("xxx"))`. This is a legitimate "draft/unfinished content"
  mechanism, not a bug, but it means unshippable draft text lives directly in the production source file rather than a
  separate drafts file — a Nit on organization, not correctness.

## State-transition correctness

`generate_random_coin_gain_or_loss()` correctly guards the negative-resource edge case: for `CoinsGain.lossꘌsmall` it
asserts the wallet isn't already empty (`assert(current_wallet_amount > 0, ...)`) and then caps the randomly-generated
loss via `Math.max(amount, -current_wallet_amount)` so the wallet can never go negative — good defensive design,
confirmed by a dedicated test (`"should cap the loss to the current wallet amount"`). `ALL_ADVENTURE_ARCHETYPES`
construction in `index.ts` is a pure derivation from `ENTRIES` (no mutation of the raw data), and every exported
archetype list is itself derived via `.filter()` (no shared-reference mutation risk). `getꓽarchetype()` throws clearly
on an unknown hid rather than returning `undefined` silently.

## Style / functional-programming compliance

No unnecessary classes/OOP; pure functions and plain types throughout, consistent with project conventions. The
`clean_multiline_string()` helper in `i18n_en.ts` is a small, pure string transform.

## Tests

Uses legacy mocha + chai (expected/fine for existing code). `index.tests.ts` covers data sanity thresholds, both
pickers, and the coin-gain/loss generator across all `CoinsGain` variants including the wallet-capping edge case — solid
coverage aside from the one pending test (G11-P8-06). `data/index.tests.ts` cross-validates i18n keys against `ENTRIES`
hids bidirectionally (every i18n key has a descriptor, every descriptor has an i18n message) and checks outcome-type
distribution against an expected list — thorough for a data-integrity suite, aside from the two non-assertive
dev-tooling tests noted in G11-P8-07.
