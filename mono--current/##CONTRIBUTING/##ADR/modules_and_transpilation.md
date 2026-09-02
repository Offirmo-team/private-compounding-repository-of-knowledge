# JS modules export and transpilation policy

## Policy

The public modules in this monorepo ase exposed as:

- Latest stable ES, with latest stable module exports
  - with sometimes a few stage 4 features when they are already widely supported https://github.com/tc39/ecma262
  - instructions [here](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) and
    [here](https://www.typescriptlang.org/docs/handbook/esm-node.html)
- as a convenience, pre-built CJS for latest ES (https://node.green/) supported by the oldest active LTS node
  (https://nodejs.org/en/about/previous-releases or https://github.com/nodejs/Release)
- for modules in TypeScript, trying to use the latest TypeScript, best effort.
- while webpack is not used in this repo(\*), we acknowledge that it's widely used and thus aim to support its latest
  version

See below more exact numbers.

Note: I do NOT agree with the opinion "don't transpile node_modules", see [issue](<>)

## Technical details

### PENDING updates

- [ ] 🆙 2026-10-20 oldest active LTS node 24 → 26 https://github.com/nodejs/release#release-schedule
- [ ] 🆙 mid 2026 [ES2026](https://en.wikipedia.org/wiki/ECMAScript_version_history)
- [ ] 🆙 TypeScript [announcements](https://devblogs.microsoft.com/typescript/)
- ~~[ ] 🆙 webpack release 5 → 6 https://github.com/webpack/webpack/milestones https://webpack.js.org/blog/~~ dead

ES reasonably supported https://philipwalton.com/articles/the-state-of-es5-on-the-web/ new target env: workerd
https://blog.cloudflare.com/more-npm-packages-on-cloudflare-workers-combining-polyfills-and-native-code/

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

## Maintainer playbook

- when updating this file, also update `0-scripts/build-typescript.js`
- when updating node/lib, also update
  - `.nvmrc`
  - `engines` from root `package.json` = `"node":`
  - `"@types/node"`
  - `tsconfig.json`: `"lib":`
  - replace in `package.json`: `src.es202x`
  - `B-apps--support/online-adventur.es/heroku/.babelrc`
  - `B-apps--support/online-adventur.es/functions/.babelrc`
  - Netlify:
    - ensure AWS_LAMBDA_JS_RUNTIME = "nodejsXX.x" is valid in `netlify.toml`
    - in admin change AWS_LAMBDA_JS_RUNTIME = nodeXX.x or sth
  - sibling repos
    - adjust `.nvmrc` and `netlify.toml` in online-adventures.github.io
