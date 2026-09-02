import { assert_from, assert } from "@monorepo-private/assert"
const chroma = ((await import("chroma-js")) as any).default as chroma.ChromaStatic // has ESM issues 2024/08

import type { HtmlMetas, HtmlMetaContentⳇViewport, HtmlFileSpec } from "@web-property-outfitter/generator--html"

import type { Immutable } from "@monorepo-private/ts--types"
import type { Contentⳇweb, Css‿str, Html‿str, JS‿str } from "@monorepo-private/ts--types--hypermedia"
import * as ContentⳇwebᐧSelectors from "@monorepo-private/ts--types--hypermedia"

import { LIB } from "../../consts.ts"
import { generateꓽinline as generateꓽfavicon__iconⵧinline } from "../../generate--icons/index.ts"
import {
	getꓽtitleⵧpage,
	getꓽfeatures,
	getꓽlang,
	getꓽcolorⵧtheme,
	getꓽcharset,
	isꓽuser_scalable,
	supportsꓽscreensⵧwith_shape,
	wantsꓽinstall,
	usesꓽpull_to_refresh,
	getꓽcolorⵧbackground,
	getꓽcolorⵧforeground,
	needsꓽwebmanifest,
	getꓽbasenameⵧwebmanifest,
	shouldꓽgenerateꓽjscode,
} from "../../selectors/index.ts"
import type { WebPropertySpec } from "../../types.ts"
import { ifꓽdebug } from "../../utils/debug.ts"

/////////////////////////////////////////////////

function _getꓽmetasⵧviewport(spec: Immutable<WebPropertySpec>): HtmlMetaContentⳇViewport {
	return {
		// which site is not mobile friendly those day?
		// and those who are not are obviously NOT using this tool ;)
		width: "device-width",
		//height: 'device-height', NO this seems to be a default, no site use it
		"initial-scale": 1,

		// scalability
		// - either we explicitly don't want it
		// - or/and we support orientation change => we need to lock the scale
		//   bc the viewport doesn't fit on orientation change (cf. https://stackoverflow.com/a/12114397)
		//   TODO review this case!
		...(!isꓽuser_scalable(spec) /*|| !prefersꓽorientation(spec)*/ && {
			"user-scalable": "no",
			"minimum-scale": 1,
			"maximum-scale": 1,
		}),

		"viewport-fit": supportsꓽscreensⵧwith_shape(spec) ? "cover" : "contain",

		// TODO 'interactive-widget'
	}
}

function getꓽmetas(spec: Immutable<WebPropertySpec>): HtmlMetas {
	const result: HtmlMetas = {
		charset: getꓽcharset(spec.content),

		// document-level metadata
		// <meta name="<KEY>" content="<VALUE>">
		document: {
			viewport: _getꓽmetasⵧviewport(spec),

			...(wantsꓽinstall(spec) && {
				"apple-mobile-web-app-capable": "yes",
				"apple-mobile-web-app-status-bar-style": supportsꓽscreensⵧwith_shape(spec) ? "black-translucent" : "black",
			}),

			"format-detection": "telephone=no", // TODO only if explicit?
		},

		// pragma directives, equivalent to http headers
		// <meta http-equiv="<KEY>" content="<VALUE>" />
		pragmas: {
			"content-security-policy": {
				// TODO
			},
			"content-type": `text/html;charset=${getꓽcharset(spec.content)}`,
			"content-language": getꓽlang(spec.content),

			//description: unknown
			generator: LIB,
			keywords: [],

			// TODO only if explicit?
			"theme-color": getꓽcolorⵧtheme(spec),
		},

		// <meta property="<KEY>" content="<VALUE>"/>
		properties: {
			//TODO Open Graph & co
		},

		itemprops: {},
	}

	return result
}

function getꓽlinks(spec: Immutable<WebPropertySpec>): { [rel: string]: string } {
	const favicon_candidate = generateꓽfavicon__iconⵧinline(spec)
	const shouldꓽinline_favicon = !favicon_candidate.includes('"') && favicon_candidate.length < 256 // arbitrary number

	return {
		//canonical: `https://TODO`,

		icon: shouldꓽinline_favicon ? `data:image/svg+xml;utf8,${favicon_candidate}` : `./icon.svg`,

		...(needsꓽwebmanifest(spec) && {
			// tests
			// 2023/10 iOs  relative ./xyz.webmanifest = works
			// 2023/10 iOs  relative   xyz.webmanifest = works
			// 2023/10 iOs  saw queries to <parent>/index.webmanifest ???
			manifest: `./${getꓽbasenameⵧwebmanifest(spec)}`,
		}),
	}
}

/////////////////////////////////////////////////

const TOKEN__COLOR__BG = "--o⋄color⁚bg--main" //'color--bg'
const TOKEN__COLOR__FG = "--o⋄color⁚fg--main" //color--fg'
const TOKEN__FONT__SYSTEMⵧSANS = "--o⋄font-family--system--sans"

function getꓽcontentⵧinitial(spec: Immutable<WebPropertySpec>): Immutable<Contentⳇweb> {
	return spec.content ?? {}
}

