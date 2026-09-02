import * as RichText from "@monorepo-private/rich-text-format"
import type { SemVer } from "@monorepo-private/ts--types"
import { getꓽscheme_specific_part, normalizeꓽuri‿str } from "@monorepo-private/ts--types--hypermedia"

import {
	type OHAHyperMedia,
	type OHAHyperActionBlueprint,
	type OHAHyperAction,
	type OHAPendingEngagement,
	type OHAHyperLink,
	type OHARichTextHints,
	OHALinkRelation,
} from "../../01-types/types.ts"
import type { OHAServer } from "../../30-server/types.ts"

/////////////////////////////////////////////////

function backend() {
	return {
		async ↆgetꓽproducts(): Promise<Record<string, SemVer>> {
			return {
				Webstorm: "2024.3.5",
				"JetBrains Gateway": "2024.3.2",
				"IntelliJ IDEA": "2024.3.5",
			}
		},
	}
}

/////////////////////////////////////////////////

function createꓽserver(): OHAServer {
	const ↆget: OHAServer["ↆget"] = async (url = "/") => {
		////////////
		const { path, query, fragment } = getꓽscheme_specific_part(url)

		////////////
		// prepare aggregation
		let $builder = RichText.fragmentⵧblock() // "block" bc maps to a ~frame/sub-browser

		const links: OHARichTextHints["links"] = {
			[OHALinkRelation.self]: normalizeꓽuri‿str(path), // intentionally strip query & path until considered relevant
			[OHALinkRelation.home]: URIꘌROOT, // could be DEFAULT_ROOT_URI or sth else, ex. /user/:xyz/savegame/:xyz/
		}

		const actions: OHARichTextHints["actions"] = {}

		const engagements: OHARichTextHints["engagements"] = []

		////////////

		// TODO recursive routing
		const data = await backend().ↆgetꓽproducts()

		$builder.pushHeading("Installed")

		const _products = RichText.listⵧordered()
		Object.entries(data).forEach(([name, version]) => {
			const $name = RichText.fragmentⵧinline(name).addHints({}).done()
			const $version = RichText.weak(`v${version}`)
				.addHints({
					underlying: version,
				})
				.done()
			_products.pushRawNode(
				RichText.fragmentⵧinline()
					.pushNode($name, { id: "name" })
					.pushText(" ")
					.pushNode($version, { id: "version" })
					.done(),
				{ id: name },
			)
		})

		$builder.pushNode(_products.done())

		links["faq"] = "https://jb.gg/toolbox-app-faq"

		actions["check-for-updates"] = {
			key: "check-for-updates",

			input: {
				os: { type: "env--os" },
				arch: { type: "env--arch" },
			},

			hints: {
				change: "none",
			},

			feedback: {
				tracking: "background",
				//traits: [ 'loader' ],
				summary: "Checking for updates…", // TODO
			},
		}

		////////////
		// wrap together
		$builder.addHints<OHARichTextHints>({
			links,
			actions,
			engagements,
		})

		return $builder.done()
	}

	const dispatch: OHAServer["dispatch"] = async (action) => {
		console.log(`Server: asked to dispatch action…`, action)

		// TODO return engagement pending action
		throw new Error(`Not implemented!`)
	}

	return {
		ↆget,
		dispatch,
	}
}

/////////////////////////////////////////////////

export { createꓽserver }
