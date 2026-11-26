/////////////////////////////////////////////////

describe(`marketing`, () => {
	describe(`CREATOR`, () => {
		it("should be valid", () => {
			expectㆍtoㆍbeㆍaㆍvalidㆍCreator(CREATOR)
		})
	})

	describe(`THINGⵧONLINE`, () => {
		it("should be valid", () => {
			expectㆍtoㆍbeㆍaㆍvalidㆍWithOnlinePresence(THINGⵧONLINE)
		})
	})

	describe(`LANDING_PAGE`, () => {
		it("should be valid", () => {
			//expectㆍtoㆍbeㆍaㆍvalidㆍWithOnlinePresence(LANDING_PAGE)
			// TODO 1D check more
		})
	})
})

/////////////////////////////////////////////////

import { describe, it, expect } from "vitest"

import {
	expectㆍtoㆍbeㆍaㆍvalidㆍCreator,
	expectㆍtoㆍbeㆍaㆍvalidㆍWithOnlinePresence,
} from "@monorepo-private/ts--types--hypermedia/_expect"

import { CREATOR, THINGⵧONLINE, LANDING_PAGE } from "./index.ts"
