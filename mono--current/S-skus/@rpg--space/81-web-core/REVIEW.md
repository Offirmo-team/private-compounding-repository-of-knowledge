# Review — @rpg--space/web-core (81-web-core)

Provides the root React `App` component for the "Space RPG" web app, exposed via `./module/src/index.tsx`.

## Findings

- **G12D-P3-01** (Major) — `module/src/index.tsx` contains only:
  ```tsx
  export function App() {
    return <div>Hello world!</div>
  }
  ```
  This is placeholder/scaffold content — a literal "Hello world!" — with no actual Space RPG UI. Not a bug per se, but
  the package delivers no real functionality yet; flagging so it isn't mistaken for a finished core.
- **G12D-P3-02** (Minor) — No `React` import and no explicit `tsconfig` `jsx` override in this package's own
  `tsconfig.json` (it inherits `"jsx": "preserve"` from the shared strictest/dom config, intended to be overridden by
  "apps"). Since `81-web-core` is consumed elsewhere (this file's JSX ends up compiled by whichever bundler/app imports
  it, e.g. via the `@vitejs/plugin-react`'s `esbuild.jsx: "automatic"` override in `vite--config--default`), this works
  today, but there's no explicit `import React` nor an explicit local jsx transform choice recorded in this package —
  relying entirely on downstream consumers to set it correctly. Acceptable given documented monorepo intent ("libs use
  preserve, apps override"), but worth a comment/TODO given how easy it'd be to break silently if a consumer's jsx
  setting changes.
- **G12D-P3-03** (Nit) — `module/MANIFEST.json5` is an empty object `{}`, giving no description of the package's
  purpose.
- **G12D-P3-04** (Nit) — No tests for the `App` component (e.g. a simple vitest + React Testing Library render/snapshot
  check), though given the current placeholder content the coverage gap has low value today — flag to revisit once real
  content lands.

No class/OOP usage — functional component only, consistent with monorepo conventions. No security concerns. No hooks
used, so no hooks-rules violations possible. No obvious React anti-patterns in the two lines of JSX present.

No other issues found.
