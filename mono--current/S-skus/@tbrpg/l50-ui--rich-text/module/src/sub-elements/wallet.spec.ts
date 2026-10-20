import { Currency, DEMO_STATE, create as create_wallet, add_amount } from "@tbrpg/state--wallet"
import { expect } from "chai"

import * as RichText from "@monorepo-private/rich-text-format"
import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"

import { render_wallet } from "./sub-elements"
import { LIB } from "./sub-elements/consts.ts"

/////////////////////////////////////////////////

describe(`🔠  ${LIB} - wallet`, function () {
	context("when empty", function () {
		it("should render properly", () => {
			const wallet = create_wallet()
			const $doc = render_wallet(wallet)
			const str = renderⵧto_text($doc)

			expect(str).to.be.a("string")
			expect(str).to.contain(" 0 coins")
			expect(str).to.contain(" 0 tokens")
		})
	})

	context("when not empty", function () {
		it("should render properly", () => {
			let wallet = create_wallet()
			wallet = add_amount(wallet, Currency.coin, 12345)
			wallet = add_amount(wallet, Currency.token, 67)

			const $doc = render_wallet(wallet)
			const str = renderⵧto_text($doc)

			expect(str).to.be.a("string")
			expect(str).not.to.contain("0")
			expect(str).to.contain(" 12345 coins")
			expect(str).to.contain(" 67 tokens")
		})
	})

	describe("demo", function () {
		it("shows off", () => {
			const $doc = render_wallet(DEMO_STATE)
			//console.log(prettifyꓽjson($doc))
			const str = renderⵧto_text($doc)
			// should just not throw
		})
	})
})
