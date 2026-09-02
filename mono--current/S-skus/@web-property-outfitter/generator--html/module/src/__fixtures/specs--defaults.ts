import type { Contentⳇweb } from "@monorepo-private/ts--types--hypermedia"

import { type HtmlFileSpec } from "../.."

/////////////////////////////////////////////////
/*
HtmlFileSpec
↳ content: Contentⳇweb
	⇲ WithCharset
	⇲ WithLang
	⇲ WithTitle
↳ links?: Links
↳ metas?: Partial<HtmlMetas>
↳ features?: Array<FeatureSnippets>
*/
/////////////////////////////////////////////////

const CONTENT: Contentⳇweb = {
	//html?: Html‿str[]
	//css?: Css‿str[]
	//cssⵧtop__layers?: string[]
	//cssⵧtop__namespaces?: {}
	//cssⵧcritical?: Css‿str[]
	//js?: JS‿str[]
	//jsⵧcritical?: JS‿str[]

	lang: "en",
	title: "Offirmo - Fullstack Developer",
}

//const CSP: HtmlMetaContentⳇContentSecurityPolicy = {
//const METAS__VIEWPORT: HtmlMetaContentⳇViewport {
//const LINKS: Links { [rel: string]: string }
//const METAS: HtmlMetas

const SPEC: HtmlFileSpec = {
	content: CONTENT,
	features: ["cssⳇbox-layout--natural", "normalize-url-trailing-slash", "cssⳇfoundation--offirmo"],
}

/////////////////////////////////////////////////

export { SPEC }
