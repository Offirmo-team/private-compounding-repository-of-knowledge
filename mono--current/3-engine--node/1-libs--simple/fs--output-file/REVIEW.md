# Review: @monorepo-private/fs--output-file

Trivial helper to write a file while ensuring its parent directory exists (mkdir -p + writeFile), async-only (per
README: "trivial function to write a text file + mkdirp").

## Findings

- **FO-01 (Major)** — `outputFileSync()` (`module/index.ts:6-8`) is exported but unconditionally throws
  `Not implemented!`. This is dead/stub code shipped in the public API surface with no test, no TODO comment, and no
  indication in the README that a sync variant exists but is unimplemented. Either implement it (mirroring
  `ೱoutputꓽfile` using `node:fs` sync APIs) or remove the export until it's needed — an exported function that always
  throws is a footgun for any consumer who doesn't read the source first.
- **FO-02 (Minor)** — `@monorepo-private/assert` is declared as a dependency in `package.json` but is never
  imported/used anywhere in `module/index.ts` (only `@monorepo-private/promise-try` is used). Likely stale from a
  previous version of the code or copy-pasted from a template.
- **FO-03 (Minor)** — Zero tests in the package (no `*.tests.ts` files) despite `mocha`/`chai`/`vitest` devDependencies
  being present. The core async function has non-trivial behavior worth covering (e.g., creating nested directories,
  `fd`/buffer overload variants passing through `...args` correctly) — currently entirely unverified.
- **FO-04 (Nit)** — Naming: the exported function is `ೱoutputꓽfile` (with a leading Kannada vowel sign character `ೱ`,
  presumably a house-style marker for "returns a promise") while the unimplemented sync counterpart is plain
  `outputFileSync`. The inconsistent naming style between the two exports (special-char-prefixed vs.
  plain-camelCase-suffixed) may confuse consumers scanning for the "the async one" vs "the sync one".
- **FO-05 (Nit)** — `ೱoutputꓽfile`'s type signature `Parameters<typeof fs.writeFile>` /
  `ReturnType<typeof fs.writeFile>` is a nice way to stay in sync with Node's own `fs.writeFile` overloads without
  duplicating types — good practice, no note needed beyond this being a nice pattern.

No security issues (no shell/exec usage, standard fs calls), no OOP/class usage, README is accurate for the one
implemented function but silent about the broken `outputFileSync` stub (see FO-01).
