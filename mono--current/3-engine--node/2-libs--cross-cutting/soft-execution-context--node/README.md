```ts
import {
  listenToUncaughtErrors,
  listenToUnhandledRejections,
  decorateWithDetectedEnv,
  getRootSXC,
} from "@monorepo-private/soft-execution-context--node"
listenToUncaughtErrors()
listenToUnhandledRejections()
decorateWithDetectedEnv()

import { getLogger } from "@monorepo-private/universal-debug-api--node"
getRootSXC().injectDependencies({ logger: getLogger({ suggestedLevel: "silly" }) })
```

https://thecodebarbarian.com/unhandled-promise-rejections-in-node.js.html

TODO integrate with async hooks? https://itnext.io/nodejs-logging-made-right-117a19e8b4ce
