/////////////////////////////////////////////////

const MANIFEST‿basename = "MANIFEST.json5"

const PURE_MODULE_CONTENT_RELPATH = "module" // for now

/////////////////////////////////////////////////

// TODO remove migration! (should no longer be needed)
// TODO review entirely: makes opinionated decisions

const indent = ""
const debug_pkg = "x" // "@infinite-monorepo/pkg-infos-resolver"

export async function updateⵧfrom_files(
	_details: Immutable<PureModuleDetails>,
	state: Immutable<State>,
): Promise<Immutable<PureModuleDetails>> {
	const {
		pkg_infos_resolver,
		specⵧroot: { namespace, namespaceⵧprivate },
	} = state

	const fqname = getꓽfqname(_details)

	// make it partially mutable
	let details = {
		..._details,
	}

	console.log(`${indent}🗂  updating pure module "${fqname}"' details from "${details.root‿abspath}"…`)

	const root‿abspath = path.join(details.root‿abspath, PURE_MODULE_CONTENT_RELPATH)
	const file_pathes = await _walk_files_NotGitIgnored(root‿abspath)

	const file_entries: Array<FileEntry> = file_pathes.map((path‿abs) => createꓽfile_entry(path‿abs, root‿abspath))
	console.log(`${indent} found #${file_entries.length} file(s)…`)

	// init from the manifest
	// must be done as early as possible
	const entryⵧmanifest: FileEntry = await (async () => {
		const candidate = file_entries.find(({ basename }) => basename === MANIFEST‿basename)
		if (candidate) return candidate

		// MIGRATION
		// NOTE: yes, this is a side effect in a read function, but it's a good one 😅
		// needed. build it from existing package.json
		const package_json_path = path.dirname(root‿abspath) + "/package.json"
		let packageᐧjson: any = "{}"
		try {
			packageᐧjson = fs.readFileSync(package_json_path, { encoding: "utf-8" })
		} catch (err) {
			// it's totally ok to not have a package.json
			// ex. brand-new package
		}
		packageᐧjson = JSON.parse(packageᐧjson)

		const manifest_data: any = (() => {
			if (Object.keys(packageᐧjson).length === 0) return {}
			if (state.specⵧroot.mode === "SSoT") return {}

			throw new Error(`Not implemented!`)
			/*
			const status = packageᐧjson.name?.includes("sandbox") ? "sandbox" : "stable"

			const [namespace = undefined, name = undefined] = packageᐧjson.name?.split("/") || []

			return {
				...(namespace !==
					inferꓽnamespace({
						...details,
						isꓽpublished: !packageᐧjson.private,
					}) && { namespace }),
				...(name !== details.name && { name }),
				...(packageᐧjson.license !== details.license && { license: packageᐧjson.license }),
				...(packageᐧjson.version !== "0.0.1" && { version: packageᐧjson.version }),
				description: packageᐧjson.description || "TODO description in MANIFEST.json5",
				...(!packageᐧjson.private && { isꓽpublished: true }),
				...(packageᐧjson.sideEffects && { hasꓽside_effects: true }),
				...(status !== "stable" && { status }),
			}*/
		})()

		const target_path = path.resolve(root‿abspath, MANIFEST‿basename)
		await write_json_file(target_path, manifest_data)
		return createꓽfile_entry(target_path, root‿abspath)
	})()
	const _manifest = JSON5.parse(fs.readFileSync(entryⵧmanifest.path‿abs, "utf8"))
	details = DetailsLib.updateⵧfrom_manifest(details, _manifest)

	if (fqname === debug_pkg) {
		debugger
	}

	/////////////////////////////////////////////////
	// start aggregating:

	if (!details.namespace) {
		details = DetailsLib.updateꓽnamespace(details, details.isꓽpublished ? namespace : namespaceⵧprivate)
	}

	const pending_promises: Array<Promise<void>> = []

	/////////////////////////////////////////////////
	// HERE MAIN LOOP
	file_entries.forEach((entry) => {
		let isꓽignored = isꓽin_ignored_folder(entry) || isꓽignored_file(entry)
		const { path‿rel } = entry
		console.log(
			`${indent} ↳ 📄`,
			path‿rel,
			isꓽignored ? "🚫" : "",
			//entry.extⵧsub, entry.ext, entry.extⵧextended,
		)

		if (!isꓽignored) {
			assertꓽmigrated(entry, { root‿abspath })
			isꓽignored = isꓽignored_file(entry) // update bc can become ignored after migration
			if (isꓽignored) console.log(`${indent}      migrated, now 🚫`)
		}

		if (isꓽignored) {
			return
		}

		// order is important!

		const demo_entrypoint‿score = getꓽentrypointⵧdemo__affinity‿score(entry)
		if (demo_entrypoint‿score) {
			const previous_candidate_score = getꓽentrypointⵧdemo__affinity‿score(details.entrypointⵧdemo)
			if (compareꓽscores(previous_candidate_score, demo_entrypoint‿score) < 0) {
				// "A should come before B"
				// keep previous
			} else {
				console.log(`${indent}    ⭐️new candidate for: demo entry point`)
				details.entrypointⵧdemo = entry
			}
		}

		const sandbox_entrypoint‿score = getꓽentrypointⵧsandbox__affinity‿score(entry)
		if (sandbox_entrypoint‿score) {
			const previous_candidate_score = getꓽentrypointⵧsandbox__affinity‿score(details.entrypointⵧsandbox)
			if (compareꓽscores(previous_candidate_score, sandbox_entrypoint‿score) < 0) {
				// "A should come before B"
				// keep previous
			} else {
				console.log(`${indent}    ⭐️new candidate for: sandbox entry point`)
				details.entrypointⵧsandbox = entry
			}
		}

		if (isꓽin_unstructured_folder(entry)) {
			// no more analysis
			return
		}

		assertꓽnormalized(entry)

		if (entry.basenameⵧsemantic‿no_ᐧext === "storypad" && entry.ext === ".html") {
			console.log(`${indent}    ⭐️new candidate for: storypad`)
			details.entrypointⵧstorypad = entry
		}

		if (isꓽentrypointⵧbuild(entry)) {
			console.log(`${indent}    ⭐️new build entry point`)
			details.entrypointsⵧbuild[entry.basenameⵧsemantic‿no_ᐧext] = entry
		}

		if (
			!demo_entrypoint‿score &&
			!sandbox_entrypoint‿score &&
			!isꓽentrypointⵧbuild(entry) &&
			details.entrypointⵧstorypad !== entry
		) {
			const main_entrypoint‿score = getꓽentrypointⵧmain__affinity‿score(entry)
			//console.log(main_entrypoint‿score)
			if (main_entrypoint‿score) {
				const previous_candidate_score = getꓽentrypointⵧmain__affinity‿score(details.entrypointⵧmain)
				//console.log(previous_candidate_score)
				if (compareꓽscores(previous_candidate_score, main_entrypoint‿score) < 0) {
					// "A should come before B"
					// keep previous
				} else {
					console.log(`${indent}    ⭐️new candidate for: main entry point`)
					details.entrypointⵧmain = entry
				}
			}
		}

		if (entry.basename === MANIFEST‿basename) {
			if (entry !== entryⵧmanifest) throw new Error(`Multiple MANIFEST files found!`)
			return
		}

		const langs = getꓽProgLangs(entry)
		console.log(`${indent}    langs: ${langs.join(", ")}`)
		langs.forEach((lang) => details.languages.add(lang))
		let content: string | undefined = undefined
		const unprocessed_langs = new Set(langs)
		if (langs.includes("js") || langs.includes("ts")) {
			unprocessed_langs.delete("js")
			unprocessed_langs.delete("ts")
			content ||= fs.readFileSync(entry.path‿abs, "utf8")
			const dep_type = inferꓽdeptype_from_caller(entry)
			console.log(`${indent}      inferred as: ${dep_type}`)

			const imports = parseImports(content)
			imports.forEach(({ name: dependency_name, type }) => {
				console.log(`${indent}    ↘ import ${type === 1 ? "type " : ""}${dependency_name}`)
				assert(!dependency_name.startsWith("npm:"), `Unexpected "npm:" URL scheme in import!`)

				if (isBuiltInNodeModule(dependency_name)) {
					// TODO add engine node?
					if (langs.includes("ts")) {
						details = DetailsLib.addꓽdependency(details, "@types/node", { type: "dev" })
					}
					// TODO 1D express dependency to a runtime?
					return
				}

				if (dependency_name === details.fqname) {
					// self-reference
					// this is allowed, no need to declare it as dep
					return
				}

				switch (type ?? 1) {
					case 0: {
						console.log(`${indent}    ↘ adding dep ${dependency_name} as ${dep_type}`)
						details = DetailsLib.addꓽdependency(details, dependency_name, { type: dep_type })
						break
					}

					case 1:
						// types are needed in dev only
						// even if published as pure TS module, node type stripping will remove those deps in prod
						console.log(`${indent}    ↘ adding dep ${dependency_name} as dev`)
						details = DetailsLib.addꓽdependency(details, dependency_name, { type: "dev" })
						break

					default:
						throw new Error(`Unknown import type "${type}"!`)
				}

				if (langs.includes("ts")) {
					pending_promises.push(
						pkg_infos_resolver.ↆgetꓽextra_typings_pkg_name_if_any_for(dependency_name).then((pkg_name) => {
							if (pkg_name) {
								console.log(`${indent}      ↳ found @types/ package for "${dependency_name}", auto-adding…`)

								details = DetailsLib.addꓽdependency(details, pkg_name, {
									type: "dev",
								})
							}
						}),
					)
				}
			})
		}
		if (langs.includes("html")) {
			unprocessed_langs.delete("html")
			// TODO one day use parcel or ox-parse to track deps

			// TODO re-implement
			/*
			console.log(`${indent}    ↘ auto-dep to @monorepo-private/toolbox--parcel`)
			raw_deps.push({ label: "@monorepo-private/toolbox--parcel", type: "dev" })
			console.log(`${indent}    ↘ auto-dep to @monorepo-private/toolbox--vite`)
			raw_deps.push({ label: "@monorepo-private/toolbox--vite", type: "dev" })
			*/
		}
		if (langs.includes("css")) {
			unprocessed_langs.delete("css")
			//throw new Error(`CSS imports detection not implemented!`)
			// TODO one day use parcel
		}
		if (langs.includes("jsx")) {
			unprocessed_langs.delete("jsx")
			// need a jsx transform.
			// Parcel does it for us.
		}
		if (langs.includes("tsx")) {
			unprocessed_langs.delete("tsx")
			// need a jsx transform.
			// Parcel does it for us.
		}
		// TODO read tsconfig .json and add deps extend
		// non-analyzable (txt, json) should not make it there = ignored
		if (unprocessed_langs.size) {
			throw new Error(`Unknown language(s) "${Array.from(unprocessed_langs).join(", ")}" for "${entry.basename}"!`)
		}

		if (entry.extⵧsub === ".tests") {
			details.hasꓽtestsⵧunit = true
		}
		if (entry.extⵧsub === ".evals") {
			details.hasꓽtestsⵧevals = true
		}
		if (entry.extⵧsub === ".stories") {
			details.hasꓽstories = true
		}
		// TODO more test types
		if (entry.basename‿no_ᐧext === "_entrypoint") {
			content ||= fs.readFileSync(entry.path‿abs, "utf8")
			const first_line = content.trim().split("\n").at(0)!.trim()
			let id = first_line
			if (id.startsWith("//")) {
				id = id.slice(2).trim()
			}
			console.log(`${indent}    ⭐️new sub entry point "${id}"`)
			assert(
				!details.entrypointⵧexports[id],
				`entrypointⵧexports[${id}] should not already exist! (file ${entry.path‿rel}, previous ${details.entrypointⵧexports[id]?.path‿rel})`,
			)
			details.entrypointⵧexports[id] = entry
		}
	})

	await Promise.all(pending_promises)
	await Promise.resolve() // needed?

	if (fqname === debug_pkg) {
		debugger
	}

	/////////////////////////////////////////////////

	if (!details.entrypointⵧmain) {
		// it's ok to have no main, e.g. TS config packages

		if (details.entrypointⵧsandbox) {
			// happens in:
			// - pure sandbox fake packages, which don't really need a main
			// - early stage packages
			/* TODO review
			details.entrypointⵧmain ??= details.entrypointⵧsandbox
			details.status =
				details.status === "stable"
					? details.name.toLowerCase().includes("sandbox")
						? "sandbox"
						: "tech-demo"
					: details.status
			 */
		}
	}

	details.isꓽapp = details._manifest.isꓽapp ?? false // ?? module_path.includes("sandbox") || details.entrypointⵧexports['.']?.ext === ".html")

	// inits
	if (details.target === "browser" && details.hasꓽstories && !details.entrypointⵧstorypad) {
		// auto-create storypad in the right place
		const storypad__path = path.resolve(root‿abspath, "__fixtures", "storypad")
		const storypad__content = `
<!DOCTYPE html>

<script type="module">
	import startꓽstorypad from '@monorepo-private/storypad'
	import decoratorⵧdiagnostics from '@monorepo-private/storypad/decorators/diagnostics'
	import nearest_pkg from '../../../package.json'

	const DEBUG = false

	// important to load async so that the stories don't pollute the global scope too early (ex. before SXC)
	const stories = import.meta.glob('../../**/*.stories.(js|jsx|ts|tsx|mdx)')
	if (DEBUG) console.log('BOOTSTRAP stories', {
		stories,
	})

	startꓽstorypad(
		{
			'own': stories,
		},
		{
			root_title: nearest_pkg?.name,
			decorators: [
				/*(story) => {
					import('@monorepo-private/css--foundation')
					return story
				},*/
				decoratorⵧdiagnostics
			]
		}
	)
</script>
`
		fs.mkdirSync(storypad__path, { recursive: true })
		fs.writeFileSync(path.resolve(storypad__path, "index.html"), storypad__content, { encoding: "utf-8" })
		details.entrypointⵧstorypad = createꓽfile_entry(path.resolve(storypad__path, "index.html"), root‿abspath)
	}

	// TODO clarify
	details.author = "Offirmo <offirmo.net@gmail.com> (https://www.offirmo.net/)"

	details = DetailsLib.reconcile(details)

	if (fqname === debug_pkg) {
		debugger
	}

	return details
}

