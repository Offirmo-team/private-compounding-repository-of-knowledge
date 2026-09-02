# Review — wc--social

A vanilla native Web Component (`offirmoⳆsocial-links` / customized built-in `offirmoⳆsocial-link`) that renders a
themeable social-media icon bar with progressive enhancement, plus a `renderꓽAuthor()` SSR-style HTML string helper.

Note: this package contains `module/~~sandbox` (bug.html, bug.js, demo.html) and `module/~~gen/inspiration` (screenshot
references) scratch folders — not reviewed here per instructions.

## Findings

- **G6-P18-01** (Critical) — `_get_normalized_hex_representation()` and the `get_url()` functions for each network throw
  plain `Error`s on invalid input (e.g. any hex color that isn't exactly `#rrggbb`, or calling `website.get_url()`), and
  several call sites (`get_expected_href`, `_render`) only wrap _some_ of these in `try/catch`. But
  `get_icon_color‿hex()` → `_get_normalized_hex_representation(c)` is called from `_render()`
  (`web-component--social-links.ts:512-513`, via `_get_icongram_params`) with **no surrounding try/catch** at all. If
  `getComputedStyle(this).getPropertyValue("color")` ever returns a color format other than `#rrggbb` or `rgb(...)`
  (e.g. `rgba(...)`, `hsl(...)`, a named color that the browser reports back as itself in some engines, or a CSS
  variable that fails to resolve to a plain color), `_render()` throws synchronously inside a `then()`-deferred callback
  with no catch, silently breaking the element's rendering with an unhandled promise rejection and leaving the link
  element un-rendered (no icon, no href) with only a console error at best, more likely nothing visible at all to the
  end user.
- **G6-P18-02** (Major) — Constructor DOM mutation violates Custom Elements spec expectations: `SocialNav`'s constructor
  sets `this.innerHTML = ... + this.innerHTML` (lines 197-244). The Custom Elements spec explicitly states a constructor
  "must not inspect its own attributes or children" and "must not gain any attributes or children" — consumers using
  `document.createElement()` expect an empty, childless element back. Mutating `innerHTML` in the constructor breaks
  that contract and can misbehave under declarative shadow DOM / SSR hydration or with `document.importNode`. The code
  itself is self-aware of this ("TODO should be in 'render'?", line 196) — this TODO should be resolved by moving the
  style injection into `connectedCallback` (see also G6-P18-03).
- **G6-P18-03** (Major) — No `connectedCallback` is implemented (the commented-out one at lines 293-303 is
  dead/debug-only code, and disconnectedCallback/adoptedCallback are commented out too). Rendering entirely relies on
  `attributeChangedCallback` (fired during upgrade for attributes present at parse time) and a direct call from the
  constructor as a fallback. Both `_render()` methods call `getComputedStyle(this)` to read the cascaded CSS (theme,
  colors) — but `getComputedStyle` on an element that is not yet connected to a document returns default/initial
  computed values, not the real cascade. Since the debounced render is scheduled via a bare `setTimeout(resolve)` (a
  macrotask) in the constructor, there is a real window where the constructor runs (e.g. during `document.createElement`
  before insertion), the debounce timer fires, and `_render()` reads wrong computed styles — and since there is no
  `connectedCallback` to re-trigger a render once actually inserted, the element can end up permanently mis-rendered
  until some later attribute mutation happens to occur. Adding a `connectedCallback` that (re-)schedules a render would
  close this gap and is the idiomatic fix.
- **G6-P18-04** (Minor) — No `disconnectedCallback` cleanup exists for anything, but on inspection there is nothing that
  strictly _needs_ cleanup today: no `addEventListener` on `window`/`document`, no interval/rAF loop, and the only
  "leak" risk is a debounced `setTimeout(resolve)` per pending render that isn't cancelled on disconnect — if the
  element is removed from the DOM while a render is pending, `_render()` still runs against the disconnected node
  (wasted work reading/writing styles on a detached element, not a true leak since it doesn't retain external
  resources). Low impact, but worth a `disconnectedCallback` that clears the pending promise/flag for cleanliness,
  especially given how debounce state is stored as ad-hoc instance fields (`_SADPromise`).
- **G6-P18-05** (Major) — Unescaped attacker-influenced string interpolated into `innerHTML` (`_render()` on
  `SocialLink`, lines 575-583): `alt="Logo of ${network_infos.official_name || network_id}"`.
  `network_infos.official_name` is always a safe static string from `SOCIAL_NETWORKS_INFO`, **but** the fallback
  `network_id` is derived from `this.getAttribute("data-network")` (via `get_network_id()` → `_normalize_network_id()`)
  whenever the network isn't recognized (`_get_network_info` returns the `"unknown"` entry, which has
  `official_name: ""`, so the fallback `network_id` — the raw, attacker/CMS-controllable attribute value — is used
  verbatim). Since this value is written into an HTML attribute via string concatenation rather than through the DOM API
  or an escaping helper, a `data-network` value such as `"><img src=x onerror=alert(1)>` breaks out of the `alt="..."`
  attribute and injects arbitrary markup/script when the component is used with any handle/network coming from user- or
  CMS-editable content (the README's own warning "assume a dev set it up, may throw on incorrect settings" acknowledges
  limited trust but doesn't call out this XSS vector specifically).
- **G6-P18-06** (Major) — Same unescaped-interpolation pattern exists in `renderꓽAuthor()` (lines 606-644):
  `author.urlⵧcanonical`, `author.email`, `url_social.network`, and `url_social.url` are all concatenated directly into
  `href="${...}"` and text-node positions of a raw HTML string (typed as `Html‿str`, presumably later inserted via
  `dangerouslySetInnerHTML` or `innerHTML` by a consumer). If any `Author` data ever originates from user input or an
  untrusted CMS field (plausible given `network`/`url`/`email` are free-form author-profile fields), this is a
  straightforward HTML/attribute-injection vector. Since this function's entire purpose is to _produce_ HTML for later
  unsafe insertion, it should escape each interpolated value (e.g. `encodeURIComponent`-style guard for URLs,
  HTML-entity escaping for text) rather than assume all `Author` records are always developer-authored trusted data.
- **G6-P18-07** (Minor) — Plain-object property lookups keyed by untrusted attribute strings without an own-property
  guard: `SOCIAL_NETWORKS_INFO[network_id]` (`_get_network_info`, line 668) and `SOCIAL_NETWORKS_INFO[candidate]`
  (line 421) use bracket access on a plain object literal, which inherits from `Object.prototype`. A
  `data-network="constructor"` (or `"toString"`, `"hasOwnProperty"`, etc.) attribute resolves to the inherited
  `Object.prototype` member instead of `undefined`, silently bypassing the "unknown network" fallback/error-logging path
  and producing confusing partial behavior (e.g. `_get_icongram_params` reads `network_infos.icongram` as `undefined`
  off the `Object` constructor function, falling through to default icon params) rather than the intended
  `unknown`/error handling. Not exploitable for prototype _pollution_ (read-only lookup), but it's a real
  correctness/robustness gap; use
  `Object.hasOwn(SOCIAL_NETWORKS_INFO, id) ? SOCIAL_NETWORKS_INFO[id] : SOCIAL_NETWORKS_INFO.unknown` or a `Map` instead
  of a plain object.
- **G6-P18-08** (Minor) — `// @ts-nocheck` at the very top of the file (line 1) disables type checking for the _entire_
  module, including the plain functions (`_normalize_network_id`, `_get_icongram_params`, etc.) that have no inherent
  reason to be untyped — this is inconsistent with the rest of the monorepo's strict-TypeScript convention and hides the
  exact kind of bugs flagged above (e.g. TS would likely flag the untyped `network_infos` object-index access and the
  implicit `any` params throughout `SOCIAL_NETWORKS_INFO`'s methods).
- **G6-P18-09** (Nit) — `this.outerHTML = ""` is used to remove a self-referencing link (`_render()`, line 504) instead
  of the more idiomatic and cheaper `this.remove()`. Setting `outerHTML` forces the browser to re-parse an (empty) HTML
  fragment and replace the node, which is both less efficient and less clear in intent than `Element.remove()`.
- **G6-P18-10** (Minor) — Architectural limitation not fully called out: customized built-in elements
  (`is="offirmoⳆsocial-links"` / `is="offirmoⳆsocial-link"`, used via `{ extends: "nav" }` / `{ extends: "a" }`) are
  permanently unimplemented in Safari/WebKit (Apple has stated they will not implement this part of the Custom Elements
  spec). The README does flag "WARNING example does not work on Safari" but frames it as an example/doc issue rather
  than a fundamental constraint: on Safari, `customElements.define` for a customized built-in silently does nothing,
  `is=` is ignored, and the component never upgrades — with JS enabled, Safari users get the plain unstyled
  `<nav>`/`<a>` markup with none of the enhancement, and no runtime detection/fallback/warning exists in the component
  itself.
- **G6-P18-11** (Minor) — No tests exist (mocha/chai or vitest) for any of the pure, easily-unit-testable helper
  functions (`_normalize_network_id`, `_normalize_handle`, `_get_normalized_hex_representation`, `_get_icongram_url`,
  `_get_icongram_params`, `get_network_id`'s href-matching heuristics) despite this being the most logic-dense package
  of the five reviewed and the one with the most edge cases (color format parsing, URL-based network inference, email
  de-obfuscation).
- **G6-P18-12** (Nit) — Debounce helper `_schedule_and_debounce` (lines 756-770) uses a bare `setTimeout(resolve)`
  wrapped in a `Promise` purely to get a "next macrotask" delay; `queueMicrotask` or simply calling `callback()`
  directly inside a `Promise.resolve().then()` would achieve a similar coalescing effect with less indirection — minor
  stylistic point, not a bug (the existing self-documenting `XXX` comment about "the SAME callback/setter/getter"
  already flags the fragility of this pattern, which is good practice, just worth reiterating that a small custom
  hook/module would remove the need to reimplement this getter/setter contract at each of the two call sites).

## Package.json / MANIFEST consistency

`package.json`'s `sideEffects: true` and `MANIFEST.json5`'s `hasꓽside_effects: true` correctly reflect that importing
this module registers global custom elements as a side effect — no inconsistency found here.

Custom element lifecycle correctness summary: `observedAttributes` static getters are correctly implemented for both
classes (G6-P18 findings above cover the gaps — constructor DOM mutation, missing `connectedCallback`, unescaped
`attributeChangedCallback`-triggered render output).
