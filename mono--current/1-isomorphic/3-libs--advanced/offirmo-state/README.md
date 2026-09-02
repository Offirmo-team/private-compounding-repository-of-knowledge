XXX purely experimental

```ts
import { BaseUState } from "@monorepo-private/state-utils"

import { are_ustate_revision_requirements_met } from "@monorepo-private/state-utils"

import {
  BaseUState,
  BaseTState,
  BaseRootState,
  complete_or_cancel_eager_mutation_propagating_possible_child_mutation,
} from "@monorepo-private/state-utils"

import { getꓽmutable_copy } from "@monorepo-private/state-utils"
```

## Concepts

- State
- U, T states
- U+T bundle
- Root state

What we want to know?

- is this state up to date or legacy = check schema version
  - useful to know if the state should be migrated to most recent format (with a backup in case the migration has a pb)
- between those two states, which one should prevail?
  - = the most recently active? Not always, if the player played a lot offline and a tiny bit online on a different
    device, he's likely to want the one they spent most effort on
  - = the most up-to-date in terms of schema version? Not always, if the player played offline on an outdated version,
    they may still want the "most investment" one

- backups
  - chain of backups
  - protection against bad migrations
  - "oldest" in term of schema version
- reconciliation
  - most investment / "most effort spent" / "freshest"

Types of change

- user change
  - actual user action
  - NOT a migration
- system changes
  - migrations
  - time elapsed (with no user action)
  - shared state = guild update? ranking update? trade update (ex. successfully sold item)? TODO review

TODO review https://automerge.org/docs/quickstart/ TODO review "Conflict Free Replicated Data types (CRDTs)"
https://vlcn.io/blog/gentle-intro-to-crdts.html
