/////////////////////////////////////////////////

describe(`${LIB} -- renderers -- to terminal`, () => {
	let rendering_options = {}
	beforeEach(() => {
		rendering_options = {}
	})

	describe("with default styles", () => {
		describe("primitives", () => {
			it("should work", () => {
				RichText.Enum.values(RichText.NodeType)
					.filter((k) => k !== "_li")
					.forEach((k) => {
						console.log(`------- ${k}: -------`)

						const $wrapper = RichText.fragmentⵧblock().assemble((builder) => {
							builder.pushText("[pre]")
							switch (k) {
								case "br":
									builder.pushLineBreak()
									break
								case "hr":
									builder.pushHorizontalRule()
									break
								default:
									builder.pushSubNode(
										RichText._create(k)
											.pushText(k === "emoji" ? "🏆" : k)
											.done(),
									)
									break
							}

							builder.pushText("[post]")
						})

						const str = renderⵧto_terminal($wrapper, rendering_options)
						console.log(str)
					})
			})
		})

		describe("combinations", () => {
			it("should work -- demos", () => {
				Object.values(DEMOS).forEach(($doc) => {
					const str = renderⵧto_terminal($doc, rendering_options)
					console.log(str)
				})
			})
		})
	})
})

/////////////////////////////////////////////////

import { beforeEach, describe, expect, it } from "vitest"

import * as RichText from "@monorepo-private/rich-text-format"
import * as DEMOS from "@monorepo-private/rich-text-format/examples"

import { LIB, renderⵧto_terminal } from "./index.ts"
