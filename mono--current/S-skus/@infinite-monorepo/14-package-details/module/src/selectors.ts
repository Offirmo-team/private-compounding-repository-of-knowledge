/////////////////////////////////////////////////

// .fqname is for convenience and a secondary SSoT
// we use the primary SoT
// (this func may actually be used to update .fqname)
export function getꓽfqname(details: Immutable<Pick<PureModuleDetails, "name" | "namespace">>): PkgFQName {
	const { namespace, name } = details

	if (!namespace) return name

	return `${namespace}/${name}`
}

export function getꓽall_external_dependencies(details: Immutable<PureModuleDetails>): Set<PkgFQName> {
	return reduceꓽdependency_type(
		details,
		({ acc, type, map }) => {
			if (type === "vendored") {
				// vendored are to be copied internally, no longer being a dep at the end)
				return acc
			}

			const names = map.keys()

			return acc.union(new Set(names))
		},
		new Set<PkgFQName>(),
	)
}

export function getꓽdependency_type(details: Immutable<PureModuleDetails>, name: PkgFQName): DependencyType | null {
	return reduceꓽdependency_type(
		details,
		({ acc, type, map }) => {
			if (!acc) {
				if (map.has(name)) {
					return type
				}
			}

			return acc
		},
		null as DependencyType | null,
	)
}

export function isꓽtargeting_browser(details: Immutable<PureModuleDetails>): boolean {
	if (details.target === "browser") return true

	// before reconciliation, may not be up to date
	const hasꓽnondev_dependency_onꓽReact = getꓽdependency_type(details, "react") === "normal"
	return (
		hasꓽnondev_dependency_onꓽReact ||
		// TODO review multimorphic with stories despite not being targeting browser
		details.languages.has("html") ||
		details.languages.has("css") ||
		details.languages.has("jsx") ||
		details.languages.has("tsx") ||
		details.hasꓽstories ||
		!!details.entrypointⵧstorypad
	)
}

export function reduceꓽdependency_type<T = undefined>(
	details: Immutable<PureModuleDetails>,
	cb: (p: { acc: T; type: DependencyType; map: Immutable<Map<PkgFQName, DependencyDetails>> }) => T,
	initial: T,
): T {
	const ǃ = assert_from({ for_eachꓽdependency_type })

	return DEPENDENCY_TYPES.reduce((acc, type) => {
		const key: keyof typeof details = `depsⵧ${type}`
		const map: Immutable<Map<PkgFQName, DependencyDetails>> = details[key] as any
		ǃ.forⵧparam({ details }).require(!!map, `Details dep field expected: ${key}!`)

		acc = cb({
			acc,
			type,
			map,
		})
		return acc
	}, initial)
}

export function for_eachꓽdependency_type(
	details: Immutable<PureModuleDetails>,
	cb: (p: { type: DependencyType; map: Immutable<Map<PkgFQName, DependencyDetails>> }) => void,
): void {
	return reduceꓽdependency_type(
		details,
		({ type, map }) => {
			cb({ type, map })
			return undefined
		},
		undefined,
	)
}

/////////////////////////////////////////////////

import {
	DEPENDENCY_TYPES,
	type DependencyDetails,
	type DependencyType,
	type PkgFQName,
} from "@infinite-monorepo/primitives"

import { assert_from } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import type { PureModuleDetails } from "./types.ts"
