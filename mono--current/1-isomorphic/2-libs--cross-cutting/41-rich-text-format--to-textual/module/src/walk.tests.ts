import { expect } from "chai"

import { type Node } from "@monorepo-private/rich-text-format"
/////////////////////////////////////////////////

import { LIB } from "./consts.ts"
import { renderⵧto_text, callbacksⵧto_text } from "./to-text/index.ts"
import { walk, type WalkerCallbacks } from "./walk.ts"
import { type BaseRenderingOptions, DEFAULT_RENDERING_OPTIONSⵧWalk } from "./walk.ts"

describe(`${LIB} -- renderers -- walker (internal)`, function () {
	interface State {}
	interface Options extends BaseRenderingOptions {}
	const callbacks: Partial<WalkerCallbacks<State, Options>> = {
		createꓽstate() {
			return {} as State
		},
	}

	let rendering_options: Options
	beforeEach(() => {
		rendering_options = {
			...DEFAULT_RENDERING_OPTIONSⵧWalk,
			shouldꓽrecover_from_unknown_sub_nodes: "crash",
		}
	})

	describe("sub-nodes resolution", function () {
		it("should work -- predefined -- br", () => {
			const $doc = {
				$content: "foo⎨⎨br⎬⎬bar",
				// no sub-nodes: it's pre-defined!
			}
			const str = renderⵧto_text($doc)
			expect(str).to.equal("foo\nbar")
		})

		it("should work -- predefined -- hr", () => {
			const $doc = {
				$content: "foo⎨⎨hr⎬⎬bar",
				// no sub-nodes: it's pre-defined!
			}
			const str = renderⵧto_text($doc)
			expect(str).to.equal("foo\n\n---\n\nbar")
		})

		it("should work -- existing -- default (inline)", () => {
			const $doc = {
				$content: "foo⎨⎨bar⎬⎬baz",
				$refs: {
					bar: {
						$content: "42",
					},
				},
			}
			const str = renderⵧto_text($doc)
			expect(str).to.equal("foo42baz")
		})

		it("should work -- existing -- explicit (block)", () => {
			const $doc = {
				$content: "foo⎨⎨bar⎬⎬baz",
				$refs: {
					bar: {
						$content: ["42"],
						//$type: RichText.NodeType.fragmentⵧblock,
					},
				},
			}
			const str = renderⵧto_text($doc)
			expect(str).to.equal("foo\n\n42\n\nbaz")
		})

		it("should work -- handling missing -- error", () => {
			const $doc = {
				$content: "foo⎨⎨gꓽbar⎬⎬baz",
				$refs: {
					// MISSING sub node
				},
			}

			expect(() => walk<State, Options>($doc, { ...callbacks }, rendering_options)).to.throw("unknown sub-node")
		})

		it("should work -- handling missing -- auto recovery -- placeholder", () => {
			const $doc = {
				$content: "foo⎨⎨gꓽbar⎬⎬baz",
				$refs: {
					// NO sub node
				},
			}

			const str = renderⵧto_text($doc, {
				shouldꓽrecover_from_unknown_sub_nodes: "placeholder",
				style: "basic",
			})
			expect(str).to.equal("foo{{??gꓽbar??}}baz")
		})

		it("should work -- handling missing -- resolver", () => {
			const $doc = {
				$content: "foo⎨⎨gꓽbar⎬⎬baz",
				$refs: {
					// NO sub node
				},
			}

			const str = renderⵧto_text($doc, undefined, {
				...callbacksⵧto_text,
				resolveꓽunknown_ref($refs_node_id: string, ...rest): Node | undefined {
					if ($refs_node_id === "gꓽbar")
						return {
							$content: "33",
							//$type: RichText.NodeType.fragmentⵧblock,
						}

					return undefined
				},
			})
			expect(str).to.equal("foo33baz")
		})
	})

	describe("callbacks -- types", function () {
		it("should work -- catch all")
		it("should work -- specify")
	})

	describe("callbacks -- filters", function () {
		it("should work -- catch all")
		it("should work -- specify")
	})

	describe("callbacks -- classes", function () {
		it("should work -- catch all")
		it("should work -- specify")
	})

	describe("error detection", function () {
		it("should detect unmatched ⎨⎨⎬⎬ -- ⎨⎨ 1", () => {
			const $doc = {
				$content: "⎨⎨foo",
			}
			expect(() => walk<State, Options>($doc, { ...callbacks }, rendering_options)).to.throw("unmatched")
		})
		it("should detect unmatched ⎨⎨⎬⎬ -- ⎨⎨ 2", () => {
			const $doc = {
				$content: "⎨⎨foo⎬⎬ ⎨⎨bar",
				$refs: {
					foo: {},
				},
			}
			expect(() => walk<State, Options>($doc, { ...callbacks }, rendering_options)).to.throw("unmatched")
		})

		it("should detect unmatched ⎨⎨⎬⎬ -- ⎬⎬ 1", () => {
			const $doc = {
				$content: "foo⎬⎬",
			}
			expect(() => walk<State, Options>($doc, { ...callbacks }, rendering_options)).to.throw("unmatched")
		})
		it("should detect unmatched ⎨⎨⎬⎬ -- ⎬⎬ 2a", () => {
			const $doc = {
				$content: "⎨⎨foo⎬⎬ bar⎬⎬",
				$refs: {
					foo: {},
				},
			}
			expect(() => walk<State, Options>($doc, { ...callbacks }, rendering_options)).to.throw("unmatched")
		})
		it("should detect unmatched ⎨⎨⎬⎬ -- ⎬⎬ 2b", () => {
			const $doc = {
				$content: "bar⎬⎬ ⎨⎨foo⎬⎬",
				$refs: {
					foo: {},
				},
			}
			expect(() => walk<State, Options>($doc, { ...callbacks }, rendering_options)).to.throw("unmatched")
		})

		it("should detect reversed ⎨⎨⎬⎬", () => {
			const $doc = {
				$content: "⎬⎬foo⎨⎨",
				$refs: {
					foo: {},
				},
			}
			expect(() => walk<State, Options>($doc, { ...callbacks }, rendering_options)).to.throw("unmatched")
		})
	})
})
