/** Use case: enabling / disabling some features */

import { isꓽlocalhost } from "../l1-is-localhost"
import { isꓽtunneled } from "../l1-is-tunneled"

/////////////////////////////////////////////////

// prod = full security and reliability
// staging = close to prod, usually only difference is the data storage = different from prod
// dev = anything else
function inferꓽchannel(URLⵧCANONICAL: string = "", currentWindow = window): "prod" | "staging" | "dev" {
	// order is important!

	// first weed out obvious dev cases
	if (!currentWindow.isSecureContext) return "dev"
	if (currentWindow.location.protocol !== "https:") return "dev"
	if (currentWindow.location.port) return "dev"

	if (isꓽlocalhost()) return "dev"

	if (isꓽtunneled()) return "dev"

	// does it match the expected canonical URL?
	// (checking now to allow "hosted" locations to be prod)
	if (URLⵧCANONICAL) {
		const URLⵧCANONICAL‿obj = new URL(URLⵧCANONICAL)
		if (currentWindow.location.hostname === URLⵧCANONICAL‿obj.hostname) return "prod"
	}

	// then detect common "hosted" locations, which usually means "public but not canonical" = ~staging (YMMV)
	if (currentWindow.location.hostname.endsWith(".netlify.app")) return "staging"
	if (currentWindow.location.hostname.endsWith(".github.io")) return "staging"
	if (currentWindow.location.hostname.endsWith(".vercel.app")) return "staging"
	if (currentWindow.location.hostname.endsWith(".pages.dev")) return "staging" // cloudflare pages
	if (currentWindow.location.hostname.endsWith(".workers.dev")) return "staging" // cloudflare workers
	if (currentWindow.location.hostname.endsWith(".cloudfront.net")) return "staging" // AWS

	// TODO 1D cordova
	// TODO 1D itch.io

	// everything else is unknown = unsafe
	// XXX TODO REVIEW: in "separation of concerns" / "shearing layers" the app may not know its canonical URL (and not care)
	// so 'prod' could be the right answer. esp. if ending with '.com' or '.org'
	return "dev"
}

/////////////////////////////////////////////////

export { inferꓽchannel }
