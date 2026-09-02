# Review: @monorepo-private/spawn-correctly

Wraps `cross-spawn` to spawn a child process while correctly handling every stdio/error/exit/close event, rejecting with
a fully-decorated `SpawnError`, and offering a convenience helper (`spawnCorrectlyAndResolvesWithStdout`) that resolves
with the trimmed stdout.

## Findings

- **SC-01 (Minor)** — Security note (explicitly requested focus: command injection): `spawnCommand`/`spawnArgs` are
  passed to `cross_spawn(spawnCommand, spawnArgs ?? [], spawnOptions ?? {})` (`module/index.ts:132`) as separate array
  elements, never shell-concatenated — this is the safe pattern, and `cross-spawn` itself exists specifically to avoid
  Windows `cmd.exe` argument-injection issues that Node's native `child_process.spawn` has with `.bat`/`.cmd` files.
  `commandForLog` (line 53) is a plain string built only for logging, never re-executed. However, `spawnOptions` is
  passed through verbatim to `cross_spawn` with no validation — if a caller passes `spawnOptions: { shell: true }`, the
  safety guarantees of `cross-spawn`/array-args are bypassed and `spawnArgs` become shell-interpreted, reopening the
  classic shell-injection vector for any caller-supplied/untrusted argument content. This is inherent to Node's own
  `child_process` API (opting into `shell: true` is always the caller's responsibility), and no caller in this codebase
  currently does so, but the README doesn't warn against it despite this package's stated goal of spawning "safely" (per
  `package.json`'s description). Worth a one-line README/type-level caution against combining `shell: true` with
  untrusted `spawnArgs`.
- **SC-02 (Minor)** — `package.json` declares `@monorepo-private/assert` as a runtime `dependency` (line 19), but it's
  never imported anywhere in `module/index.ts` — the code uses Node's built-in `node:assert`
  (`import { strict as assert } from "node:assert"`, line 1) instead. Same stale/unused-dependency pattern flagged in
  `fs--output-file` (FO-02).
- **SC-03 (Nit)** — `fail()`'s best-effort error-message extraction (lines 89-110) scans the first `MAX_USEFUL_LINES` of
  stderr/stdout for the substrings `"error"`, `"exception"`, `"not found"` (case-insensitive) to synthesize a
  human-readable message. This is a reasonable heuristic for a wrapper library, but it means the derived `err.message`
  can pick up an unrelated line that merely contains one of those words (e.g., a benign log line mentioning "error
  handling") rather than the actual failure — low risk given it's only used for a friendlier message and the raw
  `stdout`/`stderr`/`cause` are always preserved on `SpawnError` for callers who need ground truth.
- **SC-04 (Nit)** — `DEBUG` is a hardcoded `false` module-level constant ("for local debug", line 9) rather than reading
  from an env var — fine for a small internal lib, just means enabling verbose logging requires an edit-and-revert
  rather than an env flag; `extraOptions.verbose` already covers the per-call use case so this is a non-issue in
  practice.

No other issues found. Test coverage is good: covers command-not-found (ENOENT), stdio misconfiguration (missing
stdout), non-zero exit, and SIGINT interruption, plus the success/trim path — matching the README's stated goal of
covering "all stdio streams errors / all exit-error events / all possible errors". Tests are legacy mocha + chai,
consistent with the in-progress vitest migration, not flagged as a bug. No OOP/class usage; function-first style
throughout. No `~~tosort` folder present in this package.
