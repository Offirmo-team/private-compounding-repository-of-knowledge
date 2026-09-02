# REVIEW — @tbrpg/l81-web--core

Bootstraps the TBRPG web app's React root: mounts `<Root/>` into `#react-root` (or `document.body`) behind an
`ErrorBoundary`/`Suspense`, gated on page-load + idle scheduling.

## Findings

- **G11-P20-01** (Minor) — `module/src/root.tsx:3` imports `assert_from` from `@monorepo-private/assert` but never calls
  it — the same recurring unused-dependency/import pattern flagged across nearly every sibling `@tbrpg` package in this
  batch, here manifesting as an unused _import_ (not just an unused _dependency_ in `package.json`) since `assert_from`
  is named but never referenced in the file body.
- **G11-P20-02** (Minor) — `module/src/react.tsx:39`'s `<ErrorBoundary name={...} SXC={SXC}>` wraps JSX children, but
  `@monorepo-private/react--error-boundary`'s exported `Props` interface
  (`{ name: string; SXC?: SoftExecutionContext }`) never declares/extends a `children` field. This surfaces as a real
  `tsc` error today:
  `TS2322: Type '{ children: Element; name: string; SXC: ... }' is not assignable to type '... Readonly<Props>'`. The
  call site here is correct usage (the component's own `render()` reads `props.children`, so wrapping children is
  clearly the intended API) — the bug belongs in `react--error-boundary`'s `Props` type, not in this package, but is
  flagged here since it's the first `@tbrpg` package in this batch to actually surface it via a real compile error at a
  call site.
- **G11-P20-03** (Nit) — `module/src/root.tsx`'s `Root()` component is a placeholder returning `<>Hello, world!</>` with
  a `console.log("🔄 <Root/>", props)` — clearly a to-be-replaced stub (consistent with this package's role as the
  not-yet-wired-up top-level shell), not a bug.
- **G11-P20-04** (Nit) — `module/src/react.tsx:1` has `// TODO move into a pkg? or generator template?` — an open
  question about whether this file's bootstrap logic (page-loaded wait, idle scheduling, StrictMode/Fragment switch,
  ErrorBoundary/Suspense wiring) should be extracted into a shared, reusable package rather than living in this
  app-specific one; a commented-out `Agentation` import/usage (lines 5, 45) is also left in place, referencing an
  external, not-yet-integrated tool.
- **G11-P20-05** (Info) — `module/~~sandbox/index.html` exists (a trivial empty-`<body>` HTML scratch file). Not a
  `~~tosort` folder, so not subject to the mandatory-flag rule, but noted as scratch content sitting in the module tree,
  matching the pattern seen in `l50-ui--rich-text`.
- **G11-P20-06** (Info) — No `README.md` exists at the package root, unlike most sibling `@tbrpg` packages (which
  typically have a one-line description).

## Style / functional-programming compliance

No unnecessary classes/OOP in this package's own code — `init()`/`Root()` are plain async/functional components.
(`ErrorBoundary`, used but not defined here, is necessarily a class since React error boundaries require
`componentDidCatch`/`getDerivedStateFromError`, which is an API constraint, not an in-package choice.)

## Tests

No test files (`*.tests.*`) or story files exist in this package at all — `package.json`'s only script is `check:ts`
(`tsc --noEmit`); `mocha`/`chai`/`vitest` are all listed as devDependencies but there is nothing to run them against.
Given the package is a thin, mostly-stub bootstrap shell, this may be acceptable for now, but it means zero automated
coverage exists for the mount/idle-scheduling/error-boundary wiring in `react.tsx`.
