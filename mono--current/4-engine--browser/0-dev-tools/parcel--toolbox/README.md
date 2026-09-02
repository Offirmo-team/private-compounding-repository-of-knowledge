### Explanation

- `"process": "^0"`
  - seen requested upon parcel error 2025/04

```
@parcel/resolver-default: ENOENT: no such file or directory, stat
'~/work/src/off/offirmo-monorepo/stack--current/3-engine--browser/0-dev-tools/parcel--toolbox/node_modules/process'
```

- `"sharp": "^0.31"`
  - needed by image manipulation
  - seen requested upon parcel error 2025/04

```
@parcel/resolver-default: ENOENT: no such file or directory, stat
'~/work/src/off/offirmo-monorepo/stack--current/3-engine--browser/0-dev-tools/parcel--toolbox/node_modules/sharp'
```

- `"parcel-resolver-ignore": "^2",`
  - https://github.com/parcel-bundler/parcel/issues/7064
- `"@parcel/service-worker": "^2"`
  - https://parceljs.org/languages/javascript/#service-workers

## Tosort

- `"@parcel/reporter-bundle-analyzer": "^2"`
  - for https://parceljs.org/features/production/#bundle-analyzer
- `"@monorepo-private/parcel-resolver": "*"`
  - this monorepo custom resolver for hacks
- `"@parcel/config-default": "^2"`
  - no need, transitively installed by `@monorepo-private/parcel-config`

- `"@parcel/core": "^2"`
  - was it needed at some point?
