# Review — react--background-img

A React component rendering a hi-res background image as an SVG, cropping/positioning it (CSS `background-position`-like
algorithm) to fit an explicit or parent-measured viewport, with optional "focus point" alignment.

## Findings

- **G6-P14-01** (Major) — `document.readyState !== "complete"` is read directly during render
  (`module/src/index.tsx:39`) instead of inside a `useEffect`. This is an impure render (reads external mutable global
  state) and, more importantly, there is no `readystatechange`/`load` listener: if the component first renders before
  the page finishes loading, it returns `null` forever and will never re-render on its own once the document becomes
  ready (only an unrelated parent re-render would "fix" it by luck).
- **G6-P14-02** (Major) — The component's own doc comment promises "auto adjust to parent component" sizing, but there
  is no `ResizeObserver`/`window resize` listener anywhere. `viewᄆ` is computed from `ref?.getBoundingClientRect()`
  once, effectively only updated when the `ref` callback fires on mount (via the `setRef` state update triggering one
  re-render). Later parent/viewport resizes are never observed, so the background will not stay in sync with its
  container size.
- **G6-P14-03** (Minor) — Two unconditional `console.log` calls (`module/src/index.tsx:51` and `:98`) run on every
  render regardless of the `_debug` prop/`DEBUG` const, unlike the rest of the file which correctly gates debug output
  behind `_debug`. Console spam in normal usage.
- **G6-P14-04** (Minor) — Dead imports: `useEffect` (line 144) is imported but never called anywhere in the file;
  `ErrorBoundary` (line 148, from `@monorepo-private/react--error-boundary`) is imported but never rendered/used,
  despite being listed as a runtime dependency in `package.json`.
- **G6-P14-05** (Nit) — `useRef` is never invoked as a hook; it is only referenced for its return type
  (`useState<ReturnType<typeof useRef<SVGSVGElement>>>()`, line 37) to type the `ref` state. This is a confusing
  indirection — `useState<SVGSVGElement | null>(null)` would express the same intent far more clearly, and would also
  resolve the `tsc` error currently produced by this line
  (`getBoundingClientRect does not exist on type RefObject<...>`, see below).
- **G6-P14-06** (Minor) — No guard against `bg.width`/`bg.height` being `0` (ratio would become `Infinity`/`NaN`,
  propagating into the SVG `viewBox`), and `candidates[Number(props.alt_alignment)]!` (lines 75, 93) uses a non-null
  assertion that can legitimately evaluate to `undefined` at runtime if the caller passes an out-of-range index,
  silently producing a `NaN`-tainted viewBox instead of a clear error.
- **G6-P14-07** (Nit) — `tsc --noEmit` currently reports real type errors local to this package's `module/src/index.tsx`
  (lines 49, 50, 109): `Dimensions2DSpec | undefined` not assignable where an `ImmutableObject<Dimensions2DSpec>` is
  expected, and `RefObject<SVGSVGElement | undefined>` has no `getBoundingClientRect`. These stem directly from the
  `useRef`-as-a-type pattern noted in G6-P14-05 and should be fixed together.
- **G6-P14-08** (Minor) — No tests exist for this package (neither legacy mocha/chai nor vitest), despite non-trivial
  branching logic (aspect-ratio comparison, focus-point selection, random vs. explicit alignment) that would benefit
  from unit coverage.
- **G6-P14-09** (Nit) — Several TODOs remain unaddressed in the file header comment (`module/src/index.tsx:1-10`) and in
  `module/notes.md`: portrait/landscape auto-rotate, pillarboxing, parallax, pre-loading — all fine as acknowledged
  future work, just flagging for visibility.

No security issues found (no `dangerouslySetInnerHTML`/unsafe attribute injection — `bg.asset.url` is passed to an SVG
`<image href>` attribute via JSX, which is properly escaped by React).

No OOP/class usage — package is a single functional component, consistent with the project's
functional-programming-first convention.
