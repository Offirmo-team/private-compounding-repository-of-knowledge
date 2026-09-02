# Review: plugin--typescript

Manages each package's `tsconfig.json` (extending shared isomorphic/dom/node base configs) and ships the actual shared
`tsconfigs/strictest/*` base configs consumed via `extends`.

## Findings

- **G10-P2-01 (Info — folder presence)** — Package contains a `~~tosort` folder:
  `module/tsconfigs/++gen/~~tosort/2026/...` (one of the three known `~~tosort` folders called out by team-lead). Its
  content was not reviewed per review-scope rules, but its presence is noted here as required. It contains a fairly
  large tree (multiple `tsconfig.json`, `_custom-typings/*.d.ts`, a `v5/` variant with `_strictest`/`current` sub-bases)
  — worth a follow-up pass once/if this material is triaged out of `~~tosort`.
- **G10-P3-01 (Nit)** — `onꓽapply` for "package" has a commented-out alternate path‿rel computation left in place:
  `//path.relative(node.path‿abs, path.resolve(s.config_node.path‿abs, "module/_custom-typings")) + "/*.d.ts"` next to
  the active hardcoded `"./node_modules/@monorepo-private/config--typescript/module/_custom-typings/*.d.ts"` — dead
  alternative kept as a comment; harmless but could be removed or converted to a tracked TODO.
- **G10-P3-02 (Nit)** — `PluginStateⳇSpec.config_node` field is marked `// TODO remove unneeded` — self-flagged as
  possibly unnecessary state, not itself a bug.
- Good practice noted: the `strictest/README.md` clearly documents this base's intent ("strictest, most future-oriented,
  most backwards-incompatible — do not use directly, see siblings"), and the isomorphic/dom/node configs correctly layer
  `extends` (dom/node extend isomorphic) with sensible target/lib/module settings. No issues found there.

No other issues found in the reviewed logic. This is one of the more mature, well-organized plugins in this batch, aside
from the noted `~~tosort` folder.
