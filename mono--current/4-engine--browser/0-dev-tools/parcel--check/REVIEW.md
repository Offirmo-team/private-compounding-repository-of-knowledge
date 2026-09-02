# Review — @monorepo-private/parcel--check

A minimal sandbox package (trivial HTML pages + a couple of TS helper files) used to manually pinpoint Parcel bundler
bugs/instabilities; not a shipped library.

## Findings

- **G5-P2-01** (Minor) — `module/index--lib-use.html` imports `@monorepo-private/normalize-string`, but this package is
  not declared anywhere in `package.json` (`dependencies`/`devDependencies`). This will only resolve by accident via
  hoisting/other workspace packages; it should be an explicit dependency if this test page is meant to keep working.
- **G5-P2-02** (Nit) — `module/dismiss.ts` (`dismiss()`) is never imported/used anywhere (`index--js.html` only uses
  `greet.ts`). Dead file — either remove it or wire it into one of the test HTML pages, consistent with the package's
  "pinpoint issues" purpose.
- **G5-P2-03** (Nit) — `module/index--glob.html`'s inline `<script>` has commented-out dead code
  (`//const glob = import('./*.ts') // direct` and a larger commented `console.log`/`Object.keys` block). Minor clutter
  in what is already throwaway test code.

No other issues found — this is intentionally a disposable diagnostic/sandbox package (per its own description:
"Unfortunately parcel JS is very unstable... this basic project tries to use it in a very simple way, to pinpoint
issues"), so the trivial nature of the code and absence of tests/README is expected and appropriate for its purpose.
