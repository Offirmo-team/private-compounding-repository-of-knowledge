## spawn-correctly

Spawn'ing a process correctly is surprisingly tricky. This module should cover everything:

- all stdio streams errors
- all exit/error events
- all possible errors
- rejects with a fully decorated error and a meaningful message
- uses [cross-spawn](https://github.com/moxystudio/node-cross-spawn/)
- passes arguments safely -- with caveats, see [Security](#security)

## Usage

```ts
import ೱspawnCorrectlyAndResolvesWithStdout from "@monorepo-private/spawn-correctly"

const result = await ೱspawnCorrectlyAndResolvesWithStdout({
  // same arg as [spawn](https://devdocs.io/node~18_lts/child_process#child_processspawncommand-args-options)
  spawnCommand: "./node_modules/.bin/tsc",
  spawnArgs: ["--version"],
  //spawnOptions: {...}
})

console.log(result) // Version 5.2.2
```

### Advanced

```ts
import { ೱspawnCorrectly, SpawnError, ChildProcess } from "./index.ts"
// TODO (see unit tests)
```

## Security

`spawnCommand` and `spawnArgs` are handed over as a command **plus an array**, never concatenated into a shell string.
No shell parses them, so nothing inside an argument can be reinterpreted as shell syntax -- no quoting or escaping
needed on your side. That is the safe default, and it holds as long as you don't opt out of it:

**Never combine `spawnOptions: { shell: true }` with untrusted `spawnArgs`.** `shell: true` makes `cross-spawn` skip its
escaping entirely and hand the arguments straight to `/bin/sh -c`, where any argument content becomes shell code.
Nothing here validates `spawnOptions`, because this is inherent to Node's own `child_process` API: asking for a shell is
always the caller's call, and their problem.

**On Windows, the array is not the whole story.** For any command that isn't `.com`/`.exe` -- which includes every
`node_modules/.bin/*.cmd` shim, ie. the `tsc` example above -- `cross-spawn` _does_ build a single `cmd.exe` command
line, and sets `windowsVerbatimArguments` to turn Node's own quoting off. Safety there rests on `cross-spawn`'s escaping
rather than on argument separation, so keep it current: that escaping has already needed one ReDoS hardening fix
([upstream PR #160](https://github.com/moxystudio/node-cross-spawn/pull/160), present in the 7.0.6 we ship).

## credits

https://stackoverflow.com/questions/48698234/node-js-spawn-vs-execute

I had a look at the features of https://github.com/jamiebuilds/spawndamnit
