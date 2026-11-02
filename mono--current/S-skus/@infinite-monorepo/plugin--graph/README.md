# @infinite-monorepo/plugin--graph

Writes `$MONOREPO_ROOT$/.monorepo/graph.json5` = the list of local packages with their slice, SKU, public-ness and
dependencies (monorepo or external).

Intended for "progressive resurrection" tooling (see [concepts](../../../%23%23CONTRIBUTING/10-concepts.md)) ex. listing
packages slice by slice.

File format: see [types](module/src/types.ts)
