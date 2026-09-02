# My private monorepo

## Contributing

This repo uses pnpm and mise. ONLY use `pnpm` and `pnpx`, no other variants.

See [##CONTRIBUTING](%23%23CONTRIBUTING) for generic instructions.

### IMPORTANT

Every package in this monorepo follow a precise structure:

1. the code is in a `module/` subfolder
2. all the root files (package.json, tsconfig...) are auto-generated with a home-made tool
  - NO need to edit those files. When using dependencies, just "import" them in the code and the tool will auto-detect
    and add the dependencies to package.json
3. the tool sometimes pre-emptively add dependencies such as testing tools, even when no test already exist. This is to
   remove friction and encourage writing tests.

Hence NO NEED to call pnpm yourself, just write code then ask the user to run the tool which will:

1. update the root files
2. install the new deps

## Credits and Hat tips

Credits:

- Adriano Emerick "Mobile Security" icon https://thenounproject.com/search/?q=security mobile&i=153136
- José Hernandez "Weight" icon https://thenounproject.com/search/?q=weight&i=9409

Tools

- Color converter https://www.cssportal.com/css-color-converter/
- favicon https://realfavicongenerator.net/
- https://github.com/scottsidwell/bundle-inspector
