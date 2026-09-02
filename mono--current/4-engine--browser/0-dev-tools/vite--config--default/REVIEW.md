# Review — @monorepo-private/vite--config--default

Shared default Vite bundler configuration (React plugin + esbuild JSX settings), merged with per-app overrides via
`extend_default_config`.

## Findings

- **G5-P8-01** (Minor) — `package.json` declares `@monorepo-private/assert` as a runtime dependency but
  `module/src/index.ts` never imports/uses it (only file in the package, confirmed via grep) — dead dependency.
- **G5-P8-02** (Nit) — `package.json` description is a placeholder: `"TODO description in MANIFEST.json5"`, and
  `module/MANIFEST.json5` itself literally contains `description: "TODO description in MANIFEST.json5"` — never filled
  in.
- **G5-P8-03** (Nit) — `module/src/index.ts:8-9,14,17-18`: three commented-out dead lines (`xPlugin` import/usage,
  `Inspect` import/usage, `devtools: true`) — left as inactive scaffolding for future options rather than removed.
- **G5-P8-04** (Nit) — Comment `// sniped by Gemini. Works.` (line 21) is an unusual attribution/confidence note rather
  than an explanation of _why_ `jsx: "automatic"` is needed; harmless but doesn't explain the actual gotcha (if any) to
  future maintainers.

No other issues found — no tests exist for this package (reasonable, it's a tiny declarative config with no branching
logic), and there's no OOP/class usage (`extend_default_config` is a plain function).
