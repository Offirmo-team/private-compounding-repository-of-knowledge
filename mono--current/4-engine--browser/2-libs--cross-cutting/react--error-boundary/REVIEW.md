# Review — @monorepo-private/react--error-boundary

Generic React error boundary component with a fallback overlay UI, SXC-based logging/analytics, and a flexible "render
anything" helper (children, render-prop, or component) for wrapping arbitrary content.

Note: this package contains a `module/~~demo` folder (`index.html`, `index.jsx`, `.eslintrc.js`) — not reviewed here per
the tosort/demo-content exclusion rule.

## Findings

- **G5-P12-01** (Minor) — `module/src/render-anything/index.tsx:4` and `module/src/error-boundary/index.tsx:3` both
  import `assert_from` from `@monorepo-private/assert` but never call it (only bare `assert(...)` is used in both files)
  — unused import in both files.
- **G5-P12-02** (Nit) — `module/src/error-boundary/index.tsx:43`: `override componentDidMount() {}` is an empty no-op
  lifecycle override — dead code, safe to remove.
- **G5-P12-03** (Nit) — `module/src/error-boundary/index.tsx:73-78`: commented-out dead code
  (`/*this.props.onError({...})*/`) guarded by a `// forward to parent TODO one day if useful` comment — intentionally
  left as a future-extension placeholder.
- **G5-P12-04** (Nit) — `module/src/render-anything/index.tsx:32,40,50`: three commented-out
  `console.log`/`console.warn` debug lines left in place rather than removed or gated behind a `DEBUG` flag
  (inconsistent with the flag-based debug pattern used elsewhere in this batch, e.g. `ohateoas-browser--react`'s
  `window.oᐧextra?.flagꓽdebug_render`).
- **G5-P12-05** (Nit) — `class ErrorBoundary extends Component<Props, State>` (`error-boundary/index.tsx`) is a class,
  but this is the legitimate React exception (React's error-boundary API can only be implemented via
  `componentDidCatch`, which requires a class component — there is no hook equivalent) — noting per review instructions
  but not flagging as unnecessary OOP.

No other issues found — package.json dependencies match actual imports, and there are no test files at all for this
package (a gap worth calling out: `render_any_children`'s branching logic — JSX element vs function vs plain node — and
the error-boundary's catch/re-render behavior are both non-trivial and currently untested).
