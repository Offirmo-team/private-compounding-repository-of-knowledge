import { expect } from "chai"

import { LIB } from "../consts.ts"
import type { Node, StrictNode } from "../l1-types/types.ts"

import { normalizeꓽnode } from "./normalize.ts"

/////////////////////////////////////////////////

describe(`${LIB} -- normalizeꓽnode`, function () {
	it("should fill in all defaults for a minimal node", () => {
		const result = normalizeꓽnode({ $content: "hello" })
		expect(result.$v).to.equal(1)
		expect(result.$type).to.equal("fragmentⵧinline") // resolved from non-array $content
		expect(result.$heading).to.be.null
		expect(result.$content).to.equal("hello")
		expect(result.$refs).to.deep.equal({})
		expect(result.$classes).to.deep.equal([])
		expect(result.$hints).to.deep.equal({})
	})

	it("should resolve $type from $content shape -- inline", () => {
		const result = normalizeꓽnode({ $content: "hello" })
		expect(result.$type).to.equal("fragmentⵧinline")
	})

	it("should resolve $type from $content shape -- block", () => {
		const result = normalizeꓽnode({ $content: ["a", "b"] })
		expect(result.$type).to.equal("fragmentⵧblock")
	})

	it("should preserve an explicit $type", () => {
		const result = normalizeꓽnode({ $type: "strong", $content: "bold" })
		expect(result.$type).to.equal("strong")
	})

	it("should normalize unicode in string $content", () => {
		// NFC normalization: é as e + combining accent → single é
		const decomposed = "e\u0301" // e + combining acute accent
		const result = normalizeꓽnode({ $content: decomposed })
		expect(result.$content).to.equal("\u00e9") // NFC normalized é
	})

	it("should normalize unicode in string $heading", () => {
		const decomposed = "e\u0301"
		const result = normalizeꓽnode({ $heading: decomposed, $content: ["body"] })
		expect(result.$heading).to.equal("\u00e9")
	})

	it("should not deep-normalize non-string $content", () => {
		const inner: Node = { $content: "nested" }
		const result = normalizeꓽnode({ $content: [inner] })
		// inner node should not be touched
		expect((result.$content as any)[0]).to.equal(inner)
	})

	it("should reject extraneous keys", () => {
		expect(() => normalizeꓽnode({ $content: "hello", foo: 42 } as any)).to.throw("extraneous")
	})

	it("should reject unknown schema versions", () => {
		expect(() => normalizeꓽnode({ $v: 999, $content: "hello" })).to.throw("unknown schema version")
	})

	it("should preserve existing $refs, $classes, $hints", () => {
		const result = normalizeꓽnode({
			$content: "⎨⎨name⎬⎬",
			$refs: { name: "World" },
			$classes: ["greeting"],
			$hints: { possible_emoji: "👋" },
		})
		expect(result.$refs).to.deep.equal({ name: "World" })
		expect(result.$classes).to.deep.equal(["greeting"])
		expect(result.$hints).to.deep.equal({ possible_emoji: "👋" })
	})
})
