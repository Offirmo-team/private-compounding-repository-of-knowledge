# Review: dependency cycles & layer violations

Date: 2026-10-13. Rules come from [##CONTRIBUTING/##ADR/folder-structure.md](##CONTRIBUTING/##ADR/folder-structure.md).

Scope: all 176 workspace packages, using the `pnpm-workspace.yaml` globs. Only `package.json` was used: it's
auto-generated from the real imports, so it's taken as correct. The fields counted are `dependencies`,
`devDependencies`, `peerDependencies` and `optionalDependencies`.

The same automated check covered every layer. Layers 0–3 were then reviewed one by one.

## How to check

pnpm only checks for cycles during `install`-family commands and `pnpm import`; there's no dedicated command. To get a
check that writes nothing (no node_modules, no lockfile) and fails if there's a cycle:

```bash
pnpm install --config.disallow-workspace-cycles=true --lockfile-only --frozen-lockfile
```

- pnpm 11 has no `--disallow-workspace-cycles` CLI flag; it's a setting. To enforce it permanently, add
  `disallowWorkspaceCycles: true` to `pnpm-workspace.yaml`.
- A plain `pnpm i` may skip the check entirely when it thinks node_modules are already up to date
  (`optimisticRepeatInstall`).
- pnpm only finds TRUE cycles (D1 below). Layer violations need a custom check.

## Findings

### Layer 0 — `0-meta/`

Clean.

### Layer 1 — `1-isomorphic/`

- **D1** 🔴 TRUE CYCLE (also reported by pnpm)
  - `2-libs--cross-cutting/40-rich-text-format` --devDependencies-->
    `2-libs--cross-cutting/41-rich-text-format--to-textual`
  - `2-libs--cross-cutting/41-rich-text-format--to-textual` --dependencies-->
    `2-libs--cross-cutting/40-rich-text-format`
  - The numbering says 40 is the lower package, so the edge to cut is 40's devDependency on 41.
- **D2** 🟡 upward dep, layer 1 → 3
  - `2-libs--cross-cutting/30-soft-execution-context` --devDependencies-->
    `3-engine--node/1-libs--simple/print-error--to-terminal`
  - An isomorphic lib's dev setup pulls in a Node-only package.
- **D3** 🟠 upward dep, layer 1 → 2, and a runtime one
  - `3-libs--advanced/offirmo-state--to-rich-text` --dependencies--> `2-engine--winter/prettify-any`

### Layer 2 — `2-engine--winter/`

Clean.

### Layer 3 — `3-engine--node/`

- **D4** 🟡 sub-layer upward dep
  - `0-dev-tools/offirmo-state-migration-tester` --dependencies--> `1-libs--simple/fs--ls`
  - The same pattern appears in layer 4 (see D5), so either the rule or the folder numbering looks wrong. Dev tools
    naturally consume libs, but the `0-` prefix makes `0-dev-tools` the lowest sub-layer. To be settled in the ADR.

### Layers 4, 7, S

- **D5** 🟡 `4-engine--browser/0-dev-tools/` has upward sub-layer deps (same question as D4):
  - `storypad` --dependencies--> `1-libs--simple/better-console-groups`, `1-libs--simple/browser-features-detection`,
    `2-libs--cross-cutting/soft-execution-context--browser`, `2-libs--cross-cutting/universal-debug-api--browser`
  - `rich-text-format--devtools` --dependencies--> `1-libs--simple/css--2-framework`
- **D6** 🟡 sub-layer upward dep
  - `4-engine--browser/1-libs--simple/react--background-img` --dependencies-->
    `4-engine--browser/2-libs--cross-cutting/react--error-boundary`
- `7-multimorphic/`: clean.
- `S-skus/`: no SKU has a non-dev dependency on another SKU.

## Notes

- 🔵 Suspected, not checked: `@monorepo-private/storypad` is listed in `publicHoistPattern`. Packages can therefore use
  it without declaring it, and the generated `package.json` files won't show that edge. Because storypad depends on
  several layer-4 libs (D5), this could hide a cycle.
- 🔵 Small naming mismatch: the ADR says vendored code goes in `__vendor/`, but
  `0-meta/config--typescript/module/_vendor/strictest` uses a single underscore.
- Not flagged: `0-dev-tools` packages depending on other `0-dev-tools` packages (parcel/vite configs composing each
  other). Same sub-layer, so fine.
