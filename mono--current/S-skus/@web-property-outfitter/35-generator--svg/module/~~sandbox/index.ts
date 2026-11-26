import * as SVGLib from '@web-property-outfitter/generator--svg'

let $svg = SVGLib.createꓽempty()
$svg = SVGLib.setꓽviewBox($svg, [ 0, 0, 5000, 5000])
$svg = SVGLib.addꓽcontentꘌmire($svg)

//let $layer = SVGLib.createꓽgroup()
//$svg = SVGLib.addꓽlayer($svg, $layer)

	//<line stroke="#3dc1d3" stroke-width="24" x1="320" x2="560" y1="320" y2="560"  />

$svg = SVGLib.decorate_for_editors($svg)
const svg‿str = SVGLib.getꓽsvg‿str($svg)
//console.log(svg‿str)


/////////////////////////////////////////////////
import '@prettier/plugin-xml' // for dep detection
import * as Prettier from 'prettier'
const PRETTIER_OPTIONS = {
	printWidth: 120,
	tabWidth: 3,
	useTabs: true,
	semi: false,
	singleQuote: true,
	jsxSingleQuote: true,
	quoteProps: 'consistent',
	arrowParens: 'avoid',

	// https://github.com/prettier/plugin-xml
	singleAttributePerLine: true,
	xmlSortAttributesByKey: true,
	xmlWhitespaceSensitivity: 'ignore'
} satisfies Partial<Prettier.RequiredOptions>
const svgⵧformatted‿str = await Prettier.format(svg‿str, { ...PRETTIER_OPTIONS, parser: 'xml', plugins: ["@prettier/plugin-xml"], })
console.log(svgⵧformatted‿str)

/////////////////////////////////////////////////
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
await fs.writeFile(path.join(__dirname, 'index.svg'), svgⵧformatted‿str)

/////////////////////////////////////////////////
// render to png
import { Resvg } from '@resvg/resvg-js'
import { addꓽcontentꘌmire } from '@web-property-outfitter/generator--svg'

const resvg__opts = {
	font: {
	// emojis are not working, reported
	/*
	fontFiles: ['/Users/xyz/work/tmp/Noto_Color_Emoji/NotoColorEmoji-Regular.ttf'],
	loadSystemFonts: false, // It will be faster to disable loading system fonts.
	defaultFontFamily: 'Noto Color Emoji',
	*/
	//defaultFontFamily: 'Apple Color Emoji',
	},
}
console.log('Rendering SVG to PNG…')
const resvg = new Resvg(svgⵧformatted‿str, resvg__opts)
const renderedImage = resvg.render()
console.info('Output PNG Size  :', `${renderedImage.width} x ${renderedImage.height}`)
await fs.writeFile(path.join(__dirname, 'index.png'), renderedImage.asPng())
