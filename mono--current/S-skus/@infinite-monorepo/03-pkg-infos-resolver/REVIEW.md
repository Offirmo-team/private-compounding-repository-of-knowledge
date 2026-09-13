# Review — @infinite-monorepo/pkg-infos-resolver

Purpose: fetches and caches npm package metadata (`package.json`, including auto-discovery of the matching `@types/*`
package) to support version/typings resolution for other `@infinite-monorepo` tooling; exposes a stateful
`PkgInfosResolver` class wrapping an internal immutable-reducer state module.

## Findings

- **G9-P03-05 (Minor)** — Silent behavioral inconsistency in error handling: in `processꓽresolved_pending_async`
  (`reducers.ts:26-35`), a `"rejected"` pending promise is only swallowed (logged) when
  `ip._auto && reason.name === "PackageNotFoundError"`; any other rejection is rethrown, which will crash the whole
  reduce loop (and thus `ೱall_pending_loaded()`), losing all other already-resolved entries in the same batch since
  `state` reassignment happens via `.reduce` and the throw escapes before the final `{...state, ↆpackageᐧjson_fetches}`
  is returned. Worth confirming this fail-fast behavior is intentional; if a caller awaits several packages and one
  non-auto fetch fails, all progress for that tick is discarded (though already-committed prior calls persist since
  state is reassigned per-iteration... actually no: the throw happens mid-`reduce`, so the local `state` produced for
  earlier iterations in _this_ call is lost too, since it only returns at the end). Should be double-checked against
  caller expectations (`ೱall_pending_loaded` in `index.ts`).
