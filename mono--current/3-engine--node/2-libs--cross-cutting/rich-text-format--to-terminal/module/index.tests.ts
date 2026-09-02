import { expect } from "chai"

import * as RichText from "@monorepo-private/rich-text-format"
import * as DEMOS from "@monorepo-private/rich-text-format/examples"

import { LIB, renderⵧto_terminal } from "./index.ts"

/////////////////////////////////////////////////

describe(`${LIB} -- renderers -- to terminal`, () => {
	let rendering_options = {}
	beforeEach(() => {
		rendering_options = {}
	})

	describe("with default styles", function () {
		describe("primitives", function () {
			it("should work", () => {
				RichText.Enum.values(RichText.NodeType)
					.filter((k) => k !== "_li")
					.forEach((k) => {
						console.log(`------- ${k}: -------`)

						const $node = RichText._create(k)
							.pushText(k === "emoji" ? "🏆" : k)
							.done()

						const $wrapper = RichText.fragmentⵧblock().pushText("[pre]").pushNode($node).pushText("[post]").done()

						const str = renderⵧto_terminal($wrapper, rendering_options)
						console.log(str)
					})
			})
		})

		describe("combinations", function () {
			it("should work -- demos", () => {
				Object.values(DEMOS).forEach(($doc) => {
					const str = renderⵧto_terminal($doc, rendering_options)
					console.log(str)
				})
			})
		})
	})
})
