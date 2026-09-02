## Usage (dev commands)

### normal module dev

Now that all modules are built (required), you can move into an **individual** module:

```bash
## this will trigger watch build of the compatible cjs version, which works in all envs
yarn dev

yarn test
```

Note than modifying a module's source most likely requires a build for it to take effect. Be aware of the dependencies.

### build/test only a subset

For ex. to make everything work again step by step!

TODO auto-generate this list!!

```bash
pnpx turbo check
  pnpx turbo check --filter="./0-meta/*"
  pnpx turbo check --filter="./1-isomorphic/**"
    pnpx turbo check --filter="./1-isomorphic/1-libs--simple/*"
    pnpx turbo check --filter="./1-isomorphic/2-libs--cross-cutting/*"
    pnpx turbo check --filter="./1-isomorphic/3-libs--advanced/*"
  pnpx turbo check --filter="./2-engine--winter/**"
  pnpx turbo check --filter="./3-engine--node/**"
  pnpx turbo check --filter="./4-engine--browser/**"
  pnpx turbo check --filter="./7-multimorphic/**"
  pnpx turbo check --filter="./B-backend/**"
  pnpx turbo check --filter="./S-skus/**"





bolt --only-fs "[0-9]-*/**/*" ws run check
  bolt --only-fs "0-meta/**/*" ws run check
    bolt --only-fs "0-meta/0-dev-tools/*" ws run check
    bolt --only-fs "0-meta/X-to-reorganize/*" ws run check
  bolt --only-fs "1-isomorphi*/**/*" ws run check
    bolt --only-fs "1-isomorphic/1-libs--simple/*" ws run check
    bolt --only-fs "1-isomorphic/2-libs--cross-cutting/*" ws run check
    bolt --only-fs "1-isomorphic/3-libs--advanced/*" ws run check
    bolt --only-fs "1-isomorphic/X-incubator/active/*" ws run check
  bolt --only-fs "2-engine--winte*/**/*" ws run check
  bolt --only-fs "3-engine--nod*/**/*" ws run check
    bolt --only-fs "3-engine--node/0-dev-tools/*" ws run check
    bolt --only-fs "3-engine--node/1-libs--simple/*" ws run check
    bolt --only-fs "3-engine--node/2-libs--cross-cutting/*" ws run check
  bolt --only-fs "4-engine--browse*/**/*" ws run check
    bolt --only-fs "4-engine--browser/0-dev-tools/*" ws run check
    bolt --only-fs "4-engine--browser/1-libs--simple/*" ws run check
    bolt --only-fs "4-engine--browser/2-libs--cross-cutting/*" ws run check
    bolt --only-fs "4-engine--browser/X-incubator/active/*" ws run check
  bolt --only-fs "7-multimorphi*/**/*" ws run check
    bolt --only-fs "7-multimorphic/@oh-my-rpg/*" ws run check

  bolt --only-fs "B-backend/*" ws run check
  bolt --only-fs "C-fina*/**/*" ws run check
    bolt --only-fs "S-skus/@infinite-monorepo/*" ws run check
    bolt --only-fs "S-skus/@tbrp*/**/*" ws run check
      bolt --only-fs "S-skus/@tbrpg/1-logic/l1*" ws run check
      bolt --only-fs "S-skus/@tbrpg/1-logic/l2*" ws run check
      bolt --only-fs "S-skus/@tbrpg/1-logic/l3*" ws run check
      bolt --only-fs "S-skus/@tbrpg/1-logic/l4*" ws run check
      bolt --only-fs "S-skus/@tbrpg/1-logic/l5*" ws run check
      bolt --only-fs "S-skus/@tbrpg/1-logic/l6*" ws run check

## Alt:
bolt --only @infinite-monorepo/* ws run check
bolt --only @oh-my-rpg/* ws run check
bolt --only-fs "A-apps--core/**/*" ws run check
bolt --only-fs "B-apps--support/**/*" ws run check
bolt --only-fs "C-apps--clients/**/*" ws run check
bolt w @tbrpg/definitions run build
bolt ws run check --only @monorepo-private/*

## misc:
bolt ws run cheatsheet
bolt ws run cheatsheet --only @monorepo-private/*
bolt ws run cheatsheet --only @oh-my-rpg/*
bolt --only-fs "1-stdlib/*" ws run ensure-size
```

## clean

```bash
bolt clean-deps

bolt clean
# equivalent to:
#  bolt ws run clean
#  bolt ws exec -- rm -rf .cache .parcel dist node_modules yarn.lock package-lock.json yarn-error.log
```

## updates dependencies (minor + patch)

```bash
nvm i
onn
bolt clean && rm -rf node_modules yarn.lock package-lock.json && bolt && yarn outdated
##yarn eslint:packages --fix
npx update-browserslist-db@latest # cf. https://github.com/browserslist/browserslist#browsers-data-updating
npx yarn-deduplicate --list
```

## serve for dev

```bash
ngrok http -subdomain=offirmo 1981
yarn serve
```

## publish a package

```bash
npm adduser
user: offirmo
email: offirmo.net@gmail.com
npm publish
npm publish --access public
```

## tosort

### tabset

yellow FDEE00