/////////////////////////////////////////////////

function getꓽProgLangs(entry: FileEntry): ProgrammingLanguage[] {
	const { ext } = entry
	switch (true) {
		case [".js", ".mjs"].includes(ext): // mjs cjs intentionally not supported (legacy) TODO remove mjs when mocha chai done
			return ["js"]

		case [".jsx"].includes(ext):
			return ["js", "jsx"]

		case [".json", ".jsonc", ",json5"].includes(ext):
			return ["json"]

		case [".ts"].includes(ext): // mts sometimes needed for node scripts
			return ["ts"] // TODO REVIEW should we add js? Technically true...

		case [".tsx"].includes(ext):
			return ["ts", "tsx"]

		case [".html"].includes(ext):
			return ["html"]

		case [".css"].includes(ext):
			return ["css"]

		case [".md"].includes(ext):
			return ["md"]

		case [".mdx"].includes(ext):
			return ["md", "jsx"]

		default:
			console.error(entry)
			throw new Error(`Unsupported language for extension "${ext}" (${entry.basename})!`)
	}
}

/////////////////////////////////////////////////

function assertꓽmigrated(entry: FileEntry, { root‿abspath }: { root‿abspath: PathⳇAbsolute }): void {
	let migration_target: PathⳇAbsolute | null = null

	const { path‿abs, basename‿no_ᐧext, ext, extⵧextended } = entry

	if (basename‿no_ᐧext.endsWith("_spec")) {
		migration_target = path‿abs.replace("_spec", ".tests")
	} else if (extⵧextended.startsWith(".spec")) {
		migration_target = path‿abs.replace(".spec", ".tests")
	}

	if (basename‿no_ᐧext.toUpperCase() === "LICENSE" && ext) {
		migration_target = path.join(path.dirname(entry.path‿abs), "LICENSE") // official name is uppercase without extension TODO link
	}

	if ([".cjs", ".cts", ".htm", ".markdown"].includes(ext)) {
		console.log(`Please normalize this file:`)
		throw new Error(`Using outdated extension "${ext}"!`)
	}

	if (migration_target) {
		console.log(`Auto normalizing file:`)
		console.log(`mv "${path.relative(root‿abspath, path‿abs)}" "${path.relative(root‿abspath, migration_target)}"`)
		fs.renameSync(path‿abs, migration_target)

		updateꓽfile_entry(entry, migration_target, root‿abspath)
	}
}

