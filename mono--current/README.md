# My private monorepo

## Contributing

This repo uses pnpm and mise. ONLY use `pnpm` and `pnpx`, no other variants.

See [##CONTRIBUTING](%23%23CONTRIBUTING) for generic instructions.

### IMPORTANT

Every package in this monorepo follows a precise structure:

1. the code is in a `module/` subfolder
2. all the root files (package.json, tsconfig...) are auto-generated with a home-made tool
   - NO need to edit those files
   - When using dependencies, just "import" them in the code, and the tool will auto-detect and add the dependencies to
     package.json on its next run
   - the tool pre-emptively adds some dev dependencies, such as testing tools, even when no test already exists. This is
     to remove friction and encourage writing tests and assertions (Design Driven Dev).
   - Hence, NO NEED to call pnpm yourself, write code then ask the user to run the tool which will:
     1. update the root files
     2. install the new deps

## Notes

1. `git diff --staged --patch --binary > ~/work/tmp/otpcrk.patch`
1. `git apply --3way ~/work/tmp/otpcrk.patch`
1. `node ./scripts/cleanup-empty-dirs.ts`
1. `bash ./scripts/check-forbidden-keywords.bash`
1. `git fetch && git pull --recurse-submodules --rebase --autostash`
