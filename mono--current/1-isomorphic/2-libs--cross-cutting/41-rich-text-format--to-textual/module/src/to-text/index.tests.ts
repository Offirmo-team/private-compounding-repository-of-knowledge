import { expect } from "chai"

import * as RichText from "@monorepo-private/rich-text-format"
import * as RichTextExamples from "@monorepo-private/rich-text-format/examples"

import { LIB } from "../consts.ts"

import { renderⵧto_text } from "./index.ts"

/////////////////////////////////////////////////

describe(`${LIB} -- renderers -- to text`, () => {
	let rendering_options = {}
	beforeEach(() => {
		rendering_options = {}
	})

	describe(`settings = default`, function () {
		const snapshots: Record<string, string> = {
			$EXAMPLE__INLINE__DEFAULT: `Example of NodeType.fragmentⵧinline`,
			$EXAMPLE__INLINE__EM: `_Example of NodeType.em_`,
			$EXAMPLE__INLINE__EMOJI: `Example of NodeType.emoji`,
			$EXAMPLE__INLINE__STRONG: `**Example of NodeType.strong**`,
			$EXAMPLE__INLINE__WEAK: `<small>Example of NodeType.weak</small>`,
			$EXAMPLE__INLINE__BR: `Example of NodeType.br: before
after`,

			$EXAMPLE__BLOCK__DEFAULT: `

Example of NodeType.fragmentⵧblock

`,
			$EXAMPLE__BLOCK__OLⵧCONTENT: `
1. ol item #1
2. ol item #2
3. ol item #3
`,
			$EXAMPLE__BLOCK__OLⵧREFS: `
1. ol item #1
2. ol item #2
3. ol item #3
`,
			$EXAMPLE__BLOCK__OLⵧWITH_HEADING: `
# 3 sector model

1. primary = raw materials
2. secondary = manufacturing
3. tertiary = services
`,
			$EXAMPLE__BLOCK__ULⵧCONTENT: `
- ul item #1
- ul item #2
- ul item #3
`,
			$EXAMPLE__BLOCK__ULⵧREFS: `
- ul item #1
- ul item #2
- ul item #3
`,
			$EXAMPLE__BLOCK__HR: `

---

`,

			$EXAMPLE__REFSⵧINSIDE: `Hello, **world**!`,
			$EXAMPLE__REFSⵧOUTSIDE: `Hello, **world**!`,

			// margin above is normal, trim() can be done caller side if needed
			$EXAMPLE_COMPLETE_NODE: `



# Some title

Hello, World!

`,
			$EXAMPLE__DOC__WITH_H_LEVELS: `



# Déclaration universelle des Droits de l’Homme


## Préambule

Considérant que la reconnaissance de la dignité inhérente à tous les membres de la famille humaine et de leurs droits égaux et inaliénables constitue le fondement de la liberté, de la justice et de la paix dans le monde...L’Assemblée Générale
Proclame la présente Déclaration Universelle des Droits de l’Homme comme l’idéal commun à atteindre par tous les peuples et toutes les nations...


## Article premier

Tous les êtres humains naissent libres et égaux en dignité et en droits. Ils sont doués de raison et de conscience et doivent agir les uns envers les autres dans un esprit de fraternité.


## Article 2

Chacun peut se prévaloir de tous les droits et de toutes les libertés proclamés dans la présente Déclaration, sans distinction aucune...

`,
			$EXAMPLE__NESTED_LIST: `
- immediately nested ol:
  1. ol item #1
  2. ol item #2
  3. ol item #3
- simple text
- immediately nested ul:
  - ul item #1
  - ul item #2
  - ul item #3
- deep nesting:
  - immediately nested ol:
    1. ol item #1
    2. ol item #2
    3. ol item #3
  - another simple text
  - immediately nested ul:
    - ul item #1
    - ul item #2
    - ul item #3
`,
			$EXAMPLE__USE_CASE__WALLET: `
1. 🌱 *** *** *** 2025/12/25
  1. 🦸 persona 1
  2. 🦹 persona 2
2. 🌱 *** *** *** 2026/03/10
  1. 🌿 Family
    1. 👦🏻 kid 1
    2. 👧🏼 kid 2
    3. 👶 kid 3
`,
		}

		Object.entries(RichTextExamples).forEach(([key, $EXAMPLE]) => {
			it(`should work -- ${key}`, () => {
				const str = renderⵧto_text($EXAMPLE, rendering_options)
				//console.log(str)

				if (!snapshots[key]) {
					console.log(`Please add:
${key}: \`${str}\`,
					`)
				}
				expect(str).to.equal(snapshots[key])
			})
		})

		/*
		it("should work -- basic", () => {
			const str = renderⵧto_text($EXAMPLE_COMPLETE_NODE, rendering_options)
			//console.log(str)

			// the content should be included
			expect(str).to.contain("\n\n# Some title\n\n")
			expect(str).to.contain("\nHello, World!\n")
		})

		it("should work -- lists -- ol", () => {
			const str = renderⵧto_text(RichTextExamples.DOC_DEMO_LIST_ORDERED, rendering_options)
			console.log(str)

			expect(str).to.equal(
				`
1. ol #1
2. ol #2
3. ol #3
`,
			)
		})

		it("should work -- lists -- ul", () => {
			const str = renderⵧto_text(DOC_DEMO_LIST_UNORDERED, rendering_options)
			console.log(str)

			expect(str).to.equal(`
- ul #1
- ul #2
- ul #3
`)
		})

		it("should work -- lists -- nested", () => {
			const str = renderⵧto_text(DOC_DEMO_LIST_NESTED, rendering_options)
			console.log(str)

			expect(str).to.equal(
				`
- immediately nested ol:
  1. ol #1
  2. ol #2
  3. ol #3
- simple text
- immediately nested ul:
  - ul #1
  - ul #2
  - ul #3
- deep nesting:
  - immediately nested ol:
    1. ol #1
    2. ol #2
    3. ol #3
  - another simple text
  - immediately nested ul:
    - ul #1
    - ul #2
    - ul #3
`,
			)
		})

		/*
		it('should work -- KV', () => {
			const str = renderⵧto_text($DEMOⵧKV, rendering_options)
			//console.log(str)

			// the content should be included
			expect(str).to.contain('Your character:')
			expect(str).to.contain('Max health')
			expect(str).to.contain('123')
			expect(str).to.contain('Intelligence')
			expect(str).to.contain('45')
			expect(str).to.contain('Strength')
			expect(str).to.contain('6')

			// the content should have been formatted
			// TO OL
		})
		*/
	})
})
