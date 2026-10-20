import { ActionType, type ActionAcknowledgeEngagementMsgSeen } from "@tbrpg/interfaces"
import { expect } from "chai"

import { createꓽserver } from "./server.ts"

/////////////////////////////////////////////////

describe(`OHA server`, function () {
	it("should work -- init", async () => {
		const server = createꓽserver()

		const $doc1 = await server.ↆget()
	})

	it("should work -- play", async () => {
		const server = createꓽserver()
		await server.dispatch({ type: ActionType["play"]! })

		const $doc2 = await server.ↆget()
	})

	it("should work -- update to now", async () => {
		const server = createꓽserver()
		await server.dispatch({ type: ActionType["utilⵧupdate_to_now"]! })

		const $doc2 = await server.ↆget()
	})

	it("should work -- ack engagement", async () => {
		const server = createꓽserver()
		await server.dispatch({
			type: ActionType["acknowledge_engagement_msg_seen"]!,
			uids: [],
		} satisfies ActionAcknowledgeEngagementMsgSeen)

		const $doc2 = await server.ↆget()
	})
})
