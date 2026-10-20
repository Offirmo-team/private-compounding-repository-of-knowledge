A simple polling utility, sometimes there is no other way...

Resolves with the first truthy value returned by the predicate. Rejects on timeout, or as soon as the predicate throws.

default options:

- periodMs: 100, // check every 100ms
- timeoutMs: 10 \* 1000, // after 10 seconds, timeout
- debugId: 'an unnamed predicate',

Usage:

```ts
import { poll } from "@monorepo-private/poll"

const user_metadata = await poll(() => auth.user?.user_metadata, {
  timeoutMs: 30 * 1000,
  debugId: "user metadata",
})
console.log("got metadata…", user_metadata)
```
