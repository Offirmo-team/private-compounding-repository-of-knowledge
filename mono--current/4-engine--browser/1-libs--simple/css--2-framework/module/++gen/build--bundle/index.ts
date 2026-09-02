/* https://lightningcss.dev/bundling.html
 */

import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

import { bundleAsync } from "lightningcss"

/////////////////////////////////////////////////
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const filenameⵧinput = path.join(__dirname, "../../src/index.css")
const filenameⵧoutput = path.join(__dirname, "../../../public/index.css")

/////////////////////////////////////////////////
const DEBUG = false

console.log("BUNDLING")
console.log({ filenameⵧinput, filenameⵧoutput })

let { code, map } = await bundleAsync({
	filename: filenameⵧinput,
	minify: true,
	//errorRecovery: true,
	// todo targets: browserslistToTargets(browserslist('>= 0.25%'))
	resolver: {
		read(filePath) {
			DEBUG && console.log(`Reading "${filePath}"`)
			if (filePath.endsWith(`@monorepo-private/css--foundation`))
				filePath = path.join(__dirname, "../../../css--foundation/public/index.css")

			return fs.readFileSync(filePath, "utf8")
		},
		resolve(specifier, from) {
			DEBUG && console.log(`Resolving`, { specifier, from })
			return path.resolve(path.dirname(from), specifier)
		},
	},
})

DEBUG && console.log({ code, map })

fs.writeFileSync(filenameⵧoutput, code, { encoding: "utf8" })
