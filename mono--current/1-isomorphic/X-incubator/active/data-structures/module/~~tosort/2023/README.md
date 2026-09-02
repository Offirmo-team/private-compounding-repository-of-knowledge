
## Pragmatic Graph data structure library

Includes:
- generic graph
- specific graph: file system representation (arborescence of folder, files)
- TODO craft
- TODO places and connexions

WARNING: only the features I need are implemented. For ex. NO node / vertex removal!

## Usage

Note: reading some refresher about graph theory is highly recommended!
- https://en.wikipedia.org/wiki/Multigraph

### concepts

#### terminology
- This lib uses the standard terminology form graph theory
- I settled on `node`/`link` terminology for max clarity (over `vertex`/`edge` for ex.)

#### design principles

##### Custom UIDs vs internal UIds
- This lib is designed to be an immutable state compatible with serialization.
  - hence this lib doesn't support metadata (by design)
  - hence this lib requires the user to provide a **custom *unique* id** for nodes (optional for links)
    - the user is supposed to maintain its own db of metadata by uid
  - hence the data structure (incl. Node and Link objects) is considered internal
  - hence most selectors will return the custom_uid (for nodes) or the uid (for links)

TOSORT
Basics:
* https://ehizman.live/graph-data-structures-typescript
* https://ricardoborges.dev/data-structures-in-typescript-graph
* https://en.wikipedia.org/wiki/Graph_theory
* Existing implementation: https://segfaultx64.github.io/typescript-graph/index.html
* other lib https://github.com/dagrejs/graphlib/wiki


See also https://en.wikipedia.org/wiki/Trie
