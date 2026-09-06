## package manager

**pnpm**, killing features:

- catalogs
- plenty of others

Why not npm?

- last try 2022/03 npm ^8
- (blocker) npm output spurious "timing" lines blotting the output
- npm requires "run" `npm run dev`
- overall npm doesn't seem as reliable as yarn

Why not yarn? https://yarnpkg.com/blog/bun https://github.com/yarnpkg/berry

- as of 2026 pnpm outpaced it in terms of features and is the de-facto standard

## monorepo

**pnpm + turborepo**

- maybe complemented by https://github.com/Thinkmill/manypkg

Why not yarn workspaces?

- they can't run commands in the dependency order (TODO reevaluate with turborepo)
- they can't run commands on a glob (TODO reevaluate TODO reevaluate with turborepo)

Why not rush? https://github.com/pnpm/pnpm

- has benefits = many features
- real experience: bugs, missing confidence

Why not bolt?

- too many missing features from pnpm

Why not X?

- TODO evaluate https://nx.dev/
- TODO evaluate lerna recent versions

## isomorphic

TypeScript

- TODO evaluate https://blog.logrocket.com/boost-your-productivity-with-typescript-project-references/
- TODO evaluate [self referencing in Typescript](https://www.typescriptlang.org/docs/handbook/esm-node.html) when
  [bug fix](https://github.com/microsoft/TypeScript/issues/46762)

## web bundler / compiler

Vite https://parceljs.org/

Why Parcel?

- simplest, does everything
- BUT 2024 "@parcel/package-manager: ES module dependencies are experimental.
- BUT 2024 many bugs: import from html, ts resolver (mitigated)

White not Vite?

- re-evaluating 2026/04 Vite 8
  - rolldown, doesn't seem to have the issue ~~rollup (embedded) has trouble with default exports
    https://stackoverflow.com/questions/58246998/mixing-default-and-named-exports-with-rollup~~
  - fixable with our custom Parcel resolver ~~CSS resolver can't resolve from packages npm:xyz~~
  - to check? needs a "main" in package.json
  - 🔄 has a "root" preventing from serving files upper in the monorepo
    - 🔄 not as flexible with globs out of the root
- evaluated 2024/01 Vite 5 ~works but not as good as Parcel:
  - rollup (embedded) has trouble with default exports
    https://stackoverflow.com/questions/58246998/mixing-default-and-named-exports-with-rollup
  - CSS resolver can't resolve from packages npm:xyz
  - needs a "main" in package.json
  - has a "root" preventing from serving files upper in the monorepo

TODO re-evaluate vite https://blog.logto.io/parcel-to-vite TODO evaluate Rpack https://rspack.dev/

## linting

TODO re-evaluate ESLint https://eslint.org/blog/2024/07/whats-coming-next-for-eslint/
https://eslint.org/blog/2024/10/eslint-json-markdown-support/

TODO evaluate https://biomejs.dev/

## environment manager

mise / corepack

https://github.com/1111mp/nvmd-command

- TODO evaluate https://asdf-vm.com/
- TODO evaluate https://github.com/Schniz/fnm
- TODO evaluate https://www.honeybadger.io/blog/node-environment-managers/
- TODO evaluate https://docs.volta.sh/guide/understanding
- TODO evaluate https://asdf-vm.com/guide/introduction.html#nvm-n-rbenv-etc

```
12. Which version manager do you use?
none
nvm
n
asdf
fnm
nodenv
nvs
volta
Other (please specify)
```

## database

### PostGresQL

### libSQL

https://libsql.org/about

### Query builder and ORM

knex

TODO evaluate prisma TODO evaluate https://docs.turso.tech/3p-dev-tools TODO evaluate
https://github.com/drizzle-team/drizzle-orm#readme

### migration

TODO evaluate https://atlasgo.io/ TODO evaluate https://flywaydb.org/ TODO evaluate
https://github.com/golang-migrate/migrate

### misc

## Misc / new

https://github.com/capricorn86/happy-dom

TODO evaluate edge DB https://atlasgo.io/guides/sqlite/turso TODO evaluate neon db
https://clerk.com/blog/automate-neon-schema-changes-with-drizzle-and-github-actions

https://github.com/folke/ultra-runner

### workflow

- TODO evaluate https://www.npmjs.com/package/@atlaskit/build-releases
- TODO evaluate https://yarnpkg.com/features/release-workflow
- TODO evaluate changesets https://www.totaltypescript.com/how-to-create-an-npm-package

TODO https://knip.dev/