function assertꓽnormalized(entry: FileEntry): void {
	if (entry.path‿rel.includes(" ")) {
		throw new Error(`Spaces in path!`)
	}
	if (entry.extⵧextended.toLowerCase() !== entry.extⵧextended) {
		throw new Error(`Non-lowercase extension!`)
	}

	// TODO UTF-8 etc
}

/////////////////////////////////////////////////

function getꓽtrailing_score(entry: FileEntry): NonNullable<Score> {
	const score: NonNullable<Score> = []

	// ~~ are lowest
	score.push(
		entry.path‿rel.includes("~~")
			? 2
			: // __ are debug stuff, also low
				entry.path‿rel.includes("__")
				? 1
				: 0,
	)

	// top in the dir structure wins
	score.push(entry.path‿rel.split(SEP).length)

	// then index wins over other / derived
	score.push(
		(() => {
			let score_unit = 0

			if (entry.basename‿no_ᐧext === "index") return score_unit
			score_unit++

			if (!entry.extⵧsub) {
				// roots are before their derived
				return score_unit
			}
			score_unit++

			return score_unit
		})(),
	)

	// then shortest path wins
	score.push(entry.basename‿no_ᐧext.length)

	// then some extension wins over some other
	score.push(
		(() => {
			let score_unit = 0

			if ([".html"].includes(entry.ext)) {
				// html contains js / css, it has a slightly higher priority
				return score_unit
			}
			score_unit++

			if ([".ts", ".tsx", ".js", ".jsx"].includes(entry.ext)) {
				// js/ts  contain css, it has a slightly higher priority
				return score_unit
			}
			score_unit++

			return score_unit
		})(),
	)

	return score
}

