Semantic assertions ([Design by contract](https://en.wikipedia.org/wiki/Design_by_contract)) with auto-generated error
messages.

```ts
import { assert, assert_from, assertⵧnever_reached } from "@monorepo-private/assert"

// recommended: assert_from() = auto-built error messages
function add_hours(h: number, inc‿h: number): number {
  const ǃ = assert_from({ add_hours })

  ǃ.forⵧparam({ inc‿h }).require(Number.isSafeInteger(inc‿h), "should be an integer")
  // add_hours(1, 0.5) → "add_hours(): Invalid argument: inc‿h should be an integer!"

  const result = (h + inc‿h) % 24
  ǃ.forⵧvalue({ result }).ensure(result >= 0, "should be >= 0")
  // add_hours(1, -3) → "add_hours(): Post-condition failed: result should be >= 0!"

  return result
}

// assert_from(…) methods can't narrow TS types (TS2775/TS2776) → use the direct assert() when needed
function trim(x: string | number): string {
  assert(typeof x === "string") // → "Assertion failed: should be true!"
  return x.trim() // x: string
}

// switch exhaustiveness: TS errors if a case is not handled + reports the unexpected value at runtime
type Shape = { kind: "circle"; r: number } | { kind: "square"; side: number }
function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.r ** 2
    case "square":
      return shape.side ** 2
    default:
      assertⵧnever_reached({ shape }, { discriminant: "kind" })
    // → 'Unreachable branch executed: shape.kind = "triangle"!'
  }
}
```

See also [12-concepts--assertions.md](../../../%23%23CONTRIBUTING/12-concepts--assertions.md) for the semantics:
`require` → operation → `ensure`, `assert` = internal invariant.
