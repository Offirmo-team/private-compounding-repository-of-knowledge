UUID

TODO remove the monstrous dependency on crypto! or NOT USE nanoid!!

XXX uuid are not what we want! (esp. raw)

> UUID can be suboptimal for many use-cases because:
>
> - It isn't the most character efficient way of encoding 128 bits of randomness
> - UUID v1/v2 is impractical in many environments, as it requires access to a unique, stable MAC address
> - UUID v3/v5 requires a unique seed and produces randomly distributed IDs, which can cause fragmentation in many data
>   structures
> - UUID v4 provides no other information than randomness which can cause fragmentation in many data structures
>   https://github.com/ulid/spec

- Also see https://nitter.net/__steele/status/1570208081296134145
  - should be prefixed
  - should be layered
  - ULID Universally Unique Lexicographically Sortable Identifier

```js
import { UUID, generate_uuid } from "@monorepo-private/uuid"

generate_uuid() // "uu1I0D2MihtF1GK0MqE5VtfM"
```

See also:

```js
import { xxx_test_unrandomize_element } from '@tbrpg/definitions'

xxx_test_unrandomize_element(...)
```