function hasꓽentrypoint_affinity(entry: FileEntry | undefined): boolean {
	if (!entry) return false

	if (entry.basename‿no_ᐧext === "MANIFEST") return false
	if (entry.extⵧsub) return false // derived files obviously can't be entry points

	// TODO reevaluate css
	if (![".ts", ".tsx", ".js", ".mjs", ".html", ".css"].includes(entry.ext)) return false

	return true
}

function getꓽentrypointⵧmain__affinity‿score(entry: FileEntry | undefined): Score {
	if (!entry) return null

	if (!hasꓽentrypoint_affinity(entry)) return null

	if (entry.basename‿no_ᐧext === "_entrypoint") {
		// those are sub-entrypoints, not the main one
		return null
	}

	/*
	if (entry.path‿rel.includes('__')) {
		// __ are debug stuff, can't be main
		return null
	}*/

	const score: NonNullable<Score> = []

	let score_unit = 0

	// basically the top "index.xyz"

	score_unit++
	if (entry.basename‿no_ᐧext === "index") {
		score.push(score_unit)
		score.push(...getꓽtrailing_score(entry))
		return score
	}

	score_unit++
	score.push(score_unit)
	score.push(...getꓽtrailing_score(entry))

	return score
}

function getꓽentrypointⵧdemo__affinity‿score(entry: FileEntry | undefined): Score {
	if (!entry) return null

	if (!hasꓽentrypoint_affinity(entry)) return null

	if (![".ts", ".js", ".html"].includes(entry.ext)) return null

	if (!entry.path‿rel.includes("demo")) return null

	const score: NonNullable<Score> = []

	score.push(
		(() => {
			let score_unit = 0

			if (entry.basenameⵧsemantic‿no_ᐧext === "demo") {
				return score_unit
			}
			score_unit++

			return score_unit
		})(),
	)

	score.push(...getꓽtrailing_score(entry))

	return score
}

