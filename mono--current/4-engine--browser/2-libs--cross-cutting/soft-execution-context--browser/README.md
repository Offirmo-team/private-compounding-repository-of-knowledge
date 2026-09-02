```ts
import {
  listenToErrorEvents,
  listenToUnhandledRejections,
  decorateWithDetectedEnv,
  getRootSXC,
} from "@monorepo-private/soft-execution-context--browser"
listenToUncaughtErrors()
listenToUnhandledRejections()
decorateWithDetectedEnv()

import { getLogger } from "@monorepo-private/universal-debug-api--browser"
getRootSXC().injectDependencies({ logger: getLogger({ suggestedLevel: "silly" }) })
```

Extra injections:

- bowser results
