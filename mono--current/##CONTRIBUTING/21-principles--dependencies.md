Principles:

- as few dependencies as we can + as few transitive deps as we can
- as isomorphic as possible
- ESM if possible
- from "safe" authors if possible, ex. sindre
- if commonly used, wrap foreign modules into a thin, semantic layer so that we can swap them
- run the candidates through https://bundlephobia.com/ and https://npmx.dev/
-

Intentionally outdated dependencies:

- sharp: because fixed dep of parcelJS
- TypeScript because can't be called programmatically
- ~~(none at the moment 🥳)~~
