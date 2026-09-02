# Review: @monorepo-private/print-error-to-terminal

Pretty-prints an `Error`-like object (name/message/details/cause chain/stack) to the terminal with ANSI color via
`chalk`, cleaning up stack traces using `framesToPop`.

## Findings

- **PE-01 (Major)** — `module/notes.md` contains the README of an unrelated third-party package ("callsites … Get
  callsites from the V8 stack trace API", with a Travis CI badge for `sindresorhus/callsites`). It has nothing to do
  with this package's actual functionality and appears to be leftover/copy-pasted scaffolding content that was never
  cleaned up. This is misleading documentation and should be removed or replaced with real notes.
- **PE-02 (Minor)** — `_propertyⵧstack_to_string` (`module/src/index.ts:47-69`): the `framesToPop` handling has a subtle
  correctness question — `lines.splice(0, Math.max(ftp, lines.length - 1), ftp_line)` (line 64) replaces up to
  `Math.max(ftp, lines.length - 1)` lines with a single marker line. If `ftp` is smaller than `lines.length - 1`, this
  still splices `lines.length - 1` entries (i.e., almost the entire stack down to the last line) rather than just the
  first `ftp` entries — meaning for small `ftp` values relative to a long stack, far more frames are collapsed into the
  placeholder than the actual number popped. This looks like it should likely be `Math.min(ftp, lines.length - 1)`
  (bounding `ftp` from above, not taking the max) to only ever remove at most `ftp` lines. Current tests only check
  `framesToPop: 3/1` against short synthetic stacks, so this discrepancy isn't caught. Worth double-checking against a
  real long stack trace.
- **PE-03 (Minor)** — This package deals with printing untrusted-ish error content directly to the terminal, so the
  reviewer specifically checked for terminal escape-sequence injection: `_apply_styleⵧred/bold/dim` route everything
  through `chalk`, which itself safely wraps content in SGR codes without interpreting embedded escape sequences as
  anything other than literal text passed through to the terminal — i.e., attacker-controlled `error.message`/`details`
  values are not sanitized/stripped of raw ANSI escape codes before being concatenated into the output string (e.g.,
  `details` values, `message`, arbitrary extra fields via `COMMON_ERROR_FIELDS_EXTENDED`, are interpolated as raw
  strings at lines 31, 80-81, 94). If an attacker can control an error's `message`/`details`/custom fields (e.g., from
  an upstream API response wrapped in an `Error`), they could inject raw terminal escape sequences (e.g., to spoof
  output, hide text, or in vulnerable terminal emulators attempt more exotic attacks) since nothing strips/escapes
  non-printable control characters from those values before printing. This is a general "log injection" class issue
  rather than unique to this lib, and severity depends on whether error contents ever originate from untrusted input in
  this monorepo's usage — flagging as Minor given the terminal-focused nature of the package makes this directly
  in-scope for review, but noting it's a common gap in most error-printing libraries.
- **PE-04 (Nit)** — `error_to_string`'s default `context` parameter (lines 104-110) computes `line_separator` via
  `(new Error("test").stack?.split("\r\n")?.length || 1) > 1 ? "\r\n" : "\n"` — a slightly indirect way to detect the
  platform's stack trace line-ending convention. This works but is non-obvious; a short comment on _why_ this detection
  is needed (rather than just `os.EOL`) would help, since `os.EOL` wouldn't reflect what V8 actually uses in `.stack`
  strings, which is worth stating explicitly since it's not obvious that's the reason for the workaround.
- **PE-05 (Nit)** — Tests are legacy mocha + chai — consistent with existing-code convention, not flagged as a bug.

Test coverage is solid: covers trivial/typed errors, `details`, `framesToPop`, unnamed/custom error names, and circular
`cause` chains. No OOP/class usage (the "CustomException" prototype pattern in tests is exercising the _input_ shape the
function must tolerate, not code under review). No command-injection concerns (no subprocess spawning here).
