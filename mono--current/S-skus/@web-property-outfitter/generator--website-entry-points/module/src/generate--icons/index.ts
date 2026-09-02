import { Resvg } from "@resvg/resvg-js"
import { getꓽsvg‿str, createꓽfrom_emoji, type Svg‿str } from "@web-property-outfitter/generator--svg"

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import {
	getꓽicon__sizes,
	getꓽiconⵧemoji,
	getꓽiconⵧsvg,
	getꓽicon__path,
	getꓽdirⵧfiles_to_serve,
} from "../selectors/index.ts"
import type { WebPropertySpec, FilesMap } from "../types.ts"

/////////////////////////////////////////////////

// null = size-less (true SVG)
function generateꓽfile(spec: Immutable<WebPropertySpec>, size: number | null): Svg‿str | Buffer {
	// we need resvg update to support emojis
	// we need SVG loading support
	// etc. etc.
	throw new Error(`NIMP!`)
	/*
	if (size === null) {
		const svg = getꓽiconⵧsvg(spec)
		return svg && getꓽsvg‿str(svg)
	}

	if (size === 16) {
		// TODO .ico
		console.warn(`TODO generate .ico file!`, { size })
		throw new Error('NIMP!')
	}

	console.warn(`TODO generate icon file!`, { size })
	//throw new Error('TODO REVIEW!')
	return 'TODO'
	/*
	const pngⵧbiggest_or_equal = getꓽpng_icon_pathⵧclosest_to_size(spec)

	// render to png
	//console.log(svg)
	const resvg__opts = {
		font: {
			// emojis are not working, reported
			/*
			fontFiles: ['/Users/xyz/work/tmp/Noto_Color_Emoji/NotoColorEmoji-Regular.ttf'],
			loadSystemFonts: false, // It will be faster to disable loading system fonts.
			defaultFontFamily: 'Noto Color Emoji',
			*/
	//defaultFontFamily: 'Apple Color Emoji',
	/*},
	}
	const resvg = new Resvg(svg, resvg__opts)
	const renderedImage = resvg.render()
	//console.info('Output PNG Size  :', `${renderedImage.width} x ${renderedImage.height}`)
	return renderedImage.asPng()*/
}

function generateꓽinline(spec: Immutable<WebPropertySpec>): string {
	return getꓽsvg‿str(createꓽfrom_emoji(getꓽiconⵧemoji(spec)), {
		wantsꓽcompact: true,
	})
}

/////////////////////////////////////////////////

function generateꓽfixed_sizes(spec: Immutable<WebPropertySpec>): FilesMap {
	console.warn(`TODO generate fixed size icon files!`, getꓽicon__sizes(spec))
	return {}
	/*
	return getꓽicon__sizes(spec).reduce((acc, size) => {
			acc[getꓽicon__path(spec, size)] = generateꓽfile(spec, size)
			return acc
		}, {} as EntryPointFiles)*/
}

function generate(spec: Immutable<WebPropertySpec>): FilesMap {
	return {
		// size-less version (SVG) if possible
		...(getꓽiconⵧsvg(spec) && {
			[`${getꓽdirⵧfiles_to_serve(spec)}/${getꓽicon__path(spec, null)}`]: generateꓽfile(spec, null),
		}),

		...generateꓽfixed_sizes(spec),
	}
}

/////////////////////////////////////////////////

export default generate
export { generateꓽinline }
