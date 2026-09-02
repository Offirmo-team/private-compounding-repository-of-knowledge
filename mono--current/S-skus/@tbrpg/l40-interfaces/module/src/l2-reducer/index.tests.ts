import { expect } from "chai"

import {
	type ReducerAction,
	type Reducer,
	createꓽaction__base,
	createꓽaction,
	ACTION_TYPEꘌUPDATE_TO_NOW,
	type ActionUpdateToNow,
	createꓽactionꘌupdate_to_now,
	ACTION_TYPEꘌNOOP,
	type ActionNoop,
	createꓽactionꘌnoop,
	ACTION_TYPEꘌSET,
	type ActionSet_,
	createꓽactionꘌset,
	ACTION_TYPEꘌHACK,
	type ActionHack_,
	createꓽactionꘌhack,
} from "@monorepo-private/ts--types--hypermedia"

import { init, reducer, createꓽstore } from "./index.ts"

/////////////////////////////////////////////////

describe(`TBRPG -- interfaces`, function () {
	describe("for useReducer", function () {
		it("should init -- no args", () => {
			const state1 = init()
			expect(state1).to.be.an("object")
		})

		it("should reduce", () => {
			const state1 = init()
			const state2 = reducer(state1, createꓽactionꘌnoop())
			expect(state2).to.equal(state1)
		})
	})

	describe("for useSyncExternalStore", function () {
		it("should synchronously notify subscribers on dispatch", () => {
			const { subscribe, dispatch } = createꓽstore()

			let notification_count = 0
			const unsubscribe = subscribe(() => {
				notification_count++
			})

			dispatch(createꓽactionꘌnoop())
			expect(notification_count).to.equal(1)

			unsubscribe()
			dispatch(createꓽactionꘌnoop())
			expect(notification_count).to.equal(1)
		})
	})
})
