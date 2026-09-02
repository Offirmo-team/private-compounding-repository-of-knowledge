## Concepts

https://parceljs.org/plugin-system/configuration/#shared-configuration

IMPORTANT: some of the config HAS to be in package.json, also in the monorepo ROOT, not the immediate package 🤦‍♂️

## Plugins

### core plugins

Parcel requires the plugins from "@parcel/config-default" to be added as dependencies when our setup actually uses them.

Added so far:

- `@parcel/transformer-webmanifest`
- `@parcel/packager-raw-url` for "\*.{jsonld,svg,webmanifest}"

### extra plugins

- Globs: `@parcel/resolver-glob` https://parceljs.org/features/dependency-resolution/#glob-specifiers

### 3rd party plugins

Own plugin to solve this issue https://github.com/parcel-bundler/parcel/issues/7823#issuecomment-1826123439

- tried "parcel-resolver-typescript-esm", but it's not working
  https://www.npmjs.com/package/parcel-resolver-typescript-esm

## Config

Added support for exports https://parceljs.org/features/dependency-resolution/#package-exports

## Common issues

### Common troubleshooting

- XXX all packages and sub-packages must have a `.parcelrc`!
- Check our custom config and remove everything unsure
- use parcel--check

### globs not working

solved by "common troubleshooting"

### At launch: ENOENT: no such file or directory, open '(...)/node_modules/@parcel/runtime-browser-hmr/lib/runtime-861bbfc0e96a0020.js'

[Known bug 😢](https://github.com/parcel-bundler/parcel/issues/8181)

May be solved by "common troubleshooting", or use `--no-hmr`

## tosort

Doesn't work, bugs on unit tests and many other places.

```json
"validators": {
  "*.{ts,tsx}": ["@parcel/validator-typescript"]
}
```

Doesn't bring anything

```json
"transformers": {
  "*.{ts,tsx}": [ "@parcel/transformer-typescript-tsc" ]
},
```

??? "@parcel/packager-ts": "^2", "@parcel/packager-xml": "^2", "@parcel/transformer-typescript-types": "^2",
"@parcel/transformer-xml": "^2",

"\*.{zip,tgz}": ["@parcel/transformer-raw"]
