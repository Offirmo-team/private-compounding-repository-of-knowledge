import { expect } from "chai"

import { LIB } from "./consts.ts"

import {
	createꓽempty,
	createꓽfrom_emoji,
	setꓽviewBox,
	setꓽbackground_color,
	addꓽcontent,
	getꓽsvg‿str,
} from "./index.ts"

/////////////////////////////////////////////////

describe(`${LIB}`, function () {
	describe("getꓽsvg‿str()", function () {
		// TODO validate against https://jwatt.org/svg/authoring/

		it("should work -- emoji -- compact", () => {
			const svg = createꓽfrom_emoji("🦄")
			const str = getꓽsvg‿str(svg, { wantsꓽcompact: true })
			expect(str).to.equal(
				`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦄</text></svg>`,
			)
		})

		it("should work -- simple", () => {
			const svg = createꓽempty()
			const str = getꓽsvg‿str(svg, { wantsꓽcompact: true })
			expect(str).to.equal(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 255 255'></svg>`)
		})

		it("should work -- viewbox", () => {
			let svg = createꓽempty()
			svg = setꓽviewBox(svg, [0, 0, 100, 200])
			const str = getꓽsvg‿str(svg, { wantsꓽcompact: true })
			expect(str).to.equal(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 200'></svg>`)
		})

		it("should work -- background", () => {
			let svg = createꓽempty()
			svg = setꓽviewBox(svg, [0, 0, 100, 200])
			svg = setꓽbackground_color(svg, "#123456")
			const str = getꓽsvg‿str(svg, { wantsꓽcompact: true })
			expect(str).to.equal(
				`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 200'><rect id='background-color' fill='#123456' x='0' y='0' width='100' height='200' /></svg>`,
			)
		})
	})
})
