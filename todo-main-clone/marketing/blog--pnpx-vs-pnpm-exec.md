# `pnpx oxfmt` vs `pnpx oxfmt@catalog:` vs `pnpm exec oxfmt`: three different oxfmts

My monorepo lists `oxfmt` as a dev dependency. Its version comes from a pnpm catalog (`oxfmt: ^0.71`) and the lockfile
pins it at **0.71.0**. Out of habit I typed `pnpx oxfmt`… and got **0.72.0**.

Here's what each command actually runs (pnpm 11).

## 1. `pnpx oxfmt`: "give me the latest"

`pnpx` is the same as `pnpm dlx`. Unlike `npx`, it **never looks in `node_modules/.bin`**. Every run, it:

1. asks the registry for `oxfmt@latest`, filtered by the workspace's `minimumReleaseAge` / `trustPolicy`;
2. installs that exact version into a throwaway project in pnpm's cache (`~/Library/Caches/pnpm/dlx/<hash>/` on macOS),
   or reuses one younger than `dlx-cache-max-age` (24h by default);
3. runs it.

Your lockfile and your catalog play no part. And since oxfmt writes files by default, a bare `pnpx oxfmt` reformats the
whole folder with a version your CI doesn't use.

## 2. `pnpx oxfmt@catalog:`: "the catalog range, looked up fresh"

This goes through the same dlx steps, but pnpm first replaces `catalog:` with the range from `pnpm-workspace.yaml`
(`^0.71`). It then looks that range up **on the registry**, not in the lockfile. Today that gives 0.71.0. If 0.71.1
ships tomorrow (and is at least 24h old), you'll get 0.71.1 while your lockfile still says 0.71.0.

Outside the workspace there's no catalog to read:

```
[ERR_PNPM_CATALOG_ENTRY_NOT_FOUND_FOR_SPEC] No catalog entry 'oxfmt' was found for catalog 'default'.
```

## 3. `pnpm exec oxfmt`: "exactly what's installed"

This runs `node_modules/.bin/oxfmt`, i.e. the version from the lockfile. It makes no registry request, and the version
only changes when the lockfile does. The catch: you need a `pnpm install` first.

## Recap

|                                     | `pnpx oxfmt`         | `pnpx oxfmt@catalog:`      | `pnpm exec oxfmt`       |
| ----------------------------------- | -------------------- | -------------------------- | ----------------------- |
| Binary comes from                   | dlx cache            | dlx cache                  | `node_modules/.bin`     |
| Version wanted                      | `latest` tag         | catalog range (`^0.71`)    | lockfile (exact)        |
| Version found by                    | registry             | registry                   | lockfile                |
| Version today                       | **0.72.0**           | 0.71.0                     | 0.71.0                  |
| Matches the lockfile                | no                   | until a newer 0.71.x ships | always                  |
| Registry request every run          | yes (metadata)       | yes (metadata)             | no                      |
| `minimumReleaseAge` / `trustPolicy` | checked on every run | checked on every run       | checked at install time |
| Cache lifetime                      | 24h                  | 24h                        | n/a                     |
| Needs `pnpm install`                | no                   | no                         | yes                     |
| Works outside the workspace         | yes                  | no (catalog error)         | no                      |
| oxfmt config used                   | current folder's     | current folder's           | current folder's        |

## The last row is the subtle one

All three use **the same config**. oxfmt finds `oxfmt.config.ts`, `.editorconfig` and `.gitignore` from the current
folder, not from wherever its binary lives. So `pnpx oxfmt` means "newest formatter + your repo's config", which is
exactly why its output looks plausible enough to slip through.

Bonus gotcha: `oxfmt.config.ts` contains `import { defineConfig } from "oxfmt"`. Node resolves that import from the
config file's folder, so it loads your **local 0.71.0**. Under `pnpx`, the formatter is 0.72 and the config helper is
0.71, both in the same process. That's harmless here because `defineConfig` just returns its input, but it's a reminder
that two versions can quietly coexist.

## Takeaway

- Inside a repo: `pnpm exec oxfmt`, or better, a `package.json` script.
- `pnpx` is for one-off tools you _don't_ have installed.
- `pnpx pkg@catalog:` is a handy middle ground, but it doesn't replace the lockfile.

_Tested with pnpm 11.10.0, oxfmt 0.71.0 / 0.72.0, Node 24.18._
