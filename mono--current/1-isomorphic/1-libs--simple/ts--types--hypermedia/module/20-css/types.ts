/* TypeScript types useful when manipulating CSS
 */

/////////////////////////////////////////////////
export type Css‿str = string

export type CssⳇColor‿str = `#${number}${number}${number}` | string

export type CssⳇLength‿str = `${number}${"px"}`

export type CssⳇAngle‿str = `${number}${"deg"}`

export type CssⳇPercent‿str = `${number}%`

export type Cssⳇratio = number

export type CssⳇFilterⳇFunctionSpec =
	// https://developer.mozilla.org/en-US/docs/Web/CSS/filter#functions
	| ["blur", CssⳇLength‿str]
	| ["brightness", Cssⳇratio]
	| ["contrast", CssⳇPercent‿str]
	// drop shadow
	| ["grayscale", CssⳇPercent‿str]
	| ["hue-rotate", CssⳇAngle‿str]
	| ["invert", CssⳇPercent‿str]
	| ["opacity", CssⳇPercent‿str]
	| ["saturate", CssⳇPercent‿str]
	| ["sepia", CssⳇPercent‿str]

export type CssⳇFilterSpec = Array<CssⳇFilterⳇFunctionSpec>

/* TODO more complicated CSS type? Let's see if needed
export interface Css {
	isꓽcritical?: true
	layer(s)
	namespace(s)
	license(s)
	content: Css‿str || Css ??? (tree?)
}
*/

// https://developer.mozilla.org/en-US/docs/Web/CSS/font-family
export type FontFamilyGenericName =
	| "serif"
	| "sans-serif"
	| "monospace"
	| "cursive"
	| "fantasy"
	| "system-ui"
	| "ui-serif"
	| "ui-sans-serif"
	| "ui-monospace"
	| "ui-rounded"
	| "emoji"
	| "math"
	| "fangsong"

export interface Withꓽfontᝍfamily {
	"font-family": Array<string | FontFamilyGenericName>
}

// https://github.com/atlassian-labs/compiled/blob/a01bb381dcc22a976b0825853fa7856c3dbc5b63/packages/react/src/types.ts
