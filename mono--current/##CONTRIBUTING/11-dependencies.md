Principles:

- as few dependencies as we can + as few transitive deps as we can
- as isomorphic as possible
- ESM if possible
- from "safe" authors if possible, ex. sindre
- if commonly used, wrap foreign modules into a thin, semantic layer so that we can swap them
- run the candidates through https://bundlephobia.com/

Intentionally outdated dependencies:

- sharp: because fixed dep of parcelJS
- ~~(none at the moment 🥳)~~
