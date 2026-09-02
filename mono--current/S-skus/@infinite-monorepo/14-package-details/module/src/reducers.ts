/////////////////////////////////////////////////

export function create(
	root‿abspath: PathⳇAbsolute,
	default_namespace: PureModuleDetails["namespace"] = undefined,
): Immutable<PureModuleDetails> {
	let path__segments = path
		.resolve(root‿abspath)
		.split(path.sep)
		.filter((s) => !!s)

	// TODO those inference are specific
	const name: PureModuleDetails["name"] = (function _inferꓽname(): PkgName {
		if (path__segments.at(-1) === "src") path__segments.pop()
		if (path__segments.at(-1) === "module") path__segments.pop()

		let segment = path__segments.pop()!
		while (segment.length > 1 && "0123456789-".includes(segment[0]!)) segment = segment.slice(1)
		return segment
	})()

	const namespace: PureModuleDetails["namespace"] = (function _inferꓽns(): PkgNamespace {
		const i = path__segments.findLastIndex((s) => s.startsWith("@"))
		if (i) return path__segments[i]

		return default_namespace
	})()

	const target: PureModuleDetails["target"] = (function _inferꓽtarget(): Runtime {
		const from_path = path__segments.reduceRight<Runtime | undefined>((acc, segment) => {
			if (acc) return acc

			if (segment.endsWith("-isomorphic")) return "isomorphic"

			if (segment.endsWith("-engine--browser")) return "browser"
			if (segment.includes("-web-")) return "browser"

			if (segment.includes("-engine--")) return "system"

			return undefined
		}, undefined)

		return from_path ?? "isomorphic"
	})()

	const status: PureModuleDetails["status"] = (function _inferꓽtarget(): QualityStatus {
		const from_path = path__segments.reduceRight<QualityStatus | undefined>((acc, segment) => {
			if (acc) return acc

			if (segment.endsWith("-incubator")) return "incubator"

			return undefined
		}, undefined)

		return from_path ?? "stable"
	})()

	const result: PureModuleDetails = {
		root‿abspath,

		// safe defaults:

		status,
		namespace,
		name,
		fqname: getꓽfqname({ namespace, name }),
		version: "0.0.1",
		//description?: string
		isꓽpublished: false,
		author: "@infinite-monorepo generator https://github.com/Offirmo",
		//license: "Unlicense",
		target,

		// TODO review "main" not recommended anymore? vs. exports
		//entrypointⵧmain: null as any, // hack, will be set during the parse and will throw if still null
		entrypointⵧexports: {},
		entrypointsⵧbuild: {},

		isꓽapp: false, // most common case
		hasꓽside_effects: false,

		hasꓽtestsⵧunit: false,
		hasꓽtestsⵧevals: false,
		//hasꓽtestsⵧsmoke: false,
		hasꓽstories: false,

		depsⵧnormal: new Map(),
		depsⵧpeer: new Map(),
		depsⵧbundle: new Map(),
		depsⵧoptional: new Map(),
		depsⵧdev: new Map(),
		depsⵧconfig: new Map(),
		depsⵧvendored: new Map(),

		languages: new Set<ProgrammingLanguage>(),

		scripts: {},

		_manifest: {},
	}

	return result
}

export function updateꓽfqname(details: Immutable<PureModuleDetails>): Immutable<PureModuleDetails> {
	const fqname = getꓽfqname(details)
	if (details.fqname === fqname) return details

	return {
		...details,
		fqname,
	}
}

export function updateꓽname(details: Immutable<PureModuleDetails>, name: string): Immutable<PureModuleDetails> {
	if (details.name === name) return details

	return updateꓽfqname({
		...details,
		name,
	})
}

export function updateꓽnamespace(
	details: Immutable<PureModuleDetails>,
	namespace: string | undefined,
): Immutable<PureModuleDetails> {
	if (details.namespace === namespace) return details

	return updateꓽfqname({
		...details,
		namespace: namespace,
	})
}

