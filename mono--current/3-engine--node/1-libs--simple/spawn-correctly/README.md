## spawn-correctly

Spawn'ing a process correctly is surprisingly tricky. This module should cover everything:

- all stdio streams errors
- all exit/error events
- all possible errors
- rejects with a fully decorated error and a meaningful message
- uses [cross-spawn](https://github.com/moxystudio/node-cross-spawn/)

## Usage

```ts
import spawnCorrectlyAndResolvesWithStdout from "@monorepo-private/spawn-correctly"

const result = await spawnCorrectlyAndResolvesWithStdout({
  // same arg as [spawn](https://devdocs.io/node~18_lts/child_process#child_processspawncommand-args-options)
  spawnCommand: "./node_modules/.bin/tsc",
  spawnArgs: ["--version"],
  //spawnOptions: {...}
})

console.log(result) // Version 5.2.2
```

### Advanced

```ts
import { spawnCorrectly, SpawnError, ChildProcess } from "./index.ts"
// TODO (see unit tests)
```

## credits

https://stackoverflow.com/questions/48698234/node-js-spawn-vs-execute

I had a look at the features of https://github.com/jamiebuilds/spawndamnit
