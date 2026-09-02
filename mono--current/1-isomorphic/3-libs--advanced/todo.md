# Code Review — 1-isomorphic/3-libs--advanced

Review date: 2026-03-10

---

## Confirmed Bugs

### [ADV-B01] P1 — `offirmo-state/selectors.ts:134-138` — `getꓽrevisionⵧloose` crashes on partial root state

```ts
if (maybe_legacy_root_state.u_state || maybe_legacy_root_state.t_state) {
  return getꓽrevision(maybe_legacy_root_state.u_state) + getꓽrevisionⵧloose(maybe_legacy_root_state.t_state)
}
```

Guard allows `u_state` to be absent (only `t_state` present), but then calls strict `getꓽrevision(u_state)` which will
throw on `undefined`. Should use `getꓽrevisionⵧloose` for both parts.

### [ADV-B02] P2 — `offirmo-state/utils.ts:163` — `are_ustate_revision_requirements_met` uses truthiness check

```ts
assert((state as AnyRootState).u_state[k], ...)
```

Falsy if sub-state exists but is `0`, `false`, `null`, or empty object. Should use `k in state.u_state` or
`state.u_state[k] !== undefined`.

### [ADV-B03] P2 — `offirmo-state/selectors.ts:166` — Copy-paste error in error message

```ts
throw new Error("getꓽtimestamp() should have a recognized revisioned structure!")
//                                                    ^^^^^^^^^^ should be "timestamped"
```

### [ADV-B04] P3 — `offirmo-state/migration.ts:334-350` — `_migrate_sub_states__base` throws NIMP at runtime

```ts
throw new Error("_migrate_sub_states__base() NIMP!")
```

Reachable if a `BaseState` with sub-states is passed to the migration pipeline. No guard prevents this at the call site.
Should either be implemented or the call site should assert `BaseState` never has sub-states.

---

## Code Smells / Weak Spots

### [ADV-S01] `offirmo-state/selectors.ts` — Unused generic type parameters on `ⵧloose` selectors

`getꓽschema_versionⵧloose`, `getꓽrevisionⵧloose`, `getꓽtimestampⵧloose` all declare generics `B`, `BU`, `BT`, `BR` that
are never used in the function body or signature. Type-level dead code.

### [ADV-S02] `offirmo-state/migration.ts:94,183` — Direct `console.groupCollapsed`/`console.groupEnd` calls

Bypasses the SXC logger that every other log in the same function uses. Cannot be silenced or filtered.

### [ADV-S03] `offirmo-state/utils.ts:172-204` — Large commented-out `finalize_action_if_needed`

Dead code block with a `// ???` marker. Should be deleted or moved to `~~tosort`.

### [ADV-S04] `offirmo-state/migration.ts:27-31` — `Libs` interface is empty and unused

Exported empty interface and its constant are passed into every migration step, but nothing uses them. Dead surface area
on the public API.

### [ADV-S05] `sync-store/reducers.ts:7-15` — Massive unused imports

Most of the imported symbols (`ReducerMap`, `Reducer`, `createꓽaction__base`, `createꓽaction`, `ACTION_TYPEꘌ*`,
`createꓽactionꘌ*`) are never used. Dead code that survives in the bundle if tree-shaking fails.

### [ADV-S06] `sync-store/reducers.ts:1-3` — `/* PROMPT */` leftover artefact

Scaffolding comment from template/AI generation. Should be removed.

### [ADV-S07] `sync-store` — No factory function for creating a store

The package exports types and 3 thin reducers but no `createꓽsync_store()` factory. Every consumer must reimplement
subscription management, dispatch logic, and snapshot tracking themselves. The main value proposition is absent.

### [ADV-S08] `sync-store` — Missing `reduceꓽupdate_to_now` despite importing its types

`ACTION_TYPEꘌUPDATE_TO_NOW` and `ActionUpdateToNow` are imported but no corresponding reducer is provided. Either
implement or clean up imports.

### [ADV-S09] `offirmo-state/~~tosort/2024/` — Rot in quarantined code

`comparators--unclear_spec.ts` imports from `./_test_helpers.js` which does not exist. `comparators--unclear.ts` uses
`.js` extensions (compiled output era). Excluded from build but misleading for future readers.

---

## Naming / Clarity

- [ ] **[ADV-N01]** `offirmo-state/selectors.ts:190-220` — `getꓽlast_user_activity_timestamp` says "activity" but reads
      `last_user_investment_tms`. The codebase explicitly distinguishes "activity" from "investment" (types.ts comment:
      "may NOT be incremented by some meta, non investment actions"). Function name leaks the wrong concept.
- [ ] **[ADV-N02]** `offirmo-state/selectors.ts:222-242` — `getꓽbaseⵧloose` is too vague (`// TODO review name` comment
      already present). Returns a `StateInfos` object. Consider `getꓽstate_infoⵧloose` or `getꓽmetadataⵧloose`.
- [ ] **[ADV-N03]** `offirmo-state/types.ts:84-86` — `BaseAction.expected_revisions` has `[k: string]: number` with no
      connection to actual sub-state property names. A comment noting keys are sub-state keys of `u_state` would help.
- [ ] **[ADV-N04]** `sync-store/MANIFEST.json5` — Empty `{}`. Unlike `offirmo-state` which has name/description.

---

## Test Coverage

| Package        | Has Tests     | Notes                                                                                                                                                                                             |
| -------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| offirmo-state  | Yes (partial) | Comparators, selectors, type-guards, utils tested. Migration has 2 empty `describe` blocks for the complex cases (UTBundle + RootState with sub-states). `hasꓽvaluable_difference_with` untested. |
| **sync-store** | **No**        | Zero test files. `devDependencies` includes test toolbox but it's unused.                                                                                                                         |

### [ADV-T01] `offirmo-state/migration.tests.ts:135-142` — Two empty describe blocks

```ts
describe("on Bundled UState + TState", function () {})
describe("on RootState with subStates", function () {})
```

These are the two most complex migration cases and have zero coverage.

### [ADV-T02] `offirmo-state/comparators--fluid.tests.ts:90-93` — `hasꓽvaluable_difference_with` untested

```ts
describe("hasꓽvaluable_difference_with", function () {})
```

### [ADV-T03] `sync-store` — No tests at all

Missing: `reduceꓽnoop` (returns state unchanged), `reduceꓽset` (returns action.new_state), `reduceꓽhack` (calls
custom_reducer).

---

## Cross-Cutting Observations

- **[ADV-X01]** `sync-store` feels incomplete — it's types + 3 trivial reducers with no store factory. The package name
  promises more than it delivers.
- **[ADV-X02]** `offirmo-state` is the foundation of the entire state architecture but has empty test blocks for its
  most complex features (sub-state migration, UTBundle migration, fluid comparison).
- **[ADV-X03]** `~~tosort` convention is used correctly (excluded from tsconfig) but contains genuinely rotted code with
  broken imports.
