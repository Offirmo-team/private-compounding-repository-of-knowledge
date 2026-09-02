/////////////////////////////////////////////////
// TODO 1D move to config

const WORKSPACES_LAYER_1 = [
	"0-meta/*",

	"1-isomorphic/1-libs--simple/*",
]

const SPEC: Partial<InfiniteMonorepoSpec> = {
	/////// RUNTIME ///////
	// (defaults)

	/////// GRAPH ///////
	workspaces: [
		...WORKSPACES_LAYER_1,

		"1-isomorphic/2-libs--cross-cutting/*",
		"1-isomorphic/3-libs--advanced/*",
		"1-isomorphic/X-incubator/active/*",

		"2-engine--winter/*",

		"3-engine--node/0-dev-tools/*",
		"3-engine--node/1-libs--simple/*",
		"3-engine--node/2-libs--cross-cutting/*",
		"3-engine--node/X-incubator/active/*",

		"4-engine--browser/0-dev-tools/*",
		"4-engine--browser/1-libs--simple/*",
		"4-engine--browser/2-libs--cross-cutting/*",
		"4-engine--browser/X-incubator/active/*",

		"7-multimorphic/@oh-my-rpg/*",

		"B-backend/*",

		"S-skus/*/*",
		/*"S-skus/@dev-docs--web3/*",
		"S-skus/@digital-hoarder/*",
		"S-skus/@infinite-monorepo/*",
		"S-skus/@tbrpg/1-logic/*",
		"S-skus/@web-property-outfitter/*",
		"S-skus/@yvem/*",
		"S-skus/single-pkg/*",*/
	],

	/////// TOOLING ///////
	package_manager: "pnpm",
	package_manager__config: {
		// TODO 1D improve the auto-bumping with auto pick most recent less than minimumReleaseAge
		minimumReleaseAge: 1440,
		minimumReleaseAgeStrict: false,
		publicHoistPattern: ["@monorepo-private/storypad"],
		overrides: {
			// typescript 7 changed the interface
			//"parse-imports-ts>typescript": "npm:@typescript/typescript6",
		},
	},

	/////// CODEGEN ///////
	// (defaults)

	/////// META ///////
	// (defaults)
}

export default SPEC

/////////////////////////////////////////////////

assert(SEP === "/", `Sorry, this repo's code doesn't properly use path.sep and doesn't support anything else!`) // TODO 1D
assert(EOL === "\n", `Sorry, this repo's code doesn't properly use os.EOL and doesn't support anything else!`) // TODO 1D

/////////////////////////////////////////////////

import { strict as assert } from "node:assert"
import { EOL } from "node:os"
import { sep as SEP } from "node:path"

import type { InfiniteMonorepoSpec } from "@infinite-monorepo/spec"
