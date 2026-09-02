## tiny Typescript wrapper around [murmurhash3js-revisited](https://github.com/cimi/murmurhash3js-revisited)

# THIS HASH ALGO IS **_NON-CRYPTOGRAPHIC_**!!

## Usage

```ts
import MurmurHash from "@monorepo-private/murmurhash"

const result = MurmurHash.v3.x64ⵧ128.hashꓽstring(str)
const result = MurmurHash.v3.x64ⵧ128.hashꓽobject(x) // includes stable stringification
```

See also https://opensource.googleblog.com/2014/03/introducing-farmhash.html
