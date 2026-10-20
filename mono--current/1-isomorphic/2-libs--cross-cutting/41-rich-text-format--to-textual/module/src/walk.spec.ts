/////////////////////////////////////////////////

describe(`${LIB} -- renderers -- walker (internal)`, () => {
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

	describe("sub-nodes resolution", () => {
		it("should work -- predefined -- br", () => {
			const $doc = {
				$content: "foo⎨⎨br⎬⎬bar",
				// no sub-nodes: it's pre-defined!
			}
			const str = renderⵧto_text($doc)
			expect(str).toBe("foo\nbar")
		})

		it("should work -- predefined -- hr", () => {
			const $doc = {
				$content: "foo⎨⎨hr⎬⎬bar",
				// no sub-nodes: it's pre-defined!
			}
			const str = renderⵧto_text($doc)
			expect(str).toBe("foo\n\n---\n\nbar")
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
			expect(str).toBe("foo42baz")
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
			expect(str).toBe("foo\n\n42\n\nbaz")
		})

		it("should work -- handling missing -- error", () => {
			const $doc = {
				$content: "foo⎨⎨gꓽbar⎬⎬baz",
				$refs: {
					// MISSING sub node
				},
			}

			expect(() => walk<State, Options>($doc, { ...callbacks }, rendering_options)).toThrow("unknown sub-node")
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
			expect(str).toBe("foo{{??gꓽbar??}}baz")
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
			expect(str).toBe("foo33baz")
		})
	})

	describe("callbacks -- types", () => {
		it.todo("should work -- catch all")
		it.todo("should work -- specify")
	})

	describe("callbacks -- filters", () => {
		it.todo("should work -- catch all")
		it.todo("should work -- specify")
	})

	describe("callbacks -- classes", () => {
		it.todo("should work -- catch all")
		it.todo("should work -- specify")
	})

	describe("error detection", () => {
		it("should detect unmatched ⎨⎨⎬⎬ -- ⎨⎨ 1", () => {
			const $doc = {
				$content: "⎨⎨foo",
			}
			expect(() => walk<State, Options>($doc, { ...callbacks }, rendering_options)).toThrow("unmatched")
		})
		it("should detect unmatched ⎨⎨⎬⎬ -- ⎨⎨ 2", () => {
			const $doc = {
				$content: "⎨⎨foo⎬⎬ ⎨⎨bar",
				$refs: {
					foo: {},
				},
			}
			expect(() => walk<State, Options>($doc, { ...callbacks }, rendering_options)).toThrow("unmatched")
		})

		it("should detect unmatched ⎨⎨⎬⎬ -- ⎬⎬ 1", () => {
			const $doc = {
				$content: "foo⎬⎬",
			}
			expect(() => walk<State, Options>($doc, { ...callbacks }, rendering_options)).toThrow("unmatched")
		})
		it("should detect unmatched ⎨⎨⎬⎬ -- ⎬⎬ 2a", () => {
			const $doc = {
				$content: "⎨⎨foo⎬⎬ bar⎬⎬",
				$refs: {
					foo: {},
				},
			}
			expect(() => walk<State, Options>($doc, { ...callbacks }, rendering_options)).toThrow("unmatched")
		})
		it("should detect unmatched ⎨⎨⎬⎬ -- ⎬⎬ 2b", () => {
			const $doc = {
				$content: "bar⎬⎬ ⎨⎨foo⎬⎬",
				$refs: {
					foo: {},
				},
			}
			expect(() => walk<State, Options>($doc, { ...callbacks }, rendering_options)).toThrow("unmatched")
		})

		it("should detect reversed ⎨⎨⎬⎬", () => {
			const $doc = {
				$content: "⎬⎬foo⎨⎨",
				$refs: {
					foo: {},
				},
			}
			expect(() => walk<State, Options>($doc, { ...callbacks }, rendering_options)).toThrow("unmatched")
		})
	})
})

/////////////////////////////////////////////////

import { beforeEach, describe, expect, it } from "vitest"

import { type Node } from "@monorepo-private/rich-text-format"

import { LIB } from "./consts.ts"
import { renderⵧto_text, callbacksⵧto_text } from "./to-text/index.ts"
import { walk, type WalkerCallbacks } from "./walk.ts"
import { type BaseRenderingOptions, DEFAULT_RENDERING_OPTIONSⵧWalk } from "./walk.ts"