export function updateⵧfrom_manifest(
	details: Immutable<PureModuleDetails>,
	_manifest: PureModuleManifest,
): Immutable<PureModuleDetails> {
	// TODO immu (not really needed atm)

	details = {
		...details,
		_manifest,
	}

	const unprocessed_keys = new Set<string>(Object.keys(_manifest))

	;(
		[
			"description",
			"isꓽpublished",
			"isꓽapp",
			"hasꓽside_effects",
			"status",
			"scripts",

			"name",
			"target",

			"namespace",
			"version",
			"license",
			"author",
		] satisfies Array<keyof PureModuleManifest>
	).forEach((k) => {
		if (unprocessed_keys.has(k)) {
			assert(!!details._manifest[k])
			;(details as any)[k] = details._manifest[k]
			unprocessed_keys.delete(k)
		}
	})
	// special ones that don't map to details
	unprocessed_keys.delete("_dontꓽpresent")
	unprocessed_keys.delete("_overrides")
	if (unprocessed_keys.size) {
		throw new Error(`Unknown keys in manifest: "${Array.from(unprocessed_keys).join(", ")}"!`)
	}

	return updateꓽfqname(details)
}

// intelligently add (peer -> also dev)
// TODO also auto-install types? (or in reconcile?) or both
export function addꓽdependency(
	details: Immutable<PureModuleDetails>,
	dep_name: PkgFQName,
	dep_details: Immutable<DependencyDetails>,
): Immutable<PureModuleDetails> {
	const { type } = dep_details
	if (details.isꓽapp && type === "peer") {
		throw new Error(`An app can't have peer deps!`)
	}

	details = _addꓽdependency(details, dep_name, dep_details)

	switch (type) {
		case "peer": {
			details = _addꓽdependency(details, dep_name, { type: "dev" })
			break
		}
		default:
			break
	}

	return details
}

export function removeꓽdependency(
	details: Immutable<PureModuleDetails>,
	dep_name: PkgFQName,
	dep_type: DependencyType | "*" = "*",
): Immutable<PureModuleDetails> {
	return reduceꓽdependencies(details, ({ details, type, map, key }) => {
		if (!map.has(dep_name)) return details // no change

		if (dep_type !== "*" && type !== dep_type) return details // not this type

		map = new Map(map)
		map.delete(dep_name)
		return {
			...details,
			[key]: map,
		}
	})
}

export function addꓽscript(
	details: Immutable<PureModuleDetails>,
	script_name: string,
	script_content: string,
): Immutable<PureModuleDetails> {
	const ǃ = assert_from({ addꓽscript })

	if (details.scripts[script_name]) {
		ǃ.forⵧparam({ script_content }).require(
			script_content === details.scripts[script_name],
			`conflict for script "${script_name}"`,
		)
		return details
	}

	return {
		...details,
		scripts: {
			...details.scripts,
			[script_name]: script_content,
		},
	}
}

// after changes, reconcile some infos
export function reconcile(details: Immutable<PureModuleDetails>): Immutable<PureModuleDetails> {
	details = updateꓽfqname(details)

	////////////
	// consolidate
	const is_target_defaulted = !details._manifest.target && details.target === "isomorphic"
	if (is_target_defaulted) {
		// default value. try to better re-infer the target with the new infos

		// TODO improve browser for tests vs for code
		const targets_runtimeꓽbrowser = isꓽtargeting_browser(details)
		if (targets_runtimeꓽbrowser)
			details = {
				...details,
				target: "browser",
			}
	}
	if (details.isꓽapp && !details.hasꓽside_effects) {
		details = {
			...details,
			hasꓽside_effects: true, // important, some bundlers optimize out the whole app if not
		}
	}

	////////////
	/// ADD dependencies

	// from overrides
	Object.entries(details._manifest._overrides?.dependencies || {}).forEach(([dep_name, dep_details]) => {
		if (dep_details === "ignore") return

		if (getꓽdependency_type(details, dep_name) === null) {
			console.log(`↘ _overrides: adding dep ${dep_name} as ${dep_details.type || "normal"}`)
			details = addꓽdependency(details, dep_name, { type: "normal", ...dep_details })
		}
	})

	// TODO move to a React plugin?
	if (details.languages.has("jsx") || details.languages.has("tsx")) {
		// XXX can be dev!
		details = addꓽdependency(details, "react", { type: details.isꓽapp ? "normal" : "peer" })
	}
	const hasꓽdependency_onꓽReact = getꓽdependency_type(details, "react") !== null
	if (hasꓽdependency_onꓽReact) {
		// indirect dependency
		// XXX can be react-native or other
		details = addꓽdependency(details, "react-dom", { type: details.isꓽapp ? "normal" : "dev" })
	}

	if (isꓽtargeting_browser(details)) {
		// NO we hoist to prevent cycles
		//details = addꓽdependency(details, "@monorepo-private/storypad", { type: "dev" })
		details = removeꓽdependency(details, "@monorepo-private/storypad") // try to break cycles
	}

	////////////
	/// REMOVE dependencies
	details = removeꓽdependency(details, details.fqname) // may happen if base dev pkg

	// from overrides
	Object.entries(details._manifest._overrides?.dependencies || {}).forEach(([dep_name, dep_details]) => {
		if (dep_details !== "ignore") return

		if (getꓽdependency_type(details, dep_name) !== null) {
			console.log(`↘ _overrides: removing dep ${dep_name}`)
			details = removeꓽdependency(details, dep_name)
		}
	})

	////////////
	/// MOVE dependencies

	for (const tuple of details.depsⵧpeer) {
		const [dep_name, dep_details] = tuple

		if (details.isꓽapp) {
			// should have no peer
			// move them all to normal
			details = removeꓽdependency(details, dep_name)
			details = addꓽdependency(details, dep_name, { ...dep_details, type: "normal" })
		} else {
			// also copy to dev
			details = addꓽdependency(details, dep_name, { ...dep_details, type: "dev" })
		}
	}
	for (const tuple of details.depsⵧnormal) {
		const [dep_name, dep_details] = tuple
		// small control TODO clean
		if (
			[
				"@monorepo-private/monorepo-scripts",
				"@monorepo-private/storypad",
				"@monorepo-private/toolbox--parcel",
				"@monorepo-private/toolbox--vite",
				// TODO all meta pks
				"npm-run-all",
				"typescript",
			].includes(dep_name)
		)
			throw new Error(`Unexpected dep "${dep_name}" in normal deps! (should be dev)`)

		const is_peer_candidate = ["tslib", "react", "@monorepo-private/soft-execution-context"].includes(dep_name)
		if (is_peer_candidate && !details.isꓽapp) {
			// move normal -> peer
			details = removeꓽdependency(details, dep_name)
			details = addꓽdependency(details, dep_name, { ...dep_details, type: "peer" })
		}
	}
	for (const tuple of details.depsⵧdev) {
		const [dep_name, _] = tuple
		if (details.depsⵧnormal.has(dep_name)) {
			details = removeꓽdependency(details, dep_name, "dev")
		}
	}

	////////////
	// checks

	return details
}

