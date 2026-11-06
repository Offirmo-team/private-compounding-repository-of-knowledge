# operation--resurrect: spec & design notes

## Goal

The **"progressive resurrection"** assistant (see [concepts](../../../../%23%23CONTRIBUTING/10-concepts.md)): walk the
packages in resurrection order and tell what to fix next, a few packages at a time.

Input = `$MONOREPO_ROOT$/.monorepo/graph.json5`, written by [plugin--graph](../../plugin--graph/module/notes.md) (= the
facts + the order, see its notes).

- the graph must be up to date → re-run the "apply" operation first. An outdated graph (ex. no `layer`) = fail fast
- the goal is to FIX issues → **never crash on an issue**, report it instead (same as plugin--graph)

## Walk

In resurrection order = `sortꓽpackages()` from plugin--graph: group > subgroup > pkg > layer > tie-breaks, **zone by
zone**:

- zone = consecutive packages of the same **subgroup** (a SKU = a subgroup of `S-skus/`, ranked by deps, see
  plugin--graph)
- packages in a `X-incubator/` folder are **not blocking**: their issues are reported, but they neither stop the walk
  nor count in the 5 below (+ exit code 0 if only them)

Every package is displayed, either:

- **actively checked**, its issues =
  1. the "known" ones = already in `graph.json5` (`missing_dep`, `precedence_violation`, `dep_cycle`…)
  2. every `check:*` script of its `package.json`, run with `pnpm run <script>` in the package folder
     - NOT `test`: already covered by `check:unit-tests` (= `run-s test` in all the packages having tests)
     - phantoms have no folder → only their known issues (`missing_package`)
- OR **passively** = only its known issues, displayed but NOT reported (= the report stays "what to fix next"):
  - the zones before `--from <group>[.<subgroup>]`, ex. `--from 1.2` = active checks starting with 1.2 (included)
  - everything after the stop (see below)

Display:

- headers = the group folder name when it changes, then the subgroup folder name (or the SKU) + its path, followed by a
  dot per package, as soon as checked: green = OK, red = issues, yellow = non-blocking issues, gray = passive without
  known issues (passive WITH known issues = red). All the dots aligned (subgroup names right-aligned). Ex.:
  ```
  1-isomorphic/
             1-libs--simple/ 1.1  ●●●●●●●
      2-libs--cross-cutting/ 1.2  ●●●
  S-skus/
    @web-property-outfitter/ 99.3 ●●
  ```
- active checks until (then passive), unless `--all` (= never stop, everything is checked and reported):
  - the **end of the zone** with blocking issues
  - OR **>= 5 packages with blocking issues** (enough work for now)
- then list the packages with issues, in resurrection order, with their issues
  - script failure = the failed script + the path of its log `<pkg>/.monorepo/resurrect--<script>.log` (`:` → `--`)
    = command, duration, exit code, load avg vs. cores (= overloaded machine?), stdout, stderr
    - removed on success = a log exists only if the last run failed
- exit code = 1 if blocking issues (set by the caller, ex. the sandbox: `pnpm sandbox --from 1.2 --all`)

## Misc decisions

- all the packages of a zone are checked **in parallel**, 1 per core: checking a package doesn't need its deps to be
  checked first, the order only matters for the report
  - started and reported in resurrection order, whatever the completion order (the dots are in completion order)
  - no new check started once >= 5 packages with issues, but the running ones are completed (= may report a few more)
  - the checks of a package run sequentially
- the exploration takes the issue detection as a parameter → testable without spawning anything
- the monorepo root is passed already absolute (the sandbox resolves `~` with `homedir()`) = no `~` parsing here
- passive packages with known issues are NOT reported, only a red dot (= the report = what to fix next)
- `check:ts` (`tsc`) also type-checks the sources of the deps it imports → a package can fail because of a dep coming
  later (precedence violation, cycle). Accepted: we resurrect in order anyway
- no timeout on the scripts, no format version check of `graph.json5` (only its fields): overkill

## Open questions / TODO

- speed: cache the results (ex. by content hash), stop a package's checks at its 1st failure
- flaky `check:unit-tests` (~1 run in 3, OK on rerun). Suspected: oversubscription = 1 package per core, BUT each
  `vitest run` also spawns `cores - 1` workers (= ~cores² threads + `tsc`s) → default 5s test timeouts. To confirm with
  the logs (load avg), then fix ex. `VITEST_MAX_WORKERS=1` in the env of the spawned scripts
