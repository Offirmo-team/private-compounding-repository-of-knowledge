// Wire all mocha+chai+plugins together

import "mocha"
// expose some global variables as convenience
import "chai/register-expect.js"
import * as sinon from "sinon"
globalThis.sinon = sinon

// activate chai extensions
import * as chai from "chai"
import * as chai_as_promised from "chai-as-promised"
import * as chai_moment from "chai-moment"
import * as sinon_chai from "sinon-chai"
chai.use(chai_as_promised.default) // order is important: https://github.com/prodatakey/dirty-chai#use-with-chai-as-promised
chai.use(sinon_chai.default)
//chai.use(chai_subset.default) no longer needed https://github.com/chaijs/chai/pull/1664
chai.use(chai_moment.default)
try {
	const chai_fetch_mock = await import("chai-fetch-mock")
	try {
		chai.use(chai_fetch_mock.default) // order is important https://github.com/gakimball/chai-fetch-mock/issues/3#issuecomment-696493670
	} catch (err) {
		console.error(`[from @monorepo-private/toolbox--unit-tests] error while activating chai-fetch-mock`, err)
	}
} catch (e) {
	/* ignore */
}

// Special Offirmo init, won't do anything if not found
/*
try {
	await import("./offirmo-advanced-init--node.mjs")
} catch (err) {
	// this is rare stuff, silently ignore
}
 */

// convenience
import * as path from "node:path"
console.log(
	`* Starting tests for "${path.basename(process.cwd())}"... [powered by @monorepo-private/toolbox--unit-tests]`,
)
