import {
	type OHARichTextHints,
	type OHAServer,
	type OHAStory,
	type OHAHyperActionBlueprint,
	type OHAFeedback,
	OHALinkRelation,
} from "@monorepo-private/ohateoas"
import * as RichText from "@monorepo-private/rich-text-format"
import type { SemVer } from "@monorepo-private/ts--types"
import { normalizeꓽuri‿str, getꓽscheme_specific_part } from "@monorepo-private/ts--types--hypermedia"

/////////////////////////////////////////////////

// In this demo, the state is LOCAL
const state = {
	Webstorm: { installed: "2024.3.5", latest: undefined as SemVer | undefined },
	"JetBrains Gateway": { installed: "2024.3.2", latest: undefined as SemVer | undefined },
	"IntelliJ IDEA": { installed: "2024.3.5", latest: undefined as SemVer | undefined },
}

function backend() {
	return {
		async ↆgetꓽproducts() {
			return state
		},
	}
}

/////////////////////////////////////////////////

const URIꘌROOT = normalizeꓽuri‿str("")

function createꓽserver(): OHAServer {
	const ↆget: OHAServer["ↆget"] = async (url = URIꘌROOT) => {
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

		$builder.pushHeading("Toolbox").pushText("Installed products:")

		const _products = RichText.listⵧordered()
		Object.entries(data).forEach(([name, version_info]) => {
			const { installed: versionⵧinstalled, latest: versionⵧlatest } = version_info

			const $name = RichText.fragmentⵧinline(name).addHints({}).done()

			const $version = (() => {
				const builder = RichText.fragmentⵧinline()

				const $versionⵧcurrent = RichText.weak(`v${versionⵧinstalled}`)
					.addHints({
						underlying: versionⵧinstalled,
					})
					.done()

				builder.pushNode($versionⵧcurrent, { id: "current" })

				if (versionⵧlatest && versionⵧinstalled !== versionⵧlatest) {
					const $versionⵧlatest = RichText.weak(`v${versionⵧlatest}`)
						.addHints({
							underlying: versionⵧlatest,
						})
						.done()
					builder.pushText(" → ")
					builder.pushNode($versionⵧlatest, { id: "latest" })
					builder.pushText(" ")
					builder.pushStrong("What’s new?") // should be a link
				}

				return builder.done()
			})()

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

		links["faq"] = {
			href: "https://jb.gg/toolbox-app-faq",
			target: "_help",
		}

		actions["check-for-updates"] = {
			type: "check-for-updates",

			input: {
				os: { type: "env--os" },
				arch: { type: "env--arch" },
			},

			hints: {
				change_type: "update",
			},

			feedback: {
				tracking: "background",
				story: "Checking for updates...",
			} as OHAFeedback,
		} as OHAHyperActionBlueprint

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

		switch (action.type) {
			case "check-for-updates": {
				// fake a call to a remote server
				return new Promise<OHAStory>((resolve) => {
					// pretend work
					setTimeout(() => {
						if (state.Webstorm.latest !== "2025.1") {
							state.Webstorm.latest = "2025.1"
							resolve({
								message: "Updates found!",
							} as OHAStory)
						} else {
							resolve({
								message: "No updates available",
							} as OHAStory)
						}
					}, 2000)
				})
			}
			default:
				throw new Error(`Unknown action type "${action.type}"!`)
		}
	}

	return {
		ↆget,
		dispatch,
	}
}

/////////////////////////////////////////////////

export { createꓽserver }
