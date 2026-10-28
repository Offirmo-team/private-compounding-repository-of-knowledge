**trivial** deep freeze, replacing `icepick.freeze()`:

assumptions:

- POD (what we mostly use in this monorepo)

Behavior:

- recursively `Object.freeze()` every object reachable through own enumerable properties
- already-frozen objects are assumed deep-frozen and skipped
  - = cheap re-freeze of persistent/immutable structures + safe on reference cycles
  - gotcha: a shallow-frozen (`Object.freeze()`) object with mutable children stays partially mutable
- inherent `Object.freeze()` limitations:
  - Map / Set / Date internal state is NOT frozen
  - typed arrays with elements can't be frozen = throws

```ts
import { freezeⵧdeep } from "@monorepo-private/freeze"
```
