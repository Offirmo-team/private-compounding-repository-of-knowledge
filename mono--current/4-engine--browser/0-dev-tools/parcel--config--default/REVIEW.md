# Review — @monorepo-private/parcel-config

Shared default Parcel bundler configuration (extends `@parcel/config-default` with glob resolver, custom resolver
plugin, and a raw transformer for `.txt`).

## Findings

- **G5-P3-01** (Nit) — `package.json` name is `@monorepo-private/parcel-config` (no double-dash) while the folder is
  `parcel--config--default` and most sibling packages use the double-dash naming convention (`parcel--check`,
  `parcel--toolbox`, etc.). Purely cosmetic/naming inconsistency, not a functional issue.
- **G5-P3-02** (Nit) — README's "tosort" section documents dead-end experiments (validators/transformers that "doesn't
  work" / "doesn't bring anything") kept as historical notes; fine as documentation of prior art but could eventually be
  pruned once stale.

No other issues found — this is an intentionally tiny, declarative config package (no source logic to unit-test), and
the README clearly documents the rationale, known Parcel bugs, and troubleshooting steps for future maintainers.
