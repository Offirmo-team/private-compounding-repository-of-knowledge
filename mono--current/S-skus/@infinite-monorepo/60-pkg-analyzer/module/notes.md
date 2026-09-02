```
// node --experimental-strip-types ./X-spikes/parse-import-ts/index.mjs

  _overrides: {
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
