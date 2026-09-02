# Code Review — 1-isomorphic/2-libs--cross-cutting

Review date: 2026-03-10

---

## Confirmed Bugs

### P1 — `ohateoas/30-server/state--frame/selectors.ts:15` — `getꓽurlⵧself` returns display string, not a URL

```ts
return getꓽlink‿str(links[OHALinkRelation.self]!)
```

`getꓽlink‿str` returns a human-readable string like `"/foo" [self] 🎯_self"`, not a URL. Should call
`getꓽuriⵧnormalized‿str(links[OHALinkRelation.self]!.href)` or equivalent. This value is used as `state.urlⵧload` in the
navigation state machine.

### P1 — `soft-execution-context/error-handling/index.ts:140-158` — `xTryCatch` discards return value

Interface declares `xTryCatch<T>() => T | undefined` (types.ts:108), but the implementation at line 140 declares return
type as `void` and discards `fn(params)` return value. Callers expecting a result from `xTryCatch` always get
`undefined`.

### P2 — `credits/l2-aggregator/index.ts:64` — `getꓽassetsⵧrecents` ignores `n` parameter

```ts
function getꓽassetsⵧrecents(n = 12): Immutable<Array<Immutable<Asset>>> {
  return STORE.assetsⵧrecents // n is never used
}
```

Should be `return STORE.assetsⵧrecents.slice(0, n)`.

### P2 — `rich-text-format/l1-utils/simplify.ts:39` — `simplifyꓽnode` condition is always false

```ts
let { $type = 'auto', ... } = $any_node as Node
// ...
if (!$type) $node.$type = getꓽtype($node)  // 'auto' is truthy, never enters
```

Should be `if ($type === 'auto')`.

### P3 — `credits/l2-aggregator/index.ts:85` — `_getꓽpath_tobind` has wrong return type

Declared as `Url‿str` but calls `getꓽpath()` which returns `PathⳇAny`. Type mismatch.

---

## Code Smells / Weak Spots

### `soft-execution-context` — `_isSXC` duplicated

Identical implementation exists in both `internal/utils.ts` and `internal/create.ts`. Should be shared.

### `soft-execution-context` — Emitter is a shared singleton

`ROOT_PROTOTYPE.emitter = new EventEmitter()` — all SXC instances share one emitter, including child contexts. There is
no mechanism for scoped listeners. Also, `emitter` is exposed on the public interface (types.ts:61), making it easy to
accidentally emit/subscribe to internal events.

### `practical-logger--core/core.ts` — `arguments` object pattern

The `primitive` function has typed params `(rawMessage?, rawDetails?)` that are never read — it passes raw `arguments`
to `normalizeArguments` instead. Works but fragile if refactored to arrow functions.

### `practical-logger--minimal-noop` — Test imports `@monorepo-private/practical-logger--core`

This creates a dependency from the minimal-noop test on the full core package, partially defeating the purpose of having
a minimal standalone package.

### `rich-text-format` — `to-html` renderer disabled but not deleted

`src/index.ts` line 8 comments out the HTML renderer export. The file itself uses the old walker API and won't compile.
Should be deleted or rewritten.

### `rich-text-format` — Builder not exported from index

`src/index.ts` line 10 comments out `export * from './l2-sugar/builder.ts'`. The builder is the primary construction API
yet must be imported from the deep path.

### `credits` — Module named "aggregator" but is really a mutable store/registry

`l2-aggregator/` would be clearer as `l2-registry/` or `l2-store/`.

### `credits` — `registerꓽasset_usageⵧend` is a no-op

Empty function exported in the public API with no TODO comment linking to future work.

### `ohateoas` — `isꓽOHAHyperActionBlueprint` type guard is too broad

Anything that is a literal object but NOT a hyperlink is considered an action blueprint. No positive check for `type`
property existence (required by `ReducerAction`). `{}` would pass.

### `ohateoas` — Test file imports missing modules

`reducers.tests.ts` imports from `./consts.ts` and `./sec.ts` which don't exist. Tests are broken/stale.

### `ohateoas` — `~~tosort/` dead code

Large folder of in-progress work at `src/~~tosort/2025/`. Pollutes the source tree.

### `universal-debug-api--placeholder` — `getLogger` ignores all params

`LoggerCreationParams` (name, suggestedLevel, etc.) is completely ignored. All callers get the same singleton noop
logger. A comment explaining why would help.

### `universal-debug-api--types` — `_` internal type publicly exposed

The interface exports `_?` marked "undocumented, should not be used" — should be hidden or strongly typed.

---

## Naming / Clarity

- [ ] **`credits/l2-aggregator`** — rename to `l2-registry` or `l2-store` (it's a mutable runtime store, not an
      aggregator)
- [ ] **`practical-logger--core/consts.ts`** — the `LOG_LEVEL_TO_HUMAN` "generated to shave a few bytes" comment is
      misleading since the derivation is broken and the result is identity
- [ ] **`universal-debug-api--types/v1.ts:13`** — typo: `feture` → `feature`
- [ ] **`practical-logger--minimal-noop`** — `getLevel()` returns `'silly'` (all enabled) which is misleading for a
      noop. Consider `'fatal'` to signal nothing is logged, or document the choice.

---

## Test Coverage

| Package                          | Has Tests          | Tests Work                   | Critical Gaps                                                                          |
| -------------------------------- | ------------------ | ---------------------------- | -------------------------------------------------------------------------------------- |
| credits                          | No                 | —                            | Registration, dedup, `getꓽassetsⵧrecents(n)`, `getꓽpath`                               |
| ohateoas                         | Minimal            | No (broken imports)          | `getꓽurlⵧself`, type guards, representation selectors, `deriveꓽaction`                 |
| practical-logger--types          | Yes (compile-only) | Yes                          | Appropriate for types-only                                                             |
| practical-logger--core           | Yes                | Partially                    | Level filtering, `addCommonDetails`, `setLevel` runtime behavior                       |
| practical-logger--minimal-noop   | Yes                | Yes                          | Good                                                                                   |
| rich-text-format                 | Yes                | Yes (to-text, builder, walk) | `to-debug` (broken), `to-html` (broken/disabled), `simplifyꓽnode`                      |
| soft-execution-context           | Yes                | Partially                    | `xTryCatch` return value, `createChild` isolation, emitter tests are placeholder stubs |
| universal-debug-api--types       | No                 | —                            | Types-only, compile test would suffice                                                 |
| universal-debug-api--placeholder | No                 | —                            | Installation idempotency, `overrideHook` passthrough, `getLogger` contract             |

---

## Cross-Cutting Observations

- **Two renderers broken in `rich-text-format`**: Both `to-html` and `to-debug` use an old walker API that no longer
  exists. `to-debug` is still exported publicly. This is the highest-risk issue in the cross-cutting layer — any
  consumer importing `renderⵧto_debug` will crash.
- **`~~tosort/` directories**: Both `ohateoas` and `rich-text-format` contain `~~tosort/` folders with WIP code. Risk of
  accidentally depending on unfinished code.
- **`xTryCatch` contract violation**: The interface promises `T | undefined` but the implementation returns `void`. Any
  code relying on the return value silently gets `undefined` always, even on success.
- **Logger ecosystem consistency**: `practical-logger--minimal-noop` depends on `practical-logger-core` in tests only,
  but could avoid this by inlining `ALL_LOG_LEVELS` or importing from `practical-logger--types`.
