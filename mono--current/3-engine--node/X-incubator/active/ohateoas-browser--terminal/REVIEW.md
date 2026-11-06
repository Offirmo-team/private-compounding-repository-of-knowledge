# Review: @monorepo-private/ohateoas-browser--terminal

A terminal-based interactive browser/client for Offirmo's Hypermedia Architecture (OHA), rendering hypermedia documents
and following their links/actions from the command line.

## Findings

- **OB-01 (Critical)** — `module/index.ts:39` imports a fixture server from a path that no longer exists:
  `"../../../../1-isomorphic/2-libs--cross-cutting/ohateoas/module/src/__fixtures/example--01-hello-world/index.ts"`.
  The actual directory is `1-isomorphic/2-libs--cross-cutting/50-ohateoas/` (renamed/prefixed with `50-`, confirmed via
  `find`), not `ohateoas/`. `tsc --noEmit` fails with `TS2307: Cannot find module`, and since this import is the
  module's sole source of `SERVER` (used at top-level, line 45, to actually run the interactive loop), the package
  cannot run at all — this is dead/broken code, not just a type-check nit. This is the package's own bug (as opposed to
  the many transitive errors from its dependencies, see OB-02).
- **OB-02 (Major)** — `tsc --noEmit` in this package surfaces ~26 errors, but the large majority are **transitive**,
  originating in dependencies (`@monorepo-private/ohateoas`'s `50-ohateoas` source,
  `@monorepo-private/rich-text-format`, `@monorepo-private/rich-text-format--to-terminal`, `@monorepo-private/assert`)
  rather than in this package's own code. Beyond OB-01, this package's own file has further real errors once the import
  is fixed: `module/index.ts:54` (`s.url` doesn't exist on `State` — should likely be `s.urlⵧload`/`s.urlⵧself` per the
  type actually used elsewhere in the same file), and lines 89/90/99/103/104/106/107/110 all reference properties
  (`href`, `urlⵧself`) or push plain strings into arrays typed for
  `ImmutableObject<OHAHyperLink> | ImmutableObject<OHAHyperActionBlueprint>` (`URI__ROOT`, `"reload"`, `"exit"` pushed
  onto `choices`, line 104/106/107, then compared/passed to `getꓽcta` at line 110 which expects a link/action-blueprint
  object, not a bare string). This package does not currently compile even setting aside its dependencies' issues — it
  looks like a work-in-progress/demo that was never finished after an upstream rename (`ohateoas` → `50-ohateoas`) and a
  `State`/`links` shape change.
- **OB-03 (Major)** — The core "act" step is unimplemented: the interactive loop (lines 58-141) builds up a full list of
  `choices` (actions, links, root, reload, exit) and prints them with indices (lines 109-112), but never actually reads
  user input to select one — `rl` (the `readlinePromise` interface) is created (line 67) and later closed (line 140) but
  `rl.question(...)` is never called; the `keypress` listener/`promise`/`resolve`/`reject` set up at lines 62-66 are
  also never awaited or used. The loop instead always hits
  `console.log("[Auto-browse: I don't know what to do...]"); break loop` (lines 137-138) after the first iteration — so
  despite being named/described as an interactive terminal browser, it currently can only ever display the root page
  once and exit. This matches the `// TODO (see unit tests)` in the README's "Advanced" section and the general feel of
  a stalled prototype, but it means the package doesn't deliver its core stated purpose yet.
- **OB-04 (Minor)** — Several stale/dead commented-out import lines at the top of the file (lines 31-34) reference three
  different alternate fixture-server paths (including two identical `~~sandbox` paths on lines 33-34), left over from
  earlier experimentation. These add noise and reference paths that themselves look outdated
  (`~~sandbox/example--tbrpg/server`) — worth cleaning up once OB-01 is fixed with a deliberate fixture choice.
- **OB-05 (Minor)** — Large commented-out block (lines 113-132) shows an alternative rendering approach (manually
  iterating `action_blueprints`/`links` and a sketched `rl.question(...)` call with a `choices` option) that was
  apparently the intended completion of OB-03 but was abandoned mid-write. Since this is effectively a TODO-by-comment
  for unfinished functionality, it would be clearer as an actual tracked TODO comment (or removed) rather than left as
  inert commented code.
- **OB-06 (Nit)** — No tests at all (no `*.tests.ts` files) despite `mocha`/`chai`/`vitest` devDependencies present —
  understandable for a CLI/interactive package but the pure logic (choice-building, root/back detection) could be
  unit-testable independent of the readline loop.
- **OB-07 (Nit)** — No `README.md` in this package's own directory (only `module/MANIFEST.json5`) — the package's
  purpose ("Terminal implementation of a Offirmo's Hypermedia Architecture browser", from `package.json`'s description)
  is otherwise undocumented for a reader browsing the repo.

No `~~tosort` or `~~sandbox` folder present in this package. No unnecessary OOP/class usage; function-first style
throughout. No command-injection/shell concerns (no subprocess spawning — this package only reads from stdin/writes to
stdout via `node:readline`/`zx`'s `question`, neither of which is exercised with untrusted shell input here).
