# Modules export and transpilation policy

## Policy

The modules in this monorepo are designed to run in/for:

- engines:
  - browsers (see [.browserslistrc](../../.browserslistrc))
  - node.js LTS
  - CloudFlare workerd
    https://blog.cloudflare.com/more-npm-packages-on-cloudflare-workers-combining-polyfills-and-native-code/
  - WinterCG
- bundlers:
  - vite
  - parcel 2
  - ~~webpack~~ considered legacy

The modules in this repo make those technical choices:

- written in TypeScript
  - trying to use the latest TypeScript, best effort.
  - compatible with type stripping
- Latest stable ECMAScript _ONLY_, with latest stable module exports
  - with sometimes a few stage 4 features when they are already widely supported https://github.com/tc39/ecma262
  - instructions [here](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) and
    [here](https://www.typescriptlang.org/docs/handbook/esm-node.html)

When published, the public modules (in this repo) follow those conventions:

- ~~expose pre-built CJS~~ considered legacy

## Maintainer playbook

- when updating this file, also update
  [known versions](../../S-skus/%40infinite-monorepo/01-known-versions/module/src/index.ts)
- when updating node/lib, also update
  - `.nvmrc` `mise`
  - `tsconfig.json`: `"lib":`
  - (automated through @infinite-monorepo)
    - `engines` from root `package.json` = `"node":`
    - `"@types/node"`
  - `B-apps--support/online-adventur.es/heroku/.babelrc`
  - `B-apps--support/online-adventur.es/functions/.babelrc`
  - Netlify:
    - ensure AWS_LAMBDA_JS_RUNTIME = "nodejsXX.x" is valid in `netlify.toml`
    - in admin change AWS_LAMBDA_JS_RUNTIME = nodeXX.x or sth
  - sibling repos
    - adjust `.nvmrc` and `netlify.toml` in online-adventures.github.io

## Exact versions

### PENDING updates

- [ ] 🆙 2026-10-20 oldest active LTS node 24 → 26 https://github.com/nodejs/release#release-schedule
- [ ] 🆙 mid 2027 [ES2027](https://en.wikipedia.org/wiki/ECMAScript_version_history)
- [ ] 🆙 TypeScript 8 [announcements](https://devblogs.microsoft.com/typescript/)

### update 2026-09-03 (no change)

🆕 https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/

Updated state:

1. Node runtime version

- oldest _active_ LTS node = [24](https://nodejs.org/en/about/previous-releases)
- SaaS providers: most recent node supported by…
  - 🆕AWS lambda = [26](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)
  - Vercel = [24](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- killer features after LTS?
  - localStorage/sessionStorage ?

⭆ latest supported node = 24 (if updated, search for "engines", "@types/node", "update marker")

2. ECMAScript version

- 🆕latest ES = [ES2026](https://en.wikipedia.org/wiki/ECMAScript_version_history) +
  [latest spec](https://262.ecma-international.org/17.0/)
- latest ES _reasonably_ supported by above node LTS (latest minor) = [ES2025](https://node.green/#ES2025)
- latest ES supported by TypeScript as a target = [2025](https://www.typescriptlang.org/tsconfig#target)
  [code](https://github.com/microsoft/TypeScript/blob/main/packages/typescript/src/enums/scriptTarget.ts)
- latest ES supported by TypeScript as a lib =
  [2025](https://github.com/microsoft/TypeScript/tree/main/tsc/internal/bundled/libs)
- latest ES reasonably supported by browsers or polyfills =
  ~[ES2025](https://compat-table.github.io/compat-table/es2016plus/)

⭆ latest convenient ES = 2025 (if changed, need search&replace in package.json, search for "es2024" and "update marker")

3. ES module

- we consider webpack outdated and are no longer taking into account its limitations
- we consider the ecosystem advanced enough to move to full ESM
  https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#how-can-i-move-my-commonjs-project-to-esm

⭆ latest convenient module = ES (module = 2022 in TypeScript)

### update 2026-03-27 (no change)

🆕 https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/

Updated state:

1. Node runtime version

- oldest _active_ LTS node = [24](https://nodejs.org/en/about/previous-releases)
- SaaS providers: most recent node supported by…
  - AWS lambda = [24](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)
  - Vercel = [24](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- killer features after LTS?
  - localStorage/sessionStorage ?

⭆ latest supported node = 24 (if updated, search for "engines", "@types/node", "update marker")

2. ECMAScript version

- latest ES = [ES2025](https://en.wikipedia.org/wiki/ECMAScript_version_history) +
  [latest spec](https://262.ecma-international.org/16.0/)
- latest ES _reasonably_ supported by above node LTS (latest minor) = [ES2025](https://node.green/#ES2025)
- latest ES supported by TypeScript as a target = [2025](https://www.typescriptlang.org/tsconfig#target)
  [code](https://github.com/microsoft/TypeScript/blob/main/src/server/protocol.ts#L3297)
- latest ES supported by TypeScript as a lib = [2025](https://github.com/microsoft/TypeScript/tree/main/src/lib)
- latest ES reasonably supported by browsers or polyfills =
  ~[ES2025](https://compat-table.github.io/compat-table/es2016plus/)

⭆ latest convenient ES = 2025 (if changed, need search&replace in package.json, search for "es2024" and "update marker")

3. ES module

- we consider webpack outdated and are no longer taking into account its limitations
- we consider the ecosystem advanced enough to move to full ESM
  https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#how-can-i-move-my-commonjs-project-to-esm

⭆ latest convenient module = ES (module = 2022 in TypeScript)

### update 2026-02-08

Updated state:

1. Node runtime version

- oldest _active_ LTS node = [24](https://nodejs.org/en/about/previous-releases)
- SaaS providers: most recent node supported by…
  - AWS lambda = [24](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)
  - 🆕 Vercel = [24](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- KILLER FEATURE = no longer transpile, auto-strip typescript
  - introduced in node 23 but backported in node 22.18 ✅ https://github.com/nodejs/node/releases/tag/v22.18.0
  - need TS >5.7 https://devblogs.microsoft.com/typescript/announcing-typescript-5-7/#path-rewriting-for-relative-paths

⭆ 🆕 latest supported node = 24 (if updated, search for "engines" and "@types/node")

2. ECMAScript version

- latest ES = [ES2025](https://en.wikipedia.org/wiki/ECMAScript_version_history) +
  [latest spec](https://262.ecma-international.org/16.0/)
- latest ES _reasonably_ supported by above node LTS (latest minor) = [ES2025](https://node.green/#ES2025)
- latest ES supported by TypeScript as a target = [2025](https://www.typescriptlang.org/tsconfig#target)
  [code](https://github.com/microsoft/TypeScript/blob/main/src/server/protocol.ts#L3297)
- 🆕 latest ES supported by TypeScript as a lib = [2025](https://github.com/microsoft/TypeScript/tree/main/src/lib)
- latest ES reasonably supported by browsers or polyfills =
  ~[ES2025](https://compat-table.github.io/compat-table/es2016plus/)

⭆ 🆕 latest convenient ES = 2025 (if changed, need search&replace in package.json, search for "es2024" and "update
marker")

3. ES module

- we consider webpack outdated and are no longer taking into account its limitations
- we consider the ecosystem advanced enough to move to full ESM
  https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#how-can-i-move-my-commonjs-project-to-esm

⭆ latest convenient module = ES (module = 2022 in TypeScript)

Also:

- [x] TS supports importing .ts AND transpiles to .js
- [x] TS has working support of [self referencing](https://www.typescriptlang.org/docs/handbook/esm-node.html) when
      [bug fix](https://github.com/microsoft/TypeScript/issues/46762) = update unit tests!

### Older updates

See [modules_and_transpilation.md](../%7E%7Ehistory/modules_and_transpilation.md)
