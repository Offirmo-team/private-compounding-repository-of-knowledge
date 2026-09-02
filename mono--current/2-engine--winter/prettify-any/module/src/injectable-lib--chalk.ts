import type { ChalkInstance } from "chalk"

// to make this lib isomorphic, we allow dependency injections
import { assert_from, assert } from "@monorepo-private/assert"

/////////////////////////////////////////////////
let _chalk: ChalkInstance | undefined = undefined

// chalk is not "winter CG" compatible (Cloudflare)
function injectꓽlibꓽchalk(chalk_lib: ChalkInstance) {
	assert(!!chalk_lib, `prettify-any: chalk injection should be used with the real lib!`)
	_chalk = chalk_lib
}

/////////////////////////////////////////////////

function getꓽlibꓽchalk(): ChalkInstance | undefined {
	return _chalk
}

/////////////////////////////////////////////////

export { injectꓽlibꓽchalk, getꓽlibꓽchalk }
