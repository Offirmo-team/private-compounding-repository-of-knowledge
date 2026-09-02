import { expect } from "chai"

import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"

import { LIB } from "../consts.ts"
import { isꓽNode } from "../l1-types/guards.ts"

import * as RichText from "./builder.ts"

/////////////////////////////////////////////////

describe(`${LIB} -- sugar -- builder`, () => {
	describe("creation", function () {
		it("should work -- empty", () => {
			const builder = RichText.fragmentⵧinline()
			const $node = builder.$node
			const $doc = builder.done()

			expect($doc).to.equal("")
		})

		it("should work -- from content: string", () => {
			const builder = RichText.fragmentⵧinline("foo")
			const $node = builder.$node
			const $doc = builder.done()

			expect($doc).to.equal("foo")
		})

		it("should work -- from content: number", () => {
			const builder = RichText.fragmentⵧinline(42)
			const $node = builder.$node
			const $doc = builder.done()

			expect($doc).to.equal("42")
		})

		it("should work -- from content: node", () => {
			const builder = RichText.strong({
				$content: "⎨⎨sub⎬⎬",
				$type: "fragmentⵧinline",
				$classes: ["bar"],
				$refs: {
					sub: "foo",
				},
				$hints: { uuid: "1234" },
			})
			const $node = builder.$node
			const $doc = builder.done()

			expect(isꓽNode($doc)).to.be.true
			expect(renderⵧto_text($doc)).to.equal("**foo**")

			// was lifted with no loss
			expect($node.$classes).to.deep.equal(["bar"])
			expect($node.$hints).to.deep.equal({ uuid: "1234" })
			expect($node.$content).to.equal("⎨⎨sub⎬⎬")
		})

		it("should work -- from content: multiple nodes (list) -- array -- ul", () => {
			const builder = RichText.listⵧunordered([42, "foo"])
			const $node = builder.$node
			const $doc = builder.done()

			expect(isꓽNode($doc)).to.be.true
			expect(renderⵧto_text($doc)).to.equal("\n- 42\n- foo\n")
		})

		it("should work -- from content: multiple nodes (list) -- array -- ol", () => {
			const builder = RichText.listⵧordered([42, "foo"])
			const $node = builder.$node
			const $doc = builder.done()

			expect(isꓽNode($doc)).to.be.true
			expect(renderⵧto_text($doc)).to.equal("\n1. 42\n2. foo\n")
		})

		it.skip("should work -- from content: multiple nodes (list) -- k/v", () => {
			const builder = RichText.listⵧordered({
				class: "foo",
				lvl: 42,
			})
			const $node = builder.$node
			const $doc = builder.done()

			expect(isꓽNode($doc)).to.be.true
			expect(renderⵧto_text($doc)).to.equal("class..foo\nlvl.....42")
		})
	})

	describe("pushText()", function () {
		it("should work", () => {
			const builder = RichText.fragmentⵧinline().pushText("Hello!")
			const $node = builder.$node
			const $doc = builder.done()

			expect($doc).to.equal("Hello!")
		})
	})

	describe("addHints()", function () {
		it("should work", () => {
			const builder = RichText.fragmentⵧinline().pushText("Hello!").addHints({ uuid: "1234" })
			const $node = builder.$node
			const $doc = builder.done()

			expect(isꓽNode($doc)).to.be.true
			expect(renderⵧto_text($doc)).to.equal("Hello!")
			expect($node.$hints).to.deep.equal({ uuid: "1234" })
		})
	})

	describe("addClass()", function () {
		it("should work", () => {
			const builder = RichText.fragmentⵧinline().pushText("Hello!").addClass("foo", "bar")
			const $node = builder.$node
			const $doc = builder.done()

			expect(isꓽNode($doc)).to.be.true
			expect(renderⵧto_text($doc)).to.equal("Hello!")
			expect($node.$classes).to.deep.equal(["foo", "bar"])
		})
	})

	// this is the basic primitive on top of whom other are built
	describe("addSub()", function () {
		it("should work", () => {
			const builder = RichText.fragmentⵧinline().addSub(RichText.strong("foo").done())
			const $node = builder.$node
			const $doc = builder.done()

			expect(isꓽNode($doc)).to.be.true
			expect(Object.values($node.$refs).length).to.equal(1)
			expect(Object.keys($node.$refs)).to.deep.equal(["0001"]) // auto id
			expect(renderⵧto_text($doc)).to.equal("") // yes, empty! We pushed a raw sub node without referencing it
		})

		it("should detect semantic errors = block in inline", () => {
			const builder = RichText.fragmentⵧinline()

			expect(() => builder.addSub(RichText.fragmentⵧblock("foo").done()), "block").to.throw(
				"block node into an inline node",
			)
			expect(() => builder.setHeading("foo"), "heading").to.throw("should be a block")
			expect(() => builder.addSub(RichText.listⵧordered().done()), "ol").to.throw("block node into an inline node")
			expect(() => builder.addSub(RichText.listⵧunordered().done()), "ul").to.throw("block node into an inline node")
			expect(() => builder.pushHorizontalRule(), "hr").to.throw("block node into an inline node")
		})

		it("should detect semantic errors = list items outside of a list", () => {
			const builder = RichText.fragmentⵧblock()

			expect(() => builder.pushKeyValue(1, 42)).to.throw("intended to be used in a ol/ul only")
			//expect(() => builder.pushListItem(42)).to.throw('xxx')
		})
	})

	describe("addSubs()", function () {
		it("should work", () => {
			const builder = RichText.fragmentⵧinline().addSubs({
				foo: RichText.strong("foo").done(),
				bar: RichText.strong("bar").done(),
			})
			const $node = builder.$node
			const $doc = builder.done()

			expect(isꓽNode($doc)).to.be.true
			expect(Object.values($node.$refs).length).to.equal(2)
			expect(Object.keys($node.$refs)).to.deep.equal(["foo", "bar"]) // ids were preserved
			expect(renderⵧto_text($doc)).to.equal("") // yes, empty! see above
		})
	})

	describe("pushSubNode()", function () {
		it("should work -- auto id", () => {
			const builder = RichText.fragmentⵧinline().pushSubNode(RichText.strong("foo").done())
			const $node = builder.$node
			const $doc = builder.done()

			expect(isꓽNode($doc)).to.be.true
			expect(Object.values($node.$refs).length).to.equal(1)
			expect(Object.keys($node.$refs)).to.deep.equal(["0001"]) // auto id
			expect($node.$content).to.equal("⎨⎨0001⎬⎬") // auto id
			expect(renderⵧto_text($doc)).to.equal("**foo**")
		})

		it("should work -- explicit id", () => {
			const builder = RichText.fragmentⵧinline().pushSubNode(RichText.strong("foo").done(), { id: "bar" })
			const $node = builder.$node
			const $doc = builder.done()

			expect(isꓽNode($doc)).to.be.true
			expect(Object.values($node.$refs).length).to.equal(1)
			expect(Object.keys($node.$refs)).to.deep.equal(["bar"])
			expect($node.$content).to.equal("⎨⎨bar⎬⎬")
			expect(renderⵧto_text($doc)).to.equal("**foo**")
		})

		it("should check semantic", () => {
			expect(() =>
				RichText.fragmentⵧinline()
					.pushSubNode(RichText.strong("foo").done(), { classes: ["bar"] } as any)
					.done(),
			).to.throw("option")
		})
	})

	describe.skip("pushKeyValue()", function () {
		it("should allow loose nodes", () => {
			const b1 = RichText.listⵧordered().pushKeyValue("foo", "42")
			//const $node = builder.$node
			const $1 = b1.done()
			expect(renderⵧto_text($1)).to.equal("foo..42")

			const b2 = RichText.listⵧordered().pushKeyValue("foo", 42)
			//const $node = builder.$node
			const $2 = b2.done()
			expect(renderⵧto_text($2)).to.equal("foo..42")

			const b3 = RichText.listⵧordered().pushKeyValue("foo", { $content: "42" })
			//const $node = builder.$node
			const $3 = b3.done()
			expect(renderⵧto_text($3)).to.equal("foo..42")
		})

		it("should perform some checks", () => {
			const builder = RichText.fragmentⵧinline()

			expect(() => builder.pushKeyValue("foo", 42)).to.throw("Key/value is intended to be used in a ol/ul only!")
		})
	})
})
