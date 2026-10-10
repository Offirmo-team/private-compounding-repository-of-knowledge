## Concepts

- State of an app/account
- goals:
  - offline first
  - eventual consistency = reconciliation of multiple devices/tabs
  - efficient UI with stable deep references
  - immutability:
    - same reference ⇒ same data (referential equality)
    - changed data ⇒ new reference
- Reminders
  - single source of truth
  - functional programming, flux architecture, same ref = same data
- U, T states
  - U = User = should change only on EXPLICIT user investment/interaction
    - example: should NOT change on page load = not enough investment
      - counter-example of "use firefox" detected for the first time (TO REVIEW)
  - T = Time based
    - also valuable and to be persisted, but can be time-forwarded to "to now" without user intervention
    - this "update to now" is not semantically valuable and doesn't require persistence, it's for UI only, e.g. updating
      a countdown...
    - example: TBRPG energy restoring over time and capping at a max value:
      - Too hard to re-derive from an event stream
      - so is stored as "at T=X, energy was an Z" and need to be persisted
      - but can be "updated to now" without the need for a persistence
    - should not be a cache, data inside it should be in need of persistence
- U+T bundle
  - for substates [U, T]
- Root state
  - { U, T }
