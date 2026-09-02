# Review: @infinite-monorepo/operation--apply

Orchestrates the full "apply" pipeline for the infinite-monorepo tool: loads the spec, discovers workspace/SCM graph
nodes, runs every registered plugin's lifecycle hooks (`onꓽload`, `onꓽnodeⵧdiscoveredⵧfirst_time`,
`onꓽnodeⵧdiscoveredⵧbfs`, `onꓽnodeⵧrefine`, `onꓽapply`) to convergence, then commits the resulting output files to disk.

## Findings

- **G9-P70-01** (Major) — Dead code / misleading error handling in the per-package analysis block
  (module/src/index.ts:176-183):
  ```ts
  return updated_details
  ```

} catch (err) { throw err return { ...state.graphs.nodesⵧworkspace[_outdated_node.path‿abs].details, _error: err, } }

```
The `throw err` unconditionally re-throws before the `return` with the constructed `_error` fallback object can ever execute — so the fallback-with-`_error` recovery path (which mirrors the pattern used two blocks above for the "special package not implemented" case, and for the `_dontꓽpresent` case) is unreachable dead code. Given the surrounding code clearly intends graceful degradation (attach `_error` to details and continue), this looks like a bug: either the `throw err` should be removed to let processing continue with `_error` recorded, or the dead `return` should be removed if fail-fast really is intended. As written it silently aborts the whole `apply()` run on any single package's analysis error, which seems inconsistent with the pattern established elsewhere in the same function.

- **G9-P70-02** (Minor) — `ensureSymlink()` (module/src/index.ts:422-443) hardcodes `target = "../AGENTS.md"` and `linkPath = ".claude/CLAUDE.md"` at the call site (`case "symlink": ... return ensureSymlink("../AGENTS.md", ".claude/CLAUDE.md")`), even though the function signature and the `"symlink"` output-file intent (defined in `50-state`'s `types.ts`) look generic/reusable. If more than one symlink target is ever needed, this hardcoding will need revisiting; currently there is exactly one call site with fixed arguments, so the generic parameters add complexity without payoff yet.

- **G9-P70-03** (Minor) — `ensureSymlink()` catches with `catch (err)` and reads `err.code` without narrowing type (`err` is implicitly `any` from the catch clause and `.code` is accessed directly, line 439) — should use `(err as NodeJS.ErrnoException)?.code` similar to how `present--containing` at line 391 already guards with `(err as any)?.code`. Minor type-safety inconsistency within the same file.

- **G9-P70-04** (Minor) — No unit tests exist for this package despite it being the central orchestration logic of the whole "apply" tool (graph traversal convergence loop, plugin hook dispatch order, commit/intent switch logic). `mocha`/`chai`/`sinon`/`vitest` are declared as devDependencies but there's no `"test"` script in `package.json` and no `*.tests.ts` files. Given the complexity of the `_propagate()` convergence loop and the `_commit()` intent switch (5 cases), this is a real coverage gap.

- **G9-P70-05** (Nit) — `module/MANIFEST.json5` is empty (`{}`) with no `description`, unlike `60-pkg-analyzer`'s manifest which documents its purpose.

- **G9-P70-06** (Nit) — No `README.md` for the package; its purpose can only be inferred from code.

- **G9-P70-07** (Nit) — Untriaged content: `module/~~tosort/` exists in this package (containing `2025/plugin--eslint/`, `2025/plugin--yarn-berry/`, `2025/plugin--prettier/` sub-packages-in-progress). Per the project's own `~~` = "unstructured" convention (see `@infinite-monorepo/heuristics`'s `isꓽin_unstructured_folder`), this is expected/intentional scratch space, but it should eventually be sorted into the proper plugin structure or removed. Not reviewed for code quality per review scope.

## Notes

- `module/~~sandbox/index.ts` has uncommitted local in-progress edits (per `git status`) and was intentionally excluded from this review — not read for content analysis beyond confirming its existence, and not modified.
- The package is pure-functional in style; the only borderline OOP-ish construct is the `plugins: Record<string, Plugin>` object used as a registry, which is a plain object (not a class) and fits the "Plain Old Types + pure functions" convention — no OOP finding here.
```
