# Review — @oh-my-rpg/state--engagement

Holds the state (queue) of "engagement" messages (feedback/notifications/toasts) to show the player, decoupled from how
the consumer renders them.

## Findings

- **G7-P2-01** (Minor): `module/src/selectors/index.tests.ts:11` — the entire
  `describe("... - selectors", function () {})` body is empty: there are zero tests for `getꓽpending_engagements`,
  despite unused imports (`enforceꓽimmutable`, `create`, `getꓽSXC`) suggesting a test was intended but never written.
- **G7-P2-02** (Minor): `module/src/reducers/index.tests.ts:23` — `// TODO test other reducers`: only `create()` is
  tested; `enqueue`, `acknowledge_seen`, and `acknowledge_seenⵧall` have no unit tests at all, including the assertion
  path in `acknowledge_seen` (`assert(uid_left_to_dequeue.size === 0, ...)`).
- **G7-P2-03** (Minor): `module/src/reducers/index.ts:27-29` — comment acknowledges a known possible bug:
  `// Avoid duplication? Possible bug? hard to detect... ex. multiple consecutive level rises are ok / ex. multiple new achievements`.
  `enqueue()` never deduplicates, so this is a self-identified gap rather than something newly found here — flagging so
  it isn't lost.
- **G7-P2-04** (Nit): `package.json:12` — the check script is named `"_check"` (underscore-prefixed) while every sibling
  package in this review batch uses `"check"`. If this is meant to disable/skip it from `run-s`/`turbo` pipelines that
  key off the `check` script name, it's an easy thing to forget to re-enable; if accidental, it silently drops this
  package from CI-style checks.
- **G7-P2-05** (Minor): `module/~~gen/ok.jpg` — a binary JPEG committed inside the package's `module/` tree (not under a
  `~~tosort` folder, so in scope for this review). No source file references it; looks like a stray generated/test
  artifact that shouldn't be versioned.
- **G7-P2-06** (Nit, informational): `module/MANIFEST.json5` explicitly sets
  `status: "unstable" // major rewrite in progress`. This context should temper the other findings above — the thin test
  coverage may be an accepted, temporary state of an in-flight rewrite rather than an oversight.

No other issues found — reducers stay immutable/pure, no OOP, migration pipeline (`v1 → v2`, wiping the queue) is
documented and covered by `migrations/index.tests.ts` and `examples/index.tests.ts`.
