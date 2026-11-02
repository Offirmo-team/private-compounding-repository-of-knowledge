# plugin--graph: spec & design notes

## Goal

Support **"progressive resurrection"** (see [concepts](../../../../%23%23CONTRIBUTING/10-concepts.md)): a tool listing
the packages in the order to resurrect them, with an assessment of each package against a list of criteria (ex. "tests
pass", "TS no errors", "has dep cycles", "wrongly directed deps"…).

This plugin writes the data needed by such a tool: `$MONOREPO_ROOT$/.monorepo/graph.json5` (format:
[types](src/types.ts)).

- written in one pass in `onꓽapply()` of the monorepo node: at this stage all nodes are discovered + refined = the graph
  is complete (no plugin changes deps during apply)
- the graph = facts. The resurrection order is computed by `sortꓽpackages()` ([utils](src/utils.ts)), exported for the
  tool
- the goal of resurrection is to FIX issues → **never crash on an issue**, report it instead (see "Issues" below)

## Package entry

One entry per local package (the monorepo root itself is NOT listed), + "phantoms" (see below).

- `fqname`, `path‿rel` (relative to the monorepo root)
- `deps`: ALL dep types (normal, peer, dev…), monorepo AND external, as `{ fqname, type, isꓽmonorepo }`
  - ordered by type (in `DEPENDENCY_TYPES` order: normal, peer, bundle, optional, dev…), then fqname
  - `isꓽmonorepo` = from this monorepo **by name or namespace** (`pkg_infos_resolver.isꓽmonorepo_package()`) = the same
    SSoT as the one writing `workspace:*` in the generated package.json. Independent of the packages list, which is what
    allows detecting missing packages
- `sku`: ex. `S-skus/@tbrpg/…` → `@tbrpg`
- `isꓽpublic` = published = more critical
- ordering hints (= "simplest" first, see `sortꓽpackages()` below):
  - `sibling_deps_count`: distinct monorepo packages directly depended on with the same group AND subgroup (phantoms
    included, with their inherited precedence)
  - `monorepo_deps_count`: distinct monorepo packages directly depended on (all dep types)
- `layer`: pre-computed (see "Resurrection order" below) → `sortꓽpackages()` is a plain sort
- `issues`: see below
- empty containers are trimmed by the writer → `deps` and `issues` are omitted if none
- JSON keys are auto-sorted by the writer (no need to care about key order)

## Precedence = a specification

A package can only depend on packages with a lower or equal precedence. 3 levels, compared like a version number
`group.subgroup.pkg`, ex. `1.2.43` < `1.3.0`:

| field                 | extracted from (leading `N-` number)                                      | default                   |
| --------------------- | ------------------------------------------------------------------------- | ------------------------- |
| `precedence_group`    | top folder, ex. `0-meta/` → 0, `1-isomorphic/` → 1                        | 99 (currently = the SKUs) |
| `precedence_subgroup` | 2nd folder if not the package folder, ex. `…/2-libs--cross-cutting/…` → 2 | 99                        |
| `precedence_pkg`      | package folder, ex. `…/0-freeze/` → 0, `…/43-spec--load/` → 43            | 999                       |

**SKUs** (`S-skus/@foo/…`) = the SKU folder is at the subgroup level → `precedence_subgroup` = the SKU **rank**, derived
from the deps between SKUs (`deriveꓽsubgroup_by_sku()`): a SKU depending on another one comes after it, then by name.
Cycle = the first remaining one by name is placed anyway (= the deps against the order are `precedence_violation`s). Ex.
`@web-property-outfitter` before the 4 SKUs depending on it.

## Phantoms

A monorepo dep missing from the packages list (ex. a package whose real name differs from its folder) gets a **phantom**
entry (`isꓽphantom: true`) so that it can be called out and ordered:

- no path, no deps (unknown)
- precedence inherited from its dependent with the smallest precedence (= the first one needing it) → it is resurrected
  before it (same precedence + one of its deps)
- carries a `missing_package` issue listing its dependents; each dependent carries a `missing_dep` issue
- phantoms come first in `graph.json5`, sorted by fqname (= "fix the missing first", as in `sortꓽpackages()`)

## Issues

Generic `PackageGraphⳇIssue { type, message }` to be extended (+ added to the `PackageGraphⳇIssueⵧany` union):

- `missing_dep` (on the dependent) / `missing_package` (on the phantom)
- `precedence_violation`: a monorepo dep coming LATER in the explicit order = against the specification
- `dep_cycle`: the other members of the cycle(s) (= mutually reachable packages, all dep types)

## Resurrection order: `sortꓽpackages()`

Vocabulary:

- **precedence chunk** = the packages with exactly the same `group.subgroup.pkg`, ex. all the unnumbered SKU packages =
  `99.99.999`. Chunks are processed one after the other, in the explicit order; deps only reorder within a chunk
- **placed** = already appended to the resurrection order being built
- **ready** = not placed yet + all its deps within the same chunk are placed (deps in earlier chunks are already placed,
  deps in later chunks are `precedence_violation`s)
- **layer** = all the packages ready at the same round: layer 0 = no deps in the chunk (the foundations), layer 1 = all
  deps in layer 0, layer N = all deps in layers < N (= N is the length of its longest dep chain)

1. **explicit order first** (it's a specification): group > subgroup > pkg
2. within a precedence chunk: **dependency order**, layer by layer (Kahn's algorithm, run once when deriving the graph =
   `deriveꓽlayer_by_fqname()`): all of layer 0, then all of layer 1… = deps first, and the dependency depth always wins
   over the tie-breaks
3. tie-breaks within a layer: `sibling_deps_count`, `monorepo_deps_count` (lower first), public first, then path
   (phantoms first)

ex. A (no deps), B (dep: A, simpler than C), C (no deps) → A, C, B: B is in layer 1, so after C despite being simpler

- a dep contradicting the explicit order is NOT used for ordering (it is unexpected = reported as a
  `precedence_violation`)
- cycle = no package ready = the first remaining one by tie-breaks is placed anyway, as a layer of its own (reported as
  `dep_cycle`)
- all dep types count for now (you need the dev deps to run the checks)

## Misc decisions

- strings are sorted with `compareꓽstringsⵧfast_good_enough()` from `@monorepo-private/utils--sort` (UTF-16 code units =
  fast + deterministic, not locale-aware), unless there are explicit complex sort requirements
- a package whose name differs from its folder must set `name` in its MANIFEST.json5, ex.
  `@monorepo-private/parcel-config` in `parcel--config--default/` (otherwise = a phantom + its dependents' issues)

## Open questions / TODO

- precedence violations on real data (2026-10-30): 35
  - 26 at the pkg level, all on unnumbered targets (default 999), ex. `70-operation--apply` → the 23 `plugin--*`. TODO
    think about it. Candidate refinements: compare `precedence_pkg` only when both are numbered, and/or only within the
    same parent folder
  - 6 = `0-dev-tools` with normal deps on higher subgroups (ex. `storypad`) = the source of the storypad dep cycle
  - 3 real ones (ex. `1-isomorphic/3-libs--advanced/offirmo-state--to-rich-text` → `2-engine--winter/prettify-any`)
- `monorepo_deps_count` is direct only; a transitive count would better reflect "simplicity"
- other string sorts across the monorepo (~100 sites) could use `compareꓽstringsⵧfast_good_enough()`
