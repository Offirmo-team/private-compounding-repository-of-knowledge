import * as path from "node:path"
import { fileURLToPath } from "node:url"

/////////////////////////////////////////////////

const __dirname = path.dirname(fileURLToPath(import.meta.url))
//console.log({ __dirname })

import { getꓽpackage_details } from "../src/index.ts"

const result = await getꓽpackage_details(__dirname + "/../../../../../1-stdlib/timestamps/module", {
	indent: "   ",
})
console.log(result)
