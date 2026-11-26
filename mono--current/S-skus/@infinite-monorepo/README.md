- https://www.npmjs.com/settings/infinite-monorepo/packages
- https://github.com/infinite-monorepo

## manifest.json5

```json5
{
  description: "Intelligently pretty-print a JS object (and by extension, JSON), on node or browser",
  _overrides: {
    dependencies: {
      chalk: { type: "optional" },
      "terminal-size": { type: "optional" },
    },
    files: {
      packageᐧjson: {
        "|source": ">DELETE<",
        "|exports|.": ">DELETE<",

        '|exports|./examples': "./module/src/__fixtures/examples.ts"
        '|exports|./examples/*': "./module/src/__fixtures/example--*/index.ts"

        '|exports|./authors/*': './module/src/l3-authors/*/index.ts',
        '|exports|./__shared-demos': './module/src/__shared-demos/index.ts',

        "scripts._start:parcel:main": "parcel serve module/*.html --port 1981 --lazy --no-autoinstall",

        'scripts.build': 'node --experimental-strip-types ./module/__build/bundle.ts',

        "|alias|@storybook/test": "./module/src/l3-compat/@storybook/test.ts",
      },
    },
  },
}
```

```ts
export interface PureModuleManifest extends Partial<PureModuleSpec> {
  _dontꓽpresent?: boolean // unsupported module, don't "present" it TODO remove once all the modules are compatible!

  _overrides?: {
    // ignore = currently use to allow using optional "cross-cutting" libs
    // which may not be available if resurrecting bolt workspace 1-by-1
    // thus should not appear in package.json
    dependencies: Record<string, DependencyDetails | "ignore">

    files: {
      packageᐧjson?: { [path: string]: any }
      // TODO 1D tsconfig.json and other
    }
  }
}
```

##
