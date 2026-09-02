import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import {
	canꓽuse_window_controls_overlay,
	hasꓽown_navigation,
	getꓽbasenameⵧindexᐧhtml,
	getꓽlang,
	getꓽtitleⵧapp,
	getꓽtitleⵧappⵧshort,
	getꓽcolorⵧbackground,
	getꓽcolorⵧtheme,
	supportsꓽscreensⵧwith_shape,
	getꓽicon__sizes,
	getꓽicon__path,
} from "../selectors/index.ts"
import type { WebAppCategory, WebPropertySpec } from "../types.ts"
import { ifꓽdebug } from "../utils/debug.ts"

import type { Icon, WebManifest } from "./types.ts"

/////////////////////////////////////////////////

function _generateꓽicons(spec: Immutable<WebPropertySpec>): WebManifest["icons"] {
	// TODO should we add a size-less SVG? Is there any platform that would use it?
	return getꓽicon__sizes(spec).reduce(
		(acc, size) => {
			const icon_path = getꓽicon__path(spec, size)
			let type = `image/svg+xml`
			switch (true) {
				case icon_path.endsWith(".ico"): {
					// no need in the manifest
					return acc
				}
				case icon_path.endsWith(".svg"):
					type = `image/svg+xml`
					break
				case icon_path.endsWith(".png"):
					type = `image/png`
					break
				default:
					throw new Error(`Generating Webmanifest, unknown icon format! ${icon_path}`)
			}

			acc.push({
				src: `./${icon_path}`, // TODO review should we add ./ ?
				type,
				// purpose: "maskable", TODO review
				...(size && { sizes: `${size}x${size}` }),
			} as Icon)
			return acc
		},
		[] as WebManifest["icons"],
	)
}

function generate(spec: Immutable<WebPropertySpec>): WebManifest {
	const result: WebManifest = {
		lang: getꓽlang(spec),

		// critical to be installable
		name: ifꓽdebug(spec).prefixꓽwith(`[wm.n]`, getꓽtitleⵧapp(spec)),
		icons: _generateꓽicons(spec),
		start_url: `./${getꓽbasenameⵧindexᐧhtml(spec)}?ref=webmanifest`,

		// enhancements
		display: hasꓽown_navigation(spec)
			? supportsꓽscreensⵧwith_shape(spec)
				? "fullscreen"
				: "standalone"
			: "minimal-ui",

		// critical for good experience
		short_name: ifꓽdebug(spec).prefixꓽwith(`[wm.s]`, getꓽtitleⵧappⵧshort(spec)),

		theme_color: getꓽcolorⵧtheme(spec),
		background_color: getꓽcolorⵧbackground(spec),

		...(canꓽuse_window_controls_overlay(spec) && { display_override: ["window-controls-overlay"] }),

		//description: ...
		//categories: ...
	}

	return result
}

/////////////////////////////////////////////////

export default generate
