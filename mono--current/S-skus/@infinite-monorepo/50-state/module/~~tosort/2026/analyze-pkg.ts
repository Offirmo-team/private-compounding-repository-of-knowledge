import { strict as assert } from "node:assert"
import * as fs from "node:fs"
import { isBuiltin as isBuiltInNodeModule } from "node:module"
import * as path from "node:path"
import { sep as SEP } from "node:path"

// @ts-ignore
import walkNotGitIgnored from "ignore-walk"
// @ts-ignore
import JSON5 from "json5"
import { parse as parseImports } from "parse-imports-ts"
import { writeJsonFile as write_json_file } from "write-json-file"

import { type PureModuleDetails, create as _createꓽresult, updateⵧfrom_manifest } from "@infinite-monorepo/package-details"
import { PkgInfosResolver } from "@infinite-monorepo/pkg-infos-resolver"
import type { ProgLang, Dependency, DependencyType } from "@infinite-monorepo/primitives"
import { type FileEntry, createꓽfile_entry, updateꓽfile_entry } from "@monorepo-private/file-entry"
import { lsDirsSync } from "@monorepo-private/fs--ls"
import type { PathⳇAbsolute, PathⳇAny } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

const MANIFEST‿basename = "MANIFEST.json5"

/////////////////////////////////////////////////

function isꓽin_ignored_folder(entry: FileEntry): boolean {
	const { path‿rel } = entry

	if (path‿rel.includes("node_modules/")) throw new Error(`A pure module should not contain node_modules!`)

	if (path‿rel.includes("tosort")) return true

	// vendored deps are supposed to have no deps
	if (path‿rel.includes("__vendored/")) return true

	return false
}

function isꓽin_unstructured_folder(entry: FileEntry): boolean {
	const { path‿rel } = entry

	if (path‿rel.includes("~~"))
		// means unstructured
		return true

	return false
}

function isꓽignored_file(entry: FileEntry): boolean {
	if (entry.basename === ".DS_Store") {
		// should never happen bc git-ignored at user level
		// but unsupported by  ignore-walk
		// reported: https://github.com/npm/ignore-walk/issues/146
		return true
	}

	if (entry.basename.toUpperCase() === "LICENSE") {
		// license override for a sub-folder, ignore
		return true
	}

	if (entry.basename === ".gitignore") {
		// should never happen bc should be git-ignored
		// but ignore-walk incorrectly lists it
		// reported: https://github.com/npm/ignore-walk/issues/147
		return true
	}

	if (
		[
			// BINARY assets = leaf nodes (no deps)
			".gif",
			".heic",
			".jpg",
			".mp3",
			".otf",
			".png",
			".ttf",
			".webp",
			".woff",
			// do NOT add .svg, this is source code with deps!
		].includes(entry.ext)
	) {
		return true
	}

	if (entry.ext === ".svg") {
		// technically an SVG can
		// - reference resources
		// - embed HTML itself referencing other resources
		// However for now we consider no deps
		// TODO one day use parcel for such cases
		return true
	}

	if (entry.ext === ".md") {
		// technically a markdown file can reference resources
		// ex. static website
		// However for now we consider no deps
		// TODO one day use parcel for such cases
		return true
	}

	if (entry.ext === ".json" || entry.ext === ".jsonc" || entry.ext === ".json5") {
		// technically some json files can reference resources
		// ex. website manifest
		// However for now we consider no deps
		// TODO one day use parcel for such cases
		return true
	}

	if (entry.ext === ".txt") {
		// not recommended vs. better formats such as .md
		// but happens, ex. "well known" files
		return true
	}

	return false
}

function getꓽProgLangs(entry: FileEntry): ProgLang[] {
	const { ext } = entry
	switch (true) {
		case [".js", ".mjs"].includes(ext): // TODO remove mjs, tolerated for node-typescript-compiler
			return ["js"]

		case [".jsx"].includes(ext):
			return ["js", "jsx"]

		case [".json", ".jsonc", ",json5"].includes(ext):
			return ["json"]

		case [".ts"].includes(ext): // mts sometimes needed for node scripts
			return ["ts"] // TODO should we add js? Technically true...

		case [".tsx"].includes(ext):
			return ["ts", "jsx"]

		case [".html"].includes(ext):
			return ["html"]

		case [".css"].includes(ext):
			return ["css"]

		case [".md"].includes(ext):
			return ["md"]

		case [".mdx"].includes(ext):
			return ["md", "jsx"]

		default:
			throw new Error(`Unsupported language for extension "${ext}" (${entry.basename})!`)
	}
}

