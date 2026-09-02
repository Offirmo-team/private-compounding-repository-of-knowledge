// https://parceljs.org/plugin-system/resolver/

import * as path from "node:path"
import { fileURLToPath } from "node:url"

import { Resolver } from "@parcel/plugin"

import { assert_from, assert } from "@monorepo-private/assert"

const LIB = "@monorepo-private/parcel-resolver"
const DEBUG = false

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const POSSIBLY_UNRESURRECTED_OFFIRMO_MODULES = [
	// cross-cutting
	"@monorepo-private/react--error-boundary",
	"@monorepo-private/rich-text-format--to-react",
	"@monorepo-private/soft-execution-context--browser",
	"@monorepo-private/practical-logger--browser",
	"@monorepo-private/universal-debug-api--browser",
]

export default new Resolver({
	async resolve(params) {
		if (DEBUG) {
			console.warn(`[${LIB}] ACTIVATING 😓`) // sad to reach this code bc this plugin is a hack
			console.log(`[${LIB}] params=`, params)
			const { specifier, specifierType, sourcePath, resolveFrom } = params.dependency
			console.log(`[${LIB}] Dependency=`, { specifier, specifierType, sourcePath, resolveFrom })
		}

		if (params.specifier?.endsWith(".js")) {
			DEBUG && console.log(`[${LIB}] Evaluating remapping js → ts…`)

			const parsed = path.parse(params.specifier)
			const ts = path.join(parsed.root, parsed.dir, parsed.name + ".ts")
			DEBUG && console.log(`[${LIB} Remapping to=`, ts)
			assert(params.dependency.resolveFrom, `Expecting params.dependency.resolveFrom!`)
			const realFrom = path.parse(params.dependency.resolveFrom).dir
			const filePath = path.resolve(realFrom, ts)
			DEBUG && console.log(`[${LIB} Resolving to=`, filePath)

			if (DEBUG) {
				// Parcel error output hides the latest lines
				for (let i = 0; i < 20; ++i) console.log("-")
				await new Promise((resolve) => setTimeout(resolve, 5000))
			}

			return { filePath }
		}

		if (params.dependency.sourcePath?.endsWith(".css") || params.dependency.sourcePath?.endsWith(".html")) {
			DEBUG && console.log(`[${LIB}] Evaluating assisting loading npm modules from CSS…`)
			// import of modules in CSS used to need the `npm:` prefix if Parcel
			// but vite doesn't need it: In this case, it's easier to tweak Parcel than vite:

			if (params.specifier.startsWith("@monorepo")) {
				// this is a module, our stuff
				const filePath = import.meta.resolve(params.specifier)
				return { filePath }
			}
		}

		if (POSSIBLY_UNRESURRECTED_OFFIRMO_MODULES.includes(params.specifier)) {
			DEBUG && console.log(`[${LIB}] Evaluating faking an un-resurrected Offirmo module…`)

			// https://parceljs.org/plugin-system/resolver/#virtual-modules
			return {
				filePath: path.resolve(__dirname, `index.ts`),
				code: `throw new Error('This module is not yet resurrected!')`,
			}
		}

		// no match, let the next resolver in the pipeline handle this dependency.
		// Since this plugin is a "last resort", this will very likely cause a failure:

		if (true || DEBUG) {
			console.error("@monorepo-private/parcel-resolver ABOUT TO FAIL")
			console.error("Params=", params)
			const { specifier, specifierType, sourcePath, resolveFrom } = params.dependency
			console.error("Dependency=", { specifier, specifierType, sourcePath, resolveFrom })
		}

		return null
	},
})
