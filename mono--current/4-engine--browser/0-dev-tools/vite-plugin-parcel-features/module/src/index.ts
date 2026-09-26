/* Parcel features that Vite lacks, so that sources can stay portable between the two bundlers.
 *
 * Currently: image transform directives, ex. `new URL("original.png?as=webp&width=1920", import.meta.url)`
 *
 * Why not vite-imagetools: our asset modules reference images through
 * `new URL(…, import.meta.url)` so the very same source also works in plain node
 * (ex. rendering an image in a capable terminal). Vite handles that pattern in its
 * `vite:asset-import-meta-url` plugin, which resolves the file and emits it directly
 * rather than routing it through `resolveId`/`load` — so NO hook-based image plugin can
 * observe those references, whatever query they carry. vite-imagetools additionally
 * requires static `import`s, which node cannot use for a binary asset.
 *
 * So we rewrite the reference BEFORE Vite's plugin runs, pointing it at a derived file we
 * generate ourselves, and let Vite's own asset pipeline do the serving / hashing / emitting.
 * The sources are never modified, so the node path keeps seeing the original untouched
 * (node's `fileURLToPath` ignores the query, which is what makes the directive inert there).
 */

/////////////////////////////////////////////////

export function pluginꓽparcel_features(): Plugin {
	return {
		name: PLUGIN__NAME,
		// MUST stay ahead of `vite:asset-import-meta-url` — see the note at the top of this file.
		enforce: "pre",
		transform: {
			// Cheap prefilter. Deliberately a plain substring rather than the full regex:
			// an over-narrow filter would make the plugin silently do nothing, which is a nasty failure mode.
			filter: { code: MARKER },
			async handler(code, id) {
				const pathⵧmodule = id.split("?")[0]!
				// virtual module (ex. "\0…"): there is no directory to resolve a relative asset against
				if (!nodeꓽpath.isAbsolute(pathⵧmodule)) return undefined

				const references = parseꓽimage_references(code)
				if (references.length === 0) return undefined

				const dirⵧmodule = nodeꓽpath.dirname(pathⵧmodule)
				const magic = new MagicString(code)

				for (const reference of references) {
					const pathⵧsource = nodeꓽpath.resolve(dirⵧmodule, reference.pathⳇrelative)
					// let Vite report a missing asset exactly as it would without us
					if (!existsSync(pathⵧsource)) continue

					this.addWatchFile(pathⵧsource)

					const pathⵧderived = await _getꓽderived_image__path(pathⵧsource, reference.directives)
					magic.update(reference.start‿index, reference.end‿index, _getꓽspecifier(dirⵧmodule, pathⵧderived))
				}

				if (!magic.hasChanged()) return undefined

				return { code: magic.toString(), map: magic.generateMap({ hires: true, source: id }) }
			},
		},
	}
}

/////////////////////////////////////////////////

// Derives into a gitignored `.cache/` next to the source, and returns the derived file's path.
// That cache is what keeps builds cheap: sharp only runs when the source is newer than its derivative,
// so a full rebuild over many high-res sources costs nothing after the first one.
async function _getꓽderived_image__path(
	pathⵧsource: PathⳇAbsolute,
	directives: ImageDirectives,
): Promise<PathⳇAbsolute> {
	const dirⵧcache = nodeꓽpath.join(nodeꓽpath.dirname(pathⵧsource), DIRⵧcache__name)
	const pathⵧderived = nodeꓽpath.join(dirⵧcache, getꓽderived__name(nodeꓽpath.basename(pathⵧsource), directives))

	if (_isꓽup_to_date(pathⵧsource, pathⵧderived)) return pathⵧderived

	mkdirSync(dirⵧcache, { recursive: true })
	await _writeꓽderived_image(pathⵧsource, pathⵧderived, directives)

	return pathⵧderived
}

function _isꓽup_to_date(pathⵧsource: PathⳇAbsolute, pathⵧderived: PathⳇAbsolute): boolean {
	const statⵧderived = statSync(pathⵧderived, { throwIfNoEntry: false })
	if (!statⵧderived) return false

	return statⵧderived.mtimeMs >= statSync(pathⵧsource).mtimeMs
}

// `withoutEnlargement` matters: several of our sources are NARROWER than the width they ask for,
// and upscaling would waste bytes while invalidating the dimensions declared next to them.
// `fit: "inside"` keeps the aspect ratio when only one dimension is given.
async function _writeꓽderived_image(
	pathⵧsource: PathⳇAbsolute,
	pathⵧderived: PathⳇAbsolute,
	{ format, width, height, quality }: ImageDirectives,
): Promise<void> {
	const pipeline = sharp(pathⵧsource)
	const resized =
		width === undefined && height === undefined
			? pipeline
			: pipeline.resize({ width, height, fit: "inside", withoutEnlargement: true })

	await resized.toFormat(format, { quality }).toFile(pathⵧderived)
}

// Vite resolves the rewritten specifier like any other relative asset reference,
// so it must stay relative and posix-separated whatever the host OS.
function _getꓽspecifier(dirⵧmodule: PathⳇAbsolute, pathⵧderived: PathⳇAbsolute): string {
	const ǃ = assert_from({ _getꓽspecifier })

	const relative = nodeꓽpath.relative(dirⵧmodule, pathⵧderived).split(nodeꓽpath.sep).join("/")
	ǃ.forⵧvalue({ relative }).assert(!!relative && !nodeꓽpath.isAbsolute(relative), `should be a relative specifier`)

	return relative.startsWith(".") ? relative : `./${relative}`
}

/////////////////////////////////////////////////

const PLUGIN__NAME = "parcel-features"

// gitignored repo-wide (see /.gitignore), and already swept by `monorepo-script--clean-package …cache`
const DIRⵧcache__name = ".cache"

const MARKER = "import.meta.url"

/////////////////////////////////////////////////

export * from "./image-directives.ts"

/////////////////////////////////////////////////

import { existsSync, mkdirSync, statSync } from "node:fs"
import * as nodeꓽpath from "node:path"

import MagicString from "magic-string"
import sharp from "sharp"
import type { Plugin } from "vite"

import { assert_from } from "@monorepo-private/assert"
import type { PathⳇAbsolute } from "@monorepo-private/ts--types"

import { type ImageDirectives, getꓽderived__name, parseꓽimage_references } from "./image-directives.ts"
