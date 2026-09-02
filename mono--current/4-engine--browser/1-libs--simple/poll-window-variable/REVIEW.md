# Review: poll-window-variable

Purpose: thin wrapper around `@monorepo-private/poll` that repeatedly checks `window[varname]` until it becomes truthy
(or a timeout elapses), returning a promise — typically used to wait for a third-party script to finish attaching a
global (e.g. `window.netlifyIdentity`).

## Findings

- **G6-P12-01 (Major)** — Truthiness check silently breaks for legitimately falsy variable values. The underlying
  `poll()` (in `@monorepo-private/poll`) resolves the promise only when the predicate's return value is truthy
  (`if (!result) return` inside the `setInterval` callback, and the same early-return check before the interval is even
  set up). Here the predicate is literally `() => (window as any)[varname]`, i.e. the raw value of the global. If the
  awaited global is ever assigned a legitimate-but-falsy value (`0`, `""`, `false`, `null` before being properly set)
  the poll will never detect "presence" and will simply run until `timeoutMs` and reject, even though the variable
  technically already exists on `window`. Consider checking `varname in window` / `window[varname] !== undefined` rather
  than relying on truthiness, or documenting this constraint clearly in the README so callers know it only works for
  globals whose "loaded" value is always truthy (functions, objects, arrays, non-empty strings, etc.).

- **G6-P12-02 (Major)** — `as any` cast on the predicate silently defeats the type contract of `poll()`. `poll`'s
  signature is `function poll(predicate: () => boolean, options: Partial<Options> = {})`; because the predicate passed
  here is `() => (window as any)[varname]` (return type `any`), TypeScript accepts it (a function returning `any` is
  bivariantly compatible with one returning `boolean`) but the compiler still treats `result` inside `poll()`'s body —
  and hence the resolved value of the returned promise — as `boolean`. In reality the promise resolves with the actual
  value of `window[varname]` (an object, function, etc., as shown by the package's own README example:
  `.then(NetlifyIdentity => …)`). So the inferred/declared return type of `pollꓽWindowVariable(...)` does not match what
  callers actually receive at runtime — a real "lying types" hole. Consider making `poll`/`pollꓽWindowVariable` generic
  (`poll<T>(predicate: () => T | undefined | null, ...)`) so the resolved type reflects the real value instead of
  `boolean`.

- **G6-P12-03 (Minor)** — Unused declared dependency. `package.json` lists `@monorepo-private/assert` as a dependency,
  but `module/index.ts` never imports or calls it (e.g. to assert `varname` is a non-empty string, or that `window`
  exists). Either dead dependency, or a missed opportunity for input validation.

- **G6-P12-04 (Nit)** — `(window as any)[varname]` could use a narrower cast (e.g.
  `(window as unknown as Record<string, unknown>)[varname]` or `Reflect.get(window, varname)`) to keep the `any` blast
  radius smaller and avoid silently suppressing unrelated type errors elsewhere in the expression.

- **G6-P12-05 (Nit)** — Parameter reassignment reduces readability. `options = { debugId: ..., ...options }` reassigns
  the `options` parameter binding instead of introducing a new `const` (e.g.
  `const merged_options = { debugId: ..., ...options }`). Doesn't mutate the caller's object (a new object is created by
  the spread), so it's not a functional-purity bug, but shadowing/reassigning a parameter this way is a bit harder to
  follow than a freshly named `const`.

No missing-test note beyond the above: there are currently no tests at all for this package (none of the reviewed
sibling packages have tests either), which is worth calling out given the polling/timeout logic is timing- sensitive and
would benefit from vitest + fake timers coverage, especially for finding G6-P12-01 above. No unnecessary OOP/class usage
— the whole package is one small pure function plus re-exports.
