# Review: plugin--parcel

Adds Parcel-based dev/demo/sandbox/storypad scripts and manages `.parcelrc` for browser-target packages.

## Findings

- **G10-P2-01 (Minor)** — All Parcel dev-server scripts (`stories`, `demo`, `sandbox`) share a single hardcoded fixed
  port via `PARCEL__COMMON_OPTIONS = "--port 1981 --lazy --no-autoinstall"`. The code comments explain this is
  intentional ("parcel caches with bugs, so we can't have several running anyway"), but it does mean two packages' dev
  servers can never run concurrently without a manual port override — a minor but real constraint worth keeping in mind
  as the monorepo grows.
- **G10-P3-01 (Nit)** — Stale commented-out reference to a Parcel HMR bug (`//--no-hmr`, parcel-bundler/parcel#8181)
  marked "it seems to work for now..." — acknowledged uncertainty, no action needed.
- **G10-P3-02 (Nit)** — `.parcel` gitignore entry marked `// parcel 1 TODO cleanup` — tracked cleanup item, not a bug.

No other issues found — the conditional `.parcelrc` present/absent handling per package target is clean.