// examples ? demo?
function inferꓽdeptype_from_caller(entry: FileEntry): DependencyType {
	let { path‿rel, extⵧsub } = entry
	path‿rel = "/" + path‿rel

	if (path‿rel.includes("/__"))
		// temp / technical
		return "dev"

	if (path‿rel.includes("/##"))
		// doc
		return "dev"

	if (path‿rel.includes("/++"))
		// generators
		return "dev"

	if (extⵧsub === ".tests") return "dev"
	if (extⵧsub === ".evals") return "dev"
	if (extⵧsub === ".stories") return "dev"
	if (extⵧsub === ".typecheck") return "dev"

	return "normal"
}

/////////////////////////////////////////////////

function assertꓽmigrated(entry: FileEntry, { indent = "", root‿abspath }: { indent?: string; root‿abspath: PathⳇAbsolute }): void {
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

function assertꓽnormalized(entry: FileEntry, { indent = "" } = {}): void {
	if (entry.path‿rel.includes(" ")) {
		throw new Error(`Spaces in path!`)
	}
	if (entry.extⵧextended.toLowerCase() !== entry.extⵧextended) {
		throw new Error(`Non-lowercase extension!`)
	}

	// TODO UTF-8 etc
}

/////////////////////////////////////////////////
// Scoring. TODO move to dedicated lib

// lower is better
// null
type Score =
	| null // = not even eligible to be scored
	| Array<number> // empty not allowed

function compareꓽscores(score_a: Score, score_b: Score): number {
	assert(score_a !== null || score_b !== null, `At least one score should be eligible!`)

	if (score_a === score_b) return 0

	if (score_b === null) return -1
	if (score_a === null) return +1

	assert(score_a.length > 0, `score should have length! (A)`)
	assert(score_b.length > 0, `score should have length! (B)`)

	return Array.from({ length: Math.max(score_a.length, score_b.length) }).reduce<number>((acc, _, index) => {
		if (acc === 0) {
			try {
				const score_unit_a = score_a[index]
				assert(typeof score_unit_a === "number", `Score comparison should never yield different path on previous equality! (A)`)
				const score_unit_b = score_b[index]
				assert(typeof score_unit_b === "number", `Score comparison should never yield different path on previous equality! (B)`)

				acc = score_unit_a - score_unit_b
			} catch (err) {
				console.error(`compare_scores(…) Error at #${index}!`, err)
				console.log(score_a)
				console.log(score_b)
				throw err
			}
		}

		return acc
	}, 0)
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
}

/////////////////////////////////////////////////

interface Options {
	indent: string
	getꓽdefault_namespace: (details_so_far: PureModuleDetails) => PureModuleDetails["namespace"]
	pkg_infos_resolver: PkgInfosResolver
}

async function getꓽpackage_details(pkg_path: PathⳇAny, options: Partial<Options> = {}): Promise<PureModuleDetails> {
	const { indent = "", getꓽdefault_namespace, pkg_infos_resolver = new PkgInfosResolver() } = options
	console.log(`${indent}🗂  analysing package at "${pkg_path}"…`)

	function getꓽnamespace(details_so_far: PureModuleDetails): PureModuleDetails["namespace"] {
		const path_segments = details_so_far.root‿abspath.split("/")
		const candidate_from_path = path_segments.find((s) => s.startsWith("@"))
		if (candidate_from_path) return candidate_from_path

		if (getꓽdefault_namespace) {
			const candidate = getꓽdefault_namespace(details_so_far)
			if (candidate) return candidate
		}

		return "@monorepo-private"
	}

	const root‿abspath = (() => {
		let p = path.resolve(pkg_path)

		// let's check the 1st level
		const dirs_1stlev = new Set(lsDirsSync(p, { full_path: false }))
		if (dirs_1stlev.has("module")) {
			// it's a pure module
			// TODO 1D only if offirmo
			p = path.join(p, "module")
		}

		return p
	})()
	if (root‿abspath !== pkg_path) console.log(`${indent}   resolved and refined to "${root‿abspath}"…`)

	const files = (
		walkNotGitIgnored.sync({
			// https://github.com/npm/ignore-walk
			path: root‿abspath,
			ignoreFiles: [".ignore", ".gitignore"],
		}) as Array<string>
	)
		.map((p) => path.resolve(root‿abspath, p))
		.sort()
	//const files = lsFilesRecursiveSync(root‿abspath) <- FYI old version

	const file_entries: Array<FileEntry> = files.map((path‿abs) => createꓽfile_entry(path‿abs, root‿abspath))
	console.log(`${indent}   found #${file_entries.length} file(s)…`)

	const result = _createꓽresult(root‿abspath)

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
			// ex. brand new package
		}
		packageᐧjson = JSON.parse(packageᐧjson)

		const data: any = (() => {
			if (Object.keys(packageᐧjson).length === 0) return {}

			const status = packageᐧjson.name?.includes("sandbox") ? "sandbox" : "stable"

			const [namespace = undefined, name = undefined] = packageᐧjson.name?.split("/") || []

			return {
				...(namespace !==
					getꓽnamespace({
						...result,
						isꓽpublished: !packageᐧjson.private,
					}) && { namespace }),
				...(name !== result.name && { name }),
				...(packageᐧjson.license !== result.license && { license: packageᐧjson.license }),
				...(packageᐧjson.version !== "0.0.1" && { version: packageᐧjson.version }),
				description: packageᐧjson.description || "TODO description in MANIFEST.json5",
				...(!packageᐧjson.private && { isꓽpublished: true }),
				...(packageᐧjson.sideEffects && { hasꓽside_effects: true }),
				...(status !== "stable" && { status }),
				...(packageᐧjson.engines && { engines: packageᐧjson.engines }),
			}
		})()

		const target_path = path.resolve(root‿abspath, MANIFEST‿basename)
		await write_json_file(target_path, data)
		return createꓽfile_entry(target_path, root‿abspath)
	})()
	const _manifest = JSON5.parse(fs.readFileSync(entryⵧmanifest.path‿abs, "utf8"))
	updateⵧfrom_manifest(result, _manifest)

	/////////////////////////////////////////////////

	// start aggregating
	// we need the fully qualified name of the module
	result.namespace = getꓽnamespace(result)
	result.fqname = result.namespace + "/" + result.name

	const pending_promises: Array<Promise<void>> = []
	const raw_deps: Array<Dependency> = []

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
			assertꓽmigrated(entry, { indent, root‿abspath })
			isꓽignored = isꓽignored_file(entry) // update bc can become ignored after migration
			if (isꓽignored) console.log(`${indent}      migrated, now 🚫`)
		}

		if (isꓽignored) {
			return
		}

		// order is important!

		const demo_entrypoint‿score = getꓽentrypointⵧdemo__affinity‿score(entry)
		if (demo_entrypoint‿score) {
			const previous_candidate_score = getꓽentrypointⵧdemo__affinity‿score(result.entrypointⵧdemo)
			if (compareꓽscores(previous_candidate_score, demo_entrypoint‿score) < 0) {
				// "A should come before B"
				// keep previous
			} else {
				console.log(`${indent}    ⭐️new candidate for: demo entry point`)
				result.entrypointⵧdemo = entry
			}
		}

		const sandbox_entrypoint‿score = getꓽentrypointⵧsandbox__affinity‿score(entry)
		if (sandbox_entrypoint‿score) {
			const previous_candidate_score = getꓽentrypointⵧsandbox__affinity‿score(result.entrypointⵧsandbox)
			if (compareꓽscores(previous_candidate_score, sandbox_entrypoint‿score) < 0) {
				// "A should come before B"
				// keep previous
			} else {
				console.log(`${indent}    ⭐️new candidate for: sandbox entry point`)
				result.entrypointⵧsandbox = entry
			}
		}

		if (isꓽin_unstructured_folder(entry)) {
			// no more analysis
			return
		}

		assertꓽnormalized(entry)

		if (entry.basenameⵧsemantic‿no_ᐧext === "storypad" && entry.ext === ".html") {
			console.log(`${indent}    ⭐️new candidate for: storypad`)
			result.entrypointⵧstorypad = entry
		}

		if (isꓽentrypointⵧbuild(entry)) {
			console.log(`${indent}    ⭐️new build entry point`)
			result.entrypointsⵧbuild[entry.basenameⵧsemantic‿no_ᐧext] = entry
		}

		if (!demo_entrypoint‿score && !sandbox_entrypoint‿score && !isꓽentrypointⵧbuild(entry) && result.entrypointⵧstorypad !== entry) {
			const main_entrypoint‿score = getꓽentrypointⵧmain__affinity‿score(entry)
			console.log(main_entrypoint‿score)
			if (main_entrypoint‿score) {
				const previous_candidate_score = getꓽentrypointⵧmain__affinity‿score(result.entrypointⵧmain)
				console.log(previous_candidate_score)
				if (compareꓽscores(previous_candidate_score, main_entrypoint‿score) < 0) {
					// "A should come before B"
					// keep previous
				} else {
					console.log(`${indent}    ⭐️new candidate for: main entry point`)
					result.entrypointⵧmain = entry
				}
			}
		}

		if (entry.basename === MANIFEST‿basename) {
			if (entry !== entryⵧmanifest) throw new Error(`Multiple MANIFEST files found!`)
			return
		}

		const langs = getꓽProgLangs(entry)
		console.log(`${indent}    langs: ${langs.join(", ")}`)
		langs.forEach((lang) => result.languages.add(lang))

		const unprocessed_langs = new Set(langs)
		if (langs.includes("js") || langs.includes("ts")) {
			unprocessed_langs.delete("js")
			unprocessed_langs.delete("ts")
			const content = fs.readFileSync(entry.path‿abs, "utf8")
			const dep_type = inferꓽdeptype_from_caller(entry)
			console.log(`${indent}      inferred as: ${dep_type}`)

			const imports = parseImports(content)
			imports.forEach(({ name: dependency_name, type }) => {
				console.log(`${indent}    ↘ import ${type === 1 ? "type " : ""}${dependency_name}`)
				assert(!dependency_name.startsWith("npm:"), `Unexpected "npm:" URL scheme in import!`)

				if (isBuiltInNodeModule(dependency_name)) {
					if (langs.includes("ts")) raw_deps.push({ label: "@types/node", type: "dev" })
					// TODO 1D express dependency to a runtime?
					return
				}

				if (dependency_name === result.fqname) {
					// self-reference
					// this is allowed, no need to declare it as dep
					return
				}

				// intercept aggregations
				if (dependency_name === "chai" || dependency_name === "sinon") {
					if (dep_type !== "dev" && !["@monorepo-private/state-migration-tester", "@offirmo/unit-test-toolbox", "@monorepo-private/unit-test-toolbox", "@monorepo-private/toolbox--unit-tests"].includes(result.fqname)) {
						throw new Error("Unexpected chai/sinon NON-DEV dependency! Please review the module structure!")
					}

					console.log(`${indent}    ↘ converted to @offirmo/unit-test-toolbox`)
					raw_deps.push({ label: "@offirmo/unit-test-toolbox", type: "dev" })
					return
				}

				switch (type ?? 1) {
					case 0: {
						console.log(`${indent}    ↘ adding dep ${dependency_name} as ${dep_type}`)
						raw_deps.push({ label: dependency_name, type: dep_type })
						break
					}

					case 1:
						// types are needed in dev only
						// even if published as pure TS module, node type stripping will remove those deps in prod
						console.log(`${indent}    ↘ adding dep ${dependency_name} as dev`)
						raw_deps.push({ label: dependency_name, type: "dev" })
						break

					default:
						throw new Error(`Unknown import type "${type}"!`)
				}

				if (langs.includes("ts")) {
					console.log(`${indent}      ↳ Preemtively checking for potential @types/ package for "${dependency_name}"…`)
					pending_promises.push(
						pkg_infos_resolver.ↆgetꓽextra_typings_pkg_name_for(dependency_name).then((name) => {
							if (name) {
								console.log(`${indent} found @types/ package for "${dependency_name}": "${name}, adding it!`)
								raw_deps.push({ label: name, type: "dev" })
							}
						}),
					)
				}
			})

			if (entry.basename‿no_ᐧext === "_entrypoint") {
				const first_line = content.trim().split("\n").at(0)!.trim()
				const id = first_line.slice(2).trim()
				console.log(`${indent}    ⭐️new sub entry point "${id}"`)
				assert(!result.entrypointⵧexports[id], `entrypointⵧexports[${id}] should not already exist! (file ${entry.path‿rel}, previous ${result.entrypointⵧexports[id]?.path‿rel})`)
				result.entrypointⵧexports[id] = entry
			}
		}
		if (langs.includes("html")) {
			unprocessed_langs.delete("html")
			//throw new Error(`HTML imports detection not implemented!`)
			// TODO one day use parcel to track deps
			console.log(`${indent}    ↘ auto-dep to @monorepo-private/toolbox--parcel`)
			raw_deps.push({ label: "@monorepo-private/toolbox--parcel", type: "dev" })
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
		// txt, json should not make it there = ignored
		if (unprocessed_langs.size) {
			throw new Error(`Unknown language(s) "${Array.from(unprocessed_langs).join(", ")}" for "${entry.basename}"!`)
		}

		if (entry.extⵧsub === ".tests") {
			result.hasꓽtestsⵧunit = true
		}
		if (entry.extⵧsub === ".evals") {
			result.hasꓽtestsⵧevals = true
		}
		if (entry.extⵧsub === ".stories") {
			result.hasꓽstories = true
		}
		// TODO more test types
	})

	await Promise.all(pending_promises)
	if (!result.entrypointⵧmain) {
		if (result.entrypointⵧsandbox) {
			// happens in:
			// - pure sandbox fake packages, which don't really need a main
			// - early stage packages
			result.entrypointⵧmain ??= result.entrypointⵧsandbox
			result.status = result.status === "stable" ? (result.name.toLowerCase().includes("sandbox") ? "sandbox" : "tech-demo") : result.status
		}
	}
	assert(result.entrypointⵧmain, "No main file found?")

	result.isꓽapp = result._manifest.isꓽapp ?? (pkg_path.includes("sandbox") || result.entrypointⵧmain.ext === ".html")

	// migrations
	if (result.hasꓽstories && !result.entrypointⵧstorypad) {
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
		result.entrypointⵧstorypad = createꓽfile_entry(path.resolve(storypad__path, "index.html"), root‿abspath)
	}

	// extras
	if (result.languages.has("ts")) {
		raw_deps.push({ label: "tslib", type: "peer" })
		raw_deps.push({ label: "typescript", type: "dev" })
		raw_deps.push({ label: "@monorepo-private/config--typescript", type: "dev" })
	}

	// encourage safe practices
	if (!result.isꓽpublished && (result.languages.has("js") || result.languages.has("ts"))) {
		raw_deps.push({ label: "tiny-invariant", type: "normal" })
	}

	// consolidate
	Object.entries(result._manifest._overrides?.dependencies || {}).forEach(([label, details]) => {
		if (details === "ignore") return

		console.log(`${indent}    ↘ adding *overrides* dep ${label} as ${details.type || "normal"}`)
		raw_deps.push({ label, type: details.type || "normal" })
	})
	const hasꓽdependency_onꓽReact = raw_deps.some(({ label }) => label === "react")
	if (hasꓽdependency_onꓽReact) {
		// indirect dependency
		if (result.isꓽapp) {
			result.depsⵧnormal.add("react-dom")
		} else {
			result.depsⵧdev.add("react-dom")
		}
	}

	const targets_runtimeꓽbrowser = result.engines["browser"] || hasꓽdependency_onꓽReact || result.languages.has("html") || result.languages.has("css") || result.languages.has("jsx") || result.languages.has("tsx") || result.hasꓽstories || result.entrypointⵧstorypad
	if (targets_runtimeꓽbrowser) result.engines["browser"] = "*"

	if (targets_runtimeꓽbrowser) {
		raw_deps.push({ label: "@monorepo-private/storypad", type: "dev" })
		raw_deps.push({ label: "@monorepo-private/toolbox--parcel", type: "dev" })
	}

	raw_deps.forEach(({ label, type }) => {
		if (label === result.fqname) return // self-reference, not a real dep

		const overrides = result._manifest._overrides?.dependencies?.[label]
		if (overrides === "ignore") {
			// currently use to allow using optional "cross-cutting" libs
			// which may not be available if resurrecting bolt workspace 1-by-1
			// thus should not appear in package.json
			return
		}

		switch (overrides?.type || type) {
			case "normal":
				result.depsⵧnormal.add(label)
				break
			case "dev":
				result.depsⵧdev.add(label)
				break
			case "peer":
				result.depsⵧpeer.add(label)
				break
			case "optional":
				result.depsⵧoptional.add(label)
				break
			case "vendored":
				result.depsⵧvendored.add(label)
				break
			default:
				throw new Error(`Unknown dep type "${type}"!`)
		}
	})

	// move some deps around
	for (const dep of result.depsⵧnormal) {
		// small control
		if (["@monorepo-private/monorepo-scripts", "@monorepo-private/storypad", "@monorepo-private/toolbox--parcel", "@offirmo/unit-test-toolbox", "npm-run-all", "tslib", "typescript"].includes(dep)) throw new Error(`Unexpected dep "${dep}" in normal deps! (should be dev)`)

		const is_peer_candidate = ["tslib", "react", "@monorepo-private/soft-execution-context"].includes(dep)
		if (is_peer_candidate) {
			// note: will be moved back to normal if not a lib, see below
			result.depsⵧpeer.add(dep)
			result.depsⵧnormal.delete(dep)
		}
	}
	for (const dep of result.depsⵧdev) {
		if (result.depsⵧnormal.has(dep)) {
			result.depsⵧdev.delete(dep)
		}
	}
	for (const dep of result.depsⵧpeer) {
		if (result.isꓽapp) {
			// move them all to normal
			result.depsⵧnormal.add(dep)
			result.depsⵧpeer.delete(dep)
		} else {
			// also move to dev
			result.depsⵧdev.add(dep)
		}
	}

	return result
}

/////////////////////////////////////////////////

export { type PureModuleDetails, getꓽpackage_details }
