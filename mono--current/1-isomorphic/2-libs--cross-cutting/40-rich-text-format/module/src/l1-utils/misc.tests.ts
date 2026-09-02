import { expect } from "chai"
import { Enum } from "typescript-string-enums"

import type { Immutable } from "@monorepo-private/ts--types"

import { LIB } from "../consts.ts"
import { NodeType } from "../l1-types/index.ts"

/////////////////////////////////////////////////

const _NODE_TYPE_to_DISPLAY_MODE: Immutable<{ [k: string]: "inline" | "block" }> = {
	// classic inlines
	[NodeType.fragmentⵧinline]: "inline",
	[NodeType.strong]: "inline",
	[NodeType.weak]: "inline",
	[NodeType.em]: "inline",
	[NodeType.emoji]: "inline",

	// classic blocks
	[NodeType.fragmentⵧblock]: "block",
	//[NodeType.heading]:         'block',
	[NodeType.ol]: "block",
	[NodeType.ul]: "block",
	[NodeType.hr]: "block",

	// special
	[NodeType.br]: "inline", // allowed in inline

	// internally used, don't mind
	[NodeType._h]: "inline",
	[NodeType._li]: "block",
}

describe(`${LIB} -- internal utils`, function () {
	describe("_NODE_TYPE_to_DISPLAY_MODE", function () {
		it("should be complete", () => {
			const keys = Object.keys(_NODE_TYPE_to_DISPLAY_MODE)
			expect(keys.sort().join(",")).to.equal(Enum.keys(NodeType).sort().join(","))
		})
	})
})
