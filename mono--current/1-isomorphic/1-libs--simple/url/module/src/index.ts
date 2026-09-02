import { assert_from } from "@monorepo-private/assert"
import type { Url‿str } from "@monorepo-private/ts--types--hypermedia"

/////////////////////////////////////////////////

// https://en.wikipedia.org/wiki/UTM_parameters
interface UtmParams {
	utm_source?: string // who sent the traffic (e.g. 'newsletter', 'google')
	utm_medium?: string // marketing channel (e.g. 'email', 'cpc', 'social')
	utm_campaign?: string // campaign name or promo
	utm_term?: string // paid search keyword
	utm_content?: string // differentiates ads/links within same campaign
}

/////////////////////////////////////////////////

function addꓽutm_params(url: Url‿str, params: UtmParams): Url‿str {
	const ǃ = assert_from({ addꓽutm_params })
	const provided = Object.values(params).filter((v) => v !== undefined)
	ǃ.forⵧparam({ params }).require(provided.length > 0, "at least one UTM param must be provided")

	const result = new URL(url)

	const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const
	for (const key of UTM_KEYS) {
		if (params[key] !== undefined) result.searchParams.set(key, params[key]!)
	}

	return result.toString()
}

/////////////////////////////////////////////////

export type { UtmParams }

export { addꓽutm_params }