function getꓽentrypointⵧsandbox__affinity‿score(entry: FileEntry | undefined): Score {
	if (!entry) return null

	if (!hasꓽentrypoint_affinity(entry)) return null

	if (![".ts", ".js", ".html"].includes(entry.ext)) return null

	if (!entry.path‿rel.includes("sandbox")) return null

	const score: NonNullable<Score> = []

	score.push(
		(() => {
			let score_unit = 0

			if (entry.basenameⵧsemantic‿no_ᐧext === "sandbox") {
				return score_unit
			}
			score_unit++

			return score_unit
		})(),
	)

	score.push(...getꓽtrailing_score(entry))

	return score
}

function isꓽentrypointⵧbuild(entry: FileEntry | undefined): boolean {
	if (!entry) return false

	if (!hasꓽentrypoint_affinity(entry)) return false

	if (![".ts", ".js", ".bash"].includes(entry.ext)) return false

	if (!entry.path‿rel.includes("++gen")) return false

	return entry.basenameⵧsemantic‿no_ᐧext.startsWith("build")
	/*
	// some path / files have "build" in them without being build scripts
	// ex. builder.ts
	// we require at least one perfectly "build" segment
	const segments = entry.path‿rel.split(SEP).map(s => {
		s = s.trim()
		if (s.startsWith('~~') || s.startsWith('__')) {
			s = s.slice(2).trim()
		}
		return s
	})
	if (!segments.includes('build')) return null

	const score: NonNullable<Score> = []

	score.push((() => {
		let score_unit = 0

		 {
			return score_unit
		}
		score_unit++

		return score_unit
	})())

	score.push(...getꓽtrailing_score(entry))

	return score*/
}

