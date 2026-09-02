import { strict as assert } from "node:assert"
import * as fs from "node:fs"
import * as path from "node:path"

/////////////////////////////////////////////////

type RelPath = string
type AbsPath = string

/////////////////////////////////////////////////

interface Workspace {
	name: string
	path‿abs: AbsPath
}

export function getꓽbolt_monorepo__workspaces(MONOREPO_ROOT: AbsPath): Array<Workspace> {
	const workspace_lines = (() => {
		// TODO switch to @infinite
		return [
			"0-meta/0-dev-tools/*",
			"0-meta/X-to-reorganize/*",

			"1-isomorphic/1-libs--simple/*",
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

			"C-final/@dev-docs--web3/*",
			"C-final/@digital-hoarder/*",
			"C-final/@infinite-monorepo/*",
			"C-final/@tbrpg/1-logic/*",
			"C-final/@web-property-outfitter/*",
			"C-final/@yvem/*",
			"C-final/single-pkg/*",
		]

		const MONOREPO_ROOT_PKGᐧJSON = getꓽbolt_monorepo__root_packageᐧjson(MONOREPO_ROOT)

		assert(
			Object.hasOwn(MONOREPO_ROOT_PKGᐧJSON, "bolt"),
			`The bolt monorepo's root package.json should contain the "bolt" key!`,
		)
		assert(
			Object.hasOwn(MONOREPO_ROOT_PKGᐧJSON.bolt, "workspaces"),
			`The bolt monorepo's root package.json should contain the "bolt.workspaces" key!`,
		)

		return MONOREPO_ROOT_PKGᐧJSON.bolt.workspaces as string[]
	})()

	const MONOREPO_WORKSPACES_RELPATHS = workspace_lines.map((p) => p.slice(0, -2)) // slice to remove trailing "/*"

	return MONOREPO_WORKSPACES_RELPATHS.sort()
		.filter((p: RelPath) => {
			return !p.startsWith("#") && !p.startsWith("xx") // we allow "commenting" a workspace to help "progressive resurrection"
		})
		.map((p: RelPath): Workspace => {
			return {
				name: p,
				path‿abs: path.join(MONOREPO_ROOT, p),
			}
		})
}

/////////////////////////////////////////////////

function getꓽbolt_monorepo__root_packageᐧjson(MONOREPO_ROOT: AbsPath): any {
	return JSON.parse(fs.readFileSync(path.join(MONOREPO_ROOT, "package.json"), { encoding: "utf-8" }))
}
