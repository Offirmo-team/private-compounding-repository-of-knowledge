Small pure-function deep-merge utilities with explicit, documented semantics for `undefined` vs `null`, array
deduplication, and copy-avoidance when no actual merging is needed.

- `mergeⵧdeep(a, b)` = **override**: `b` wins. Use for defaults + overrides (ex. configs).
- `mergeⵧdeepⵧno_conflict(a, b)` = **conflict-free union**: both sides must agree, any disagreement throws. Use for
  combining several partial specs of the same JSON content (ex. several plugins contributing to the same file).

| Case                                         | `mergeⵧdeep`                        | `mergeⵧdeepⵧno_conflict`        |
| -------------------------------------------- | ----------------------------------- | ------------------------------- |
| `undefined` on one side                      | other side returned as-is           | same                            |
| conflicting primitives (`1` vs `2`)          | `b` wins                            | **throws**                      |
| mismatched primitive types (`"1"` vs `1`)    | `b` wins                            | **throws**                      |
| `null` vs object/array                       | allowed, `b` wins                   | **throws** (`null` = primitive) |
| array + array                                | deduplicated (`===`) then `.sort()` | same                            |
| object key order                             | `a`'s keys, then `b`'s new keys     | sorted alphabetically           |
| non-plain objects (`Date`, class instances…) | throws                              | throws                          |
| functions                                    | treated as primitives               | throws                          |