async function _walk_files_NotGitIgnored(dir_path: PathⳇAbsolute): Promise<PathⳇAbsolute[]> {
	/* previous version, not ignoring properly
		https://github.com/npm/ignore-walk/issues/146
		https://github.com/npm/ignore-walk/issues/147
	const v1 = (
		walkNotGitIgnored.sync({
			// https://github.com/npm/ignore-walk
			path: dir_path,
			ignoreFiles: [".ignore", ".gitignore"],
		}) as Array<string>
	)
		.map((p) => path.resolve(dir_path, p))
		.sort()
	*/

	const gitignore = new Gitignore()
	const settings = {
		entryFilter: (e) => {
			if (gitignore.ignoresSync(e.path)) {
				return false
			}
			return e.dirent.isFile()
		},
		deepFilter: (e) => {
			if (gitignore.ignoresSync(e.path)) {
				// prune ignored dirs early
				return false
			}

			// TODO isꓽin_ignored_folder()
			if (e.path.includes("~~")) {
				// prune "out of control" dirs early as well
				// TODO should be more visible in logs?
				return false
			}
			return true
		},
	}
	const files‿Dirent = await fsWalk.walk(dir_path, settings)

	const v2 = files‿Dirent.map(({ path }) => path).sort()

	return v2
}

/////////////////////////////////////////////////

import { strict as assert } from "node:assert"
import * as fs from "node:fs"
import { isBuiltin as isBuiltInNodeModule } from "node:module"
import * as path from "node:path"
import { sep as SEP } from "node:path"

import {
	inferꓽdeptype_from_caller,
	isꓽignored_file,
	isꓽin_ignored_folder,
	isꓽin_unstructured_folder,
} from "@infinite-monorepo/heuristics"
import { getꓽfqname, type PureModuleDetails } from "@infinite-monorepo/package-details"
import * as DetailsLib from "@infinite-monorepo/package-details"
import type { ProgrammingLanguage } from "@infinite-monorepo/primitives"
import type { State } from "@infinite-monorepo/state"
import * as fsWalk from "@nodelib/fs.walk/promises"
import Gitignore from "gitignore-fs"
// @ts-ignore
import JSON5 from "json5"
import { parse as parseImports } from "parse-imports-ts"
import { writeJsonFile as write_json_file } from "write-json-file"

import { type FileEntry, createꓽfile_entry, updateꓽfile_entry } from "@monorepo-private/file-entry"
import type { Immutable, PathⳇAbsolute } from "@monorepo-private/ts--types"
import { type Score, compareꓽscores } from "@monorepo-private/utils--sort"
//import "@typescript/typescript6" // peer dep for "parse-imports-ts"
