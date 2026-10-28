/////////////////////////////////////////////////

describe(`${LIB} -- normalizeꓽnode`, () => {
	it("should fill in all defaults for a minimal node", () => {
		const result = normalizeꓽnode({ $content: "hello" })
		expect(result.$v).toBe(1)
		expect(result.$type).toBe("fragmentⵧinline") // resolved from non-array $content
		expect(result.$heading).toBeNull()
		expect(result.$content).toBe("hello")
		expect(result.$refs).toStrictEqual({})
		expect(result.$classes).toStrictEqual([])
		expect(result.$hints).toStrictEqual({})
	})

	it("should resolve $type from $content shape -- inline", () => {
		const result = normalizeꓽnode({ $content: "hello" })
		expect(result.$type).toBe("fragmentⵧinline")
	})

	it("should resolve $type from $content shape -- block", () => {
		const result = normalizeꓽnode({ $content: ["a", "b"] })
		expect(result.$type).toBe("fragmentⵧblock")
	})

	it("should preserve an explicit $type", () => {
		const result = normalizeꓽnode({ $type: "strong", $content: "bold" })
		expect(result.$type).toBe("strong")
	})

	it("should normalize unicode in string $content", () => {
		// NFC normalization: é as e + combining accent → single é
		const decomposed = "e\u0301" // e + combining acute accent
		const result = normalizeꓽnode({ $content: decomposed })
		expect(result.$content).toBe("\u00e9") // NFC normalized é
	})

	it("should normalize unicode in string $heading", () => {
		const decomposed = "e\u0301"
		const result = normalizeꓽnode({ $heading: decomposed, $content: ["body"] })
		expect(result.$heading).toBe("\u00e9")
	})

	it("should not deep-normalize non-string $content", () => {
		const inner: Node = { $content: "nested" }
		const result = normalizeꓽnode({ $content: [inner] })
		// inner node should not be touched
		expect((result.$content as any)[0]).toBe(inner)
	})

	it("should reject extraneous keys", () => {
		expect(() => normalizeꓽnode({ $content: "hello", foo: 42 } as any)).toThrow("extraneous")
	})

	it("should reject unknown schema versions", () => {
		expect(() => normalizeꓽnode({ $v: 999, $content: "hello" })).toThrow("unknown schema version")
	})

	it("should preserve existing $refs, $classes, $hints", () => {
		const result = normalizeꓽnode({
			$content: "⎨⎨name⎬⎬",
			$refs: { name: "World" },
			$classes: ["greeting"],
			$hints: { possible_emoji: "👋" },
		})
		expect(result.$refs).toStrictEqual({ name: "World" })
		expect(result.$classes).toStrictEqual(["greeting"])
		expect(result.$hints).toStrictEqual({ possible_emoji: "👋" })
	})
})

/////////////////////////////////////////////////

import { describe, expect, it } from "vitest"

import { LIB } from "../consts.ts"
import type { Node, NodeⳇNormalized } from "../l1-types/types.ts"

import { normalizeꓽnode } from "./normalize.ts"