/////////////////////////////////////////////////

// just add it to the correct field
function _addꓽdependency(
	details: Immutable<PureModuleDetails>,
	dep_name: PkgFQName,
	dep_details: Immutable<DependencyDetails>,
): Immutable<PureModuleDetails> {
	const ǃ = assert_from({ _addꓽdependency })

	const key = `depsⵧ${dep_details.type}` as keyof PureModuleDetails
	const previous: Immutable<Map<PkgFQName, DependencyDetails>> = details[key]
	ǃ.forⵧparam({ details }).require(!!previous, `Details dep field expected: ${key}!`)
	const deps = new Map(previous)

	const { type, ...rest } = dep_details // cleans up the redundant type (SSoT)
	if (deps.has(dep_name)) {
		// TODO 1D check conflicts
		return details
	}

	deps.set(dep_name, rest)

	return {
		...details,
		[key]: deps,
	}
}

function reduceꓽdependencies(
	details: Immutable<PureModuleDetails>,
	cb: (p: {
		details: Immutable<PureModuleDetails>
		type: DependencyType
		map: Immutable<Map<PkgFQName, DependencyDetails>>
		key: keyof PureModuleDetails
	}) => Immutable<PureModuleDetails>,
): Immutable<PureModuleDetails> {
	const ǃ = assert_from({ reduceꓽdependencies })

	return DEPENDENCY_TYPES.reduce((details, type) => {
		const key: keyof typeof details = `depsⵧ${type}`
		const map: Immutable<Map<PkgFQName, DependencyDetails>> = details[key] as any
		ǃ.forⵧparam({ details }).require(!!map, `Details dep field expected: ${key}!`)

		return cb({
			details,
			type,
			map,
			key,
		})
	}, details)
}

/////////////////////////////////////////////////

import * as path from "node:path"

import type {
	DependencyDetails,
	DependencyType,
	PkgFQName,
	PkgName,
	PkgNamespace,
	ProgrammingLanguage,
	QualityStatus,
	Runtime,
} from "@infinite-monorepo/primitives"
import { DEPENDENCY_TYPES } from "@infinite-monorepo/primitives"

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable, PathⳇAbsolute, SemVer, SoftwareLicense‿SPDX } from "@monorepo-private/ts--types"

import { isꓽtargeting_browser, getꓽfqname, getꓽdependency_type } from "./selectors.ts"
import type { PureModuleDetails, PureModuleManifest } from "./types.ts"
