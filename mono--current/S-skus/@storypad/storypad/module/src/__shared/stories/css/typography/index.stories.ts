import type { FontFamilyGenericName } from "@monorepo-private/ts--types--hypermedia"

import { PANGRAM, ALPHABET, CALIBRATION_SUBSET } from "./consts.ts"

////////////////////////////////////////////////////////////////////////////////////

const DEFAULT_REFERENCE_FONT_FAMILY: FontFamilyGenericName = "sans-serif"

// TODO https://web.dev/blog/font-size-adjust

// https://web.dev/articles/css-size-adjust#calibrating_fonts
// https://deploy-preview-15--upbeat-shirley-608546.netlify.app/perfect-ish-font-fallback/
// https://codepen.io/Offirmo/pen/rNgjdEb
export function Normalization(reference: FontFamilyGenericName | null = DEFAULT_REFERENCE_FONT_FAMILY) {
	const FONT_SIZING_DEMO = `<span><span class="size-reference2"></span><span class="size-reference"></span>${CALIBRATION_SUBSET}<span class="size-reference"></span><span class="size-reference2"></span>
				</span>`

	const TEST_CASES = [
		FONT_SIZING_DEMO,
		FONT_SIZING_DEMO,
		`<button><span>${CALIBRATION_SUBSET}</span></button>`,
		ALPHABET,
	]

	return `
<style>

:root {
	font-size: 16px;
	line-height: 1.5;

	box-sizing: border-box;

	/* https://kilianvalkhof.com/2022/css-html/your-css-reset-needs-text-size-adjust-probably/
	 */
	-moz-text-size-adjust: none;
	-webkit-text-size-adjust: none;
	text-size-adjust: none;

	text-rendering: geometricPrecision;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	/* test */
	text-underline-offset: initial;
}

table {
	table-layout: fixed;
	border-collapse: collapse;

	* {
		font-size: var(--size);
		font-family: var(--ffamily);
		margin: 0;
		padding: 0;
	}

	span {
		text-decoration: underline overline line-through;
		text-decoration-thickness: 1px;
		text-decoration-color: red;
		background-color: #e8cccccc;
		white-space: nowrap;
	}

	tr {
		td {
			background-color: #cccee8cc;
			text-align: center;
			border: 1px solid black;
		}

		td:nth-child(1) {
			text-align: right;
			--ffamily: ${reference};
		}
		td:nth-child(2) {
			text-align: left;
		}
	}

	tr:nth-child(2) {
		--size: 64px;
	}
	tr:nth-child(3) {
		--size: 30px;
	}
	tr:nth-child(4) {
		--size: 30px;
	}
}

button {
	border-radius: var(--size);
	padding: 0 1ch;
	border: solid 1px;
	background-color: grey;
}

.size-reference {
	display: inline-block;
	height: var(--size);
	width: 0.5ch;
	background-color: lightcoral;
	vertical-align: middle;
}
.size-reference2 {
	display: inline-block;
	height: calc(var(--size) / 2);
	width: 0.5ch;
	background-color: lightcoral;
	vertical-align: middle;
}
</style>
<table>
	<tr>
		<td>
			reference
		</td>
		<td>
			font to normalize
		</td>
	</tr>
	${TEST_CASES.map((test_case) => `<tr><td>${test_case}</td><td>${test_case}</td></tr>`).join("")}
</table>
	`
}

function demo_style({
	property,
	values,
	reference = DEFAULT_REFERENCE_FONT_FAMILY,
	demo_text = PANGRAM,
}: {
	property: string
	values: string[]
	reference?: FontFamilyGenericName | null
	demo_text?: string
}) {
	return `
<p>
<table>
	<thead>
		<tr>
			<th><code>${property}</code></th>
			<th style="font-family: monospace">demo</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>[reference]</code></td>
			<td><span style="font-family: ${reference};">${demo_text}</span></td>
		</tr>
		${values
			.map(
				(value) => `
			<tr>
				<td><code>${value}</code></td>
				<td><span style="${property}:${value};">${demo_text}</span></td>
			</tr>
		`,
			)
			.join("")}
	</tbody>
</table>
</p>
	`
}

export function Demoꓽfontᝍsize() {
	return demo_style({
		property: "font-size",
		values: [
			"xx-small",
			"x-small",
			"small",
			"medium",
			"large",
			"x-large",
			"xx-large",
			"xxx-large",
			"smaller",
			"initial",
			"larger",
			"12px",
		],
	})
}

