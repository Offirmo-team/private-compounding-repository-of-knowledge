Why chalk should be injected???

```ts
// "@monorepo-private/prettify-any": "*",
import chalk from "chalk"
import { injectꓽlibꓽchalk, prettifyꓽany, prettifyꓽjson } from "@monorepo-private/prettify-any"

injectꓽlibꓽchalk(chalk)

prettifyꓽjson(foo)
prettifyꓽjson({ foo }, { outline: true })

import { dumpꓽanyⵧprettified } from "@monorepo-private/prettify-any"

dumpꓽanyⵧprettified("hello", { foo }, { outline: true })
```

https://www.json.org/json-en.html https://thecodebarbarian.com/the-80-20-guide-to-json-stringify-in-javascript

Note: was formerly using prettyjson and got inspired by it. "prettyjson": "^1" "@types/prettyjson": "^0.0.30",

TODO review https://github.com/jestjs/jest/tree/main/packages/pretty-format https://www.npmjs.com/package/pretty-format
TODO review https://www.npmjs.com/package/@parischap/pretty-print
