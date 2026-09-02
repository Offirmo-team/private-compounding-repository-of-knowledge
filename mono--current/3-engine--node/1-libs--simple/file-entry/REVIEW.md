# Review: @monorepo-private/file-entry

Small utility computing a rich, derived "file entry" descriptor (path variants, extensions, semantic basename) from an
absolute file path.

## Findings

- **FE-01 (Minor)** — `updateꓽfile_entry()` in `module/src/index.ts:50-60` deliberately mutates its `entry` argument in
  place (`entry[k] = new_entry[k]`, with a `@ts-ignore` to bypass the type system). This directly contradicts the
  project convention of avoiding mutation of function inputs. The comment above it ("in-place mutation … for rare uses
  where we want to keep the reference") justifies the intent, but no caller of this function exists anywhere in the
  reviewed package, so the trade-off can't be verified against real usage. Consider returning a new object and letting
  call sites reassign, or documenting/guarding this API more defensively if the mutating reference semantics are truly
  required by a consumer.
- **FE-02 (Nit)** — No README.md in this package (unlike several sibling `1-libs--simple` packages). Given the
  non-obvious naming scheme (`extⵧsub`, `basenameⵧsemantic‿no_ᐧext`, etc.), even a short README pointing at `types.ts`'s
  inline example comments would help consumers.
- **FE-03 (Nit)** — Legacy mocha + chai test (`index.tests.ts`) — expected for existing code per the vitest migration
  policy, not a bug.
- **FE-04 (Nit)** — `basenameⵧsemantic‿no_ᐧext` behavior for `index.*` files (falls back to parent directory name +
  sub-extension) is a reasonable heuristic but has no test for nested edge cases (e.g., `index.ts` directly under the
  package root with no parent segment, or a root-level file with no directory at all) — only the "happy path"
  (`src/index.ts` → `"src"`) is exercised in `index.tests.ts`.

No dead code, no security issues (pure path-string manipulation, no I/O), no OOP/class usage, and no dependency/README
inconsistencies. Test coverage for the three documented shapes (plain file, double-extension file, dotfile) is decent
and passes standard `path` module reasoning. Package is otherwise trivial and free of real issues — "No other issues
found" beyond the above.