export function Demoꓽfontᝍstyle() {
	return demo_style({
		property: "font-style",
		values: ["normal  ", "italic  ", "oblique", "oblique 45deg"],
	})
}

export function Demoꓽfontᝍweight() {
	return demo_style({
		property: "font-weight",
		values: [
			// semantic first
			"lighter",
			"normal ",
			"bold",
			"bolder ",
			// numerical
			"1",
			"100",
			"200",
			"300",
			"400",
			"500",
			"600",
			"700",
			"800",
			"900",
			"1000",
		],
	})
}

export function DemoꓽHTML_Elements() {
	return `
<ul>
	<li><code>&lt;em&gt;</code>: <em>${PANGRAM}</em></li>
	<li><code>&lt;strong&gt;</code>: <strong>${PANGRAM}</strong></li>
	<li><code>&lt;sub/sup&gt;</code>: <sub>${PANGRAM.slice(0, PANGRAM.length / 3)}</sub>XX${PANGRAM.slice(PANGRAM.length / 3, (2 * PANGRAM.length) / 3)}<sup>${PANGRAM.slice((-1 * PANGRAM.length) / 3)}</sup></li>
</ul>
`
}

// text-decoration
// letter-spacing
// line-height

// http://stackoverflow.com/questions/2438122/font-variantsmall-caps-vs-text-transformcapitalize
export function Demoꓽtextᝍtransform() {
	return demo_style({
		property: "text-transform",
		values: ["none", "capitalize", "lowercase", "uppercase"],
	})
}

// http://stackoverflow.com/questions/2438122/font-variantsmall-caps-vs-text-transformcapitalize
export function Demoꓽfontᝍvariantᝍcaps() {
	return demo_style({
		property: "font-variant-caps",
		values: ["normal", "small-caps", "all-small-caps", "petite-caps", "all-petite-caps", "unicase", "titling-caps"],
	})
}

// need variable font!
export function Demoꓽfontᝍstretch() {
	return demo_style({
		property: "font-stretch",
		values: [
			// https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch
			"normal",
			"ultra-condensed",
			"extra-condensed",
			"condensed",
			"semi-condensed",
			"semi-expanded",
			"expanded",
			"extra-expanded",
			"ultra-expanded",
		],
	})
}

export function Demoꓽfontᝍvariantᝍnumeric() {
	return demo_style({
		property: "font-variant-numeric",
		values: [
			"normal",
			"ordinal",
			"slashed-zero",
			"lining-nums",
			"oldstyle-nums",
			"proportional-nums",
			"tabular-nums",
			"diagonal-fractions",
			"stacked-fractions",
			"oldstyle-nums stacked-fractions",
		],
		demo_text: "01234567890  3.14  3/4  1st, 1er, 1a",
	})
}

// https://medium.engineering/typography-is-impossible-5872b0c7f891
export function Demoꓽchallenges() {
	return `
Typographic challenges:
<ul>
	<li><code>I vs i</code>: I like it!</li>
	<li><code>D vs O</code>: odd dog, ODD DOG</li>
	<li><code>kerning</code>: Yay! I can stay! YAY...</li>
	<li>italicized descenders: <div style="background-color: #e8cccccc"><span style="font-style: italic;">yay!</span></div></li>
	<li></li>
</ul>
</>
`
}

/*
'normal;
'ordinal;
'slashed-zero;
'lining-nums; /* <numeric-figure-values>
'oldstyle-nums; /* <numeric-figure-values>
'proportional-nums; /* <numeric-spacing-values>
'tabular-nums; /* <numeric-spacing-values>
'diagonal-fractions; /* <numeric-fraction-values>
'stacked-fractions; /* <numeric-fraction-values>
'oldstyle-nums stacked-fractions;
 */

export function DemoꓽAll(reference: FontFamilyGenericName | null = DEFAULT_REFERENCE_FONT_FAMILY) {
	return `
${reference ? `<div style="font-family: ${reference}"><code>Reference: "${reference}"</code>: ${PANGRAM}</div>` : ""}
${Demoꓽfontᝍsize()}
${Demoꓽfontᝍstyle()}
${Demoꓽfontᝍweight()}
${DemoꓽHTML_Elements()}
${Demoꓽtextᝍtransform()}
${Demoꓽchallenges()}
${Demoꓽfontᝍvariantᝍcaps()}
${Demoꓽfontᝍstretch()}
${Demoꓽfontᝍvariantᝍnumeric()}
`
}
