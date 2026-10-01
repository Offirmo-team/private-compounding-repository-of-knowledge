
// TODO
import { WebsiteEntryPointSpec } from '../src'
import { HtmlString } from '../src/generate--index-html/types'
import { EOL } from '../src/consts'

function generateꓽhtml__head__meta__twitter(spec: Immutable<WebsiteEntryPointSpec>): HtmlString {
	// https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards

	return [
	].join(EOL).trim()
}

// TODO
function generateꓽhtml__head__meta__opengraph(spec: Immutable<WebsiteEntryPointSpec>): HtmlString {
	// https://ogp.me/

	return [
		//`<meta property="og:title" content="${getꓽtitleⵧsocial(spec)}"/>`,
	].join(EOL).trim()
}
