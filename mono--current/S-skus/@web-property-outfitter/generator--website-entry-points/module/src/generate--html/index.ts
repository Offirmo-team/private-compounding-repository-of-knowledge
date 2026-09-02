// Reminder: code will be prettified, no need to indent or format it.
// put the comments in the code, it's up to the consumer to optimize or not

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import {
	getꓽbasenameⵧindexᐧhtml,
	getꓽbasenameⵧaboutᐧhtml,
	getꓽbasenameⵧcontactᐧhtml,
	getꓽbasenameⵧerrorᐧhtml,
	getꓽbasenameⵧprivacy_policyᐧhtml,
	getꓽbasenameⵧsupportᐧhtml,
	getꓽbasenameⵧterms_and_conditionsᐧhtml,
	getꓽdirⵧfiles_to_serve,
} from "../selectors/index.ts"
import type { WebPropertySpec, FilesMap } from "../types.ts"

import generateꓽaboutᐧhtml from "./about/index.ts"
import generateꓽcontactᐧhtml from "./contact/index.ts"
import generateꓽindexᐧhtml from "./index-html/index.ts"
import generateꓽ404ᐧhtml from "./page--404/index.ts"
import generateꓽerrorᐧhtml from "./page--error/index.ts"
import generateꓽprivacy_policyᐧhtml from "./page--privacy-policy/index.ts"
import generateꓽsupportᐧhtml from "./page--support/index.ts"
import generateꓽterms_and_conditionsᐧhtml from "./page--terms-and-conditions/index.ts"
import { getꓽhtml_doc_spec } from "./pages--common/selectors.ts"

/////////////////////////////////////////////////

function generateꓽerror_handling(spec: Immutable<WebPropertySpec>): FilesMap {
	if (spec.isꓽcatching_all_routes) return {}

	const needsꓽerrorᐧhtml = !spec.host || spec.host === "aws--cloudfront"
	const needsꓽ404ᐧhtml = !spec.host || !needsꓽerrorᐧhtml

	return {
		...(needsꓽerrorᐧhtml && {
			[`${getꓽdirⵧfiles_to_serve(spec)}/${getꓽbasenameⵧerrorᐧhtml(spec)}`]: generateꓽerrorᐧhtml(spec),
		}),
		...(needsꓽ404ᐧhtml && { [`${getꓽdirⵧfiles_to_serve(spec)}/404.html`]: generateꓽ404ᐧhtml(spec) }),
	}
}

function generateꓽcomplimentary(spec: Immutable<WebPropertySpec>): FilesMap {
	if (spec.isꓽcatching_all_routes) {
		// TODO review, could be more complex than that, ex. priorities to assets
		return {}
	}

	// ex. footer https://clerk.com/blog/zod-fellowship
	return {
		/////// technical
		...generateꓽerror_handling(spec),

		/////// Resources
		// TODO changelog

		/////// Org/Company details
		[`${getꓽdirⵧfiles_to_serve(spec)}/${getꓽbasenameⵧaboutᐧhtml(spec)}`]: generateꓽaboutᐧhtml(spec),
		// TODO careers
		// TODO blog
		[`${getꓽdirⵧfiles_to_serve(spec)}/${getꓽbasenameⵧsupportᐧhtml(spec)}`]: generateꓽsupportᐧhtml(spec),
		[`${getꓽdirⵧfiles_to_serve(spec)}/${getꓽbasenameⵧcontactᐧhtml(spec)}`]: generateꓽcontactᐧhtml(spec),
		// TODO brand assets

		/////// Legal
		[`${getꓽdirⵧfiles_to_serve(spec)}/${getꓽbasenameⵧterms_and_conditionsᐧhtml(spec)}`]:
			generateꓽterms_and_conditionsᐧhtml(spec),
		// TODO Terms of engagement = support <=> users
		[`${getꓽdirⵧfiles_to_serve(spec)}/${getꓽbasenameⵧprivacy_policyᐧhtml(spec)}`]: generateꓽprivacy_policyᐧhtml(spec),
		// TODO Data Processing Addendum
		// TODO cookie management
	}
}

function generate(spec: Immutable<WebPropertySpec>): FilesMap {
	return {
		[`${getꓽdirⵧfiles_to_serve(spec)}/${getꓽbasenameⵧindexᐧhtml(spec)}`]: generateꓽindexᐧhtml(spec),

		"~~logs/spec.html.json": JSON.stringify(getꓽhtml_doc_spec(spec), undefined, "	"),

		...generateꓽcomplimentary(spec),
	}
}

/////////////////////////////////////////////////

export default generate
