# turborepo

https://turborepo.com/docs

## just vs turbo vs pnpm

Use the right one!

- just
  - ✅ doesn't need pnpm install
  - ✅ is good at calling shell scripts
  - ✅ wraps `turbo` calls with goodies
- pnpm
  - ✅ can call scripts in the current package
  - ✅ can call multiple scripts in the current package with a glob
- turbo
  - ✅ is aware of the monorepo dependency graph
  - ✅ can call scripts in any package with orchestration
  - ✅ can cache executions

## semantic of scripts/tasks

Because out monorepo is growing, we want to take advantage of Turborepo's ability to:

- orchestrate tasks across packages
- cache

To be able to express generic tasks dependencies in this file,
we need to agree on a common semantic for script names.

Here is a proposed semantic:

### Common rules

Do NOT rely on the package manager lifecycle rules:

- No **custom** script name should start with `pre` or `post` as package managers have a special meaning for them:
  https://docs.npmjs.com/cli/v11/using-npm/scripts#pre--post-scripts
- Do NOT use the `prepare` script which has great semantic but "escapes" turbo if used ⚠️
- Do NOT use `postinstall` except at the root

Rationale: we use ONLY turbo for scripts dependencies:

1. We don't want to introduce another layer of script dependencies
2. If used, it prevents turbo from caching and parallelizing properly

Of course special scripts for manual operations such as `prepublish` are allowed.

### `prepare:pkg`

= prepare a package for being used = consumed by other packages in the monorepo.

Same semantic as npm's [`prepare`](https://docs.npmjs.com/cli/v11/using-npm/scripts#life-cycle-scripts)
but with an alternate name since we want to control it through turbo.

- generate code if needed
- pre-build if needed (for packages that are not "source imported")

### `generate`

= for _frequently_ updated auto-generated assets, configs, code...

- We don't want them commited in the repo for 1) "single source of truth" 2) cutting noise in diffs
- Will be called often to ensure freshness, for ex. postinstall, unit tests
- If present, should always be defined as `"generate": "pnpm run clean && pnpm run /^generate:[^:]*$/"`
  (note that the regex 1. avoid infinite loops 2. allows layers of generate tasks)
- Use sub-scripts for the actual stuff (ex. `generate:xyz`)
- *UN*frequent generations should likely be manual on-demand and not use this automation

### `build`

= prepares for publish / deploy = usually only needed in Apps or public packages

- should NOT be required during dev
- is different from `generate` = build is a final step before publish / deploy, while generate is about generating frequently updated assets

### `clean`

= remove anything generated / built / temporary

- should only remove LOW VALUE stuff that can be regenerated easily and quickly
- should NOT remove longer lived stuff such as env vars, local secrets, D1 data...
