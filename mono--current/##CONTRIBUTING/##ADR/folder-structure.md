# Monorepo folder structure

## Introduction

This monorepo follows a semi-strict folder structure aimed at:

- compounding complexity, with higher layers relying on tested, reliable lower layers
- progressive resurrection (see [concepts](../02-concepts.md))
- avoiding dependency cycles, for the same reasons as above
  - if a higher layer or a SKU is no longer needed or no longer maintained, it can be deleted/parked without breaking
    the other SKUs/layers

Reminder:

- `##` folders are documentation, not packages
- `N-notes/` = human notes, not code, ignore

## Organisation

The codebase is split into layers, with these rules:

- a package may only depend on packages in the same or a lower layer
- the same rule applies to sub-layers within a layer, but the layer wins over the sub-layer, ex.
  `4-engine--browser/1-libs--simple/` may depend on `1-isomorphic/3-libs--advanced/` (unusual but allowed, the fact that
  a lib is "advanced" doesn't have to be known by the caller)
- no circular dependencies are allowed

Layers:

- `0-meta/` [README.md](../../0-meta/README.md) = lowest possible layer, only needed to bootstrap the monorepo itself.
  - Stuff related to the codebase / monorepo itself
  - This layer should contain as FEW packages as possible and only what can't be in a higher layer
  - Ideally should only require vanilla Node.js LTS or even no Node.js (bash)
  - Ideally should have NO dependencies at all (since it can be used while setting up the repo)
- `1-isomorphic/` [README.md](../../1-isomorphic/README.md) = highly reusable isomorphic code that can work in both
  Node.js and browser without modification
  - should only use pure ECMAScript and no platform API
  - exception: rare de-facto cross-platform APIs such as `console.log()` (with no platform-specific feature)
- `2-engine--winter/` [README.md](../../2-engine--winter/README.md) = highly reusable "runtime-interoperable" packages
  that should also work on Node.js and browser, may use the WinterTC "Minimum Common Web API"
- `3-engine--node/` [README.md](../../3-engine--node/README.md) = reusable Node.js-only packages
- `4-engine--browser/` [README.md](../../4-engine--browser/README.md) = reusable browser-only packages
  - Technically should be at the same level as `3-engine--node/` BUT this level is allowed to use Node.js packages as
    **devDependencies**, hence being slightly higher
- `7-multimorphic/` [README.md](../../7-multimorphic/README.md) = reusable advanced code with provisions for Node.js +
  browser.
  - Offirmo-specific concept, TODO refine and document
- `S-skus/` [README.md](../../S-skus/README.md) = "Stock Keeping Unit" = an independent subproject such as an app, a
  tool, a browser extension...
  - several packages per SKU
  - some SKUs are Node.js apps, some are browser apps
  - SKUs are siblings = they're NOT allowed to use each other, unless the target SKU is a tool used as a
    **devDependencies**
  - reusable packages should eventually be extracted to lower layers, but not urgent
  - internally following roughly a structure = ontology = domain model (types/POD, corresponding accessors and sometimes
    trivial logic) -> state = business logic (advanced reducers) -> adapters (persistence, backend...) -> client/UI

Common sub-layers (within a layer):

- `0-dev-tools/` = dev tools, can only be used by higher (sub-)layers as **devDependencies**
- `1-libs--simple/` = simple libs which don't need complex cross-cutting features
- `2-libs--cross-cutting/` = provide cross-cutting utilities such as logging, tracing, feature flags, credits...
- `3-libs--advanced/` = more complex libs that have cross-cutting concerns
- `X-incubator/` = test area, relaxed rules. Eventually the package will end up in another folder such as
  `1-libs--simple/` or any other

## Corner cases

Because this monorepo is multi-SKU and contains dev tools SKUs which are used to write the repo itself, we intentionally
break a few dependencies by symlinking targeted files/folders into `__vendor/` folders. This is a tradeoff between truly
avoiding dependency cycles and not duplicating code.

- NOTE: turbo likely doesn't detect changes to a symlink target in the vendoring package = do not abuse, link only very
  stable code or use TURBO_CACHE_BUSTING

## Enforcement

### pnpm

```sh
pnpm install --config.disallow-workspace-cycles=true --lockfile-only --frozen-lockfile
```

### turbo

```sh

```