function getꓽcontentⵧweb__css(
	spec: Immutable<WebPropertySpec>,
): Pick<Contentⳇweb, "css" | "cssⵧtop__layers" | "cssⵧtop__namespaces" | "cssⵧcritical"> {
	const content: Immutable<Contentⳇweb> = getꓽcontentⵧinitial(spec)
	const result: ReturnType<typeof getꓽcontentⵧweb__css> = {
		css: [...ContentⳇwebᐧSelectors.getꓽcss(content)],
		cssⵧtop__layers: [...ContentⳇwebᐧSelectors.getꓽcssⵧtop__layers(content)],
		cssⵧtop__namespaces: { ...ContentⳇwebᐧSelectors.getꓽcssⵧtop__namespaces(content) },
		cssⵧcritical: [...ContentⳇwebᐧSelectors.getꓽcssⵧcritical(content)],
	}

	const colorⵧbackground = getꓽcolorⵧbackground(spec)
	const colorⵧforeground = getꓽcolorⵧforeground(spec)
	assert(chroma.contrast(colorⵧbackground, colorⵧforeground), `fg/bg contrast should be > 4.5:1!`)

	// TODO check if this system font stack works on major OS/browser
	result.cssⵧcritical!.unshift(`/* critical minimal design system */
:root {
	/* FG+BG colors are the basics of identity */
	${TOKEN__COLOR__BG}: ${colorⵧbackground};
	${TOKEN__COLOR__FG}: ${colorⵧforeground};
	/* https://systemfontstack.com/ simplified */
	${TOKEN__FONT__SYSTEMⵧSANS}: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;

	margin: 0;
	padding: 0;

	color: var(${TOKEN__COLOR__FG});
	background-color: var(${TOKEN__COLOR__BG});
	font-family: var(${TOKEN__FONT__SYSTEMⵧSANS});

	${
		usesꓽpull_to_refresh(spec)
			? ""
			: `/* https://www.the-koi.com/projects/how-to-disable-pull-to-refresh/ */
	overscroll-behavior: none;`
	}
}
`)

	return result
}

function getꓽcontentⵧweb__html(spec: Immutable<WebPropertySpec>): Pick<Contentⳇweb, "html" | "html__root__attributes"> {
	// TODO add feature to pass HTML through paths?
	const result = {
		html: [...ContentⳇwebᐧSelectors.getꓽhtml(getꓽcontentⵧinitial(spec))],
		html__root__attributes: [...ContentⳇwebᐧSelectors.getꓽhtml__root__attributes(getꓽcontentⵧinitial(spec))],
	}

	const colorⵧforeground = getꓽcolorⵧforeground(spec)
	const colorⵧforeground__luminance = chroma(colorⵧforeground).luminance()
	const is_dark_theme = colorⵧforeground__luminance > 0.4

	const features = new Set(getꓽfeatures(spec))
	if (features.has("cssⳇframework--offirmo")) {
		const has_theme = result.html__root__attributes.some((x) => x.startsWith("data-o-theme="))
		if (is_dark_theme) {
			if (!has_theme) {
				result.html__root__attributes.push('data-o-theme="dark"')
			}
		}
	}

	/* can't find how to detect a color
	if (features.has('cssⳇframework--offirmo') || features.has('cssⳇfoundation--offirmo')) {
		const chromatic = chroma(colorⵧforeground).get('oklch.c')
		console.log({
			colorⵧforeground,
			oklch: chroma(colorⵧforeground).oklch(),
			chromatic,
		})
		// black = 0, white = 1
		assert(false, `foreground color should be saturated enough "${colorⵧforeground}": ${chromatic}!`)
	}*/

	return result
}

function getꓽcontentⵧweb__js(spec: Immutable<WebPropertySpec>): Pick<Contentⳇweb, "js" | "jsⵧcritical"> {
	const content: Immutable<Contentⳇweb> = getꓽcontentⵧinitial(spec)
	const result = {
		js: [...ContentⳇwebᐧSelectors.getꓽjs(content)],
		jsⵧcritical: [...ContentⳇwebᐧSelectors.getꓽjsⵧcritical(content)],
	}

	if (shouldꓽgenerateꓽjscode(spec) && !spec.content?.js?.some((x) => x.includes("app/index")))
		result.js.push(`import './app/index.ts'`)

	return result
}

function getꓽcontentⵧweb(spec: Immutable<WebPropertySpec>): Contentⳇweb {
	const result: Contentⳇweb = {
		...(structuredClone(getꓽcontentⵧinitial(spec)) as Contentⳇweb), // remove immutability
		title: ifꓽdebug(spec).prefixꓽwith("[title--page]", getꓽtitleⵧpage(spec)), // always override

		...getꓽcontentⵧweb__html(spec),
		...getꓽcontentⵧweb__js(spec),
		...getꓽcontentⵧweb__css(spec),
	}
	return result
}

/////////////////////////////////////////////////

function getꓽhtml_doc_spec(spec: Immutable<WebPropertySpec>): HtmlFileSpec {
	const result: HtmlFileSpec = {
		content: getꓽcontentⵧweb(spec),
		links: getꓽlinks(spec),
		metas: getꓽmetas(spec),
		features: getꓽfeatures(spec),
	}
	return result
}

/////////////////////////////////////////////////

export { getꓽhtml_doc_spec }
