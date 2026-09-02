/////////////////////////////////////////////////
// primitives

export interface VersionSpecification {
	// TODO clarify

	versionsⵧacceptable: SemVerⳇRange
	//| 'auto' // pick the most sensible
	//| 'latest'
	//| 'LTS' // TODO review
	//| 'current'
	// default (built-in) aliases: node, stable, unstable, iojs, system

	// recommended, ex.
	// - bc. pre-installed in CI
	versionⵧrecommended?: SemVerⳇExact
}

export type { PkgName, PkgNamespace, PkgFQName, PackageJson } from "@infinite-monorepo/pkg-infos-resolver"

/////////////////////////////////////////////////

export type ProgrammingLanguage = "css" | "html" | "js" | "json" | "jsx" | "md" | "ts" | "tsx"

export type QualityStatus = // EXPERIMENTAL rating of modules TODO clarify
	| "stable" // checks (TS, UT) are expected to work
	// below that, checks are not expected to work
	| "incubator"
	| "spike"
	| "sandbox" // self-contained playground for testing stuff
	| "tech-demo" // not YET in prod
	| "unstable" // ex. a rewrite or refactor in progress, most likely behind a flag

export type Runtime = "isomorphic" | "browser" | "system" // also considered "runtimes" (WinterTC) "node" (as a generic) see also https://nodejs.org/api/packages.html#conditional-exports and https://esbuild.github.io/api/#platform

/////////////////////////////////////////////////

export const DEPENDENCY_TYPES = [
	// order is important: dev is a grab bag of stuff, so putting it last for more accurate getꓽdependency_type()
	"normal",
	"peer", // https://docs.npmjs.com/cli/v11/configuring-npm/package-json#peerdependencies
	"bundle", // https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bundledependencies
	"optional", //https://docs.npmjs.com/cli/v11/configuring-npm/package-json#optionaldependencies
	"dev", // https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devdependencies
	"config", // special pnpm https://pnpm.io/config-dependencies
	//"script", // TODO review
	"vendored", // special, not implemented
] as const
export type DependencyType = (typeof DEPENDENCY_TYPES)[number]

export interface Dependency {
	label: PkgFQName
	type: DependencyType
}

export interface DependencyDetails {
	type: DependencyType
	v?: SemVerⳇRange
	optional?: true
}

/////////////////////////////////////////////////

import type { PkgFQName } from "@infinite-monorepo/pkg-infos-resolver"

import type { SemVerⳇExact, SemVerⳇRange } from "@monorepo-private/ts--types"
