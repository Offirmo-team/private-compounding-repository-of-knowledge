# Code Review — 1-isomorphic/1-libs--simple

Review date: 2026-03-10

---

## Naming / Clarity

- [ ] **`ts--types/l1-json/index.ts`** — `export type JSON = any` shadows the global `JSON`. Consider `JSONValue`.
- [ ] **`ts--types/l1-json/index.ts`** — `undefined` in `JSONPrimitiveType` undermines strict JSON typing. Consider a
      separate `JSONPrimitiveTypeStrict`.
