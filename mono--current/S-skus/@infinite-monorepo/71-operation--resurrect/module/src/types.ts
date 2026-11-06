/////////////////////////////////////////////////

// = where to stop once issues are found: a subgroup (incl. a SKU, see plugin--graph)
// packages in resurrection order
export type Zone = Array<Immutable<PackageGraphⳇPackage>>

export interface PackageWithIssues {
	pkg: Immutable<PackageGraphⳇPackage>
	issues: Array<ResurrectionIssue>
	isꓽblocking: boolean // false = reported, but not stopping the walk
}

export type ResurrectionIssue = ResurrectionIssueⵧgraph | ResurrectionIssueⵧscript

// already detected when deriving the graph
export interface ResurrectionIssueⵧgraph {
	source: "graph" // discriminant
	issue: Immutable<PackageGraphⳇIssueⵧany>
}

export interface ResurrectionIssueⵧscript {
	source: "script" // discriminant
	script: string // ex. "check:ts"
	log‿abs: PathⳇAbsolute // full output of the failed run
}

/////////////////////////////////////////////////

import type { PackageGraphⳇIssueⵧany, PackageGraphⳇPackage } from "@infinite-monorepo/plugin--graph"

import type { Immutable, PathⳇAbsolute } from "@monorepo-private/ts--types"
