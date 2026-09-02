import type { PureModuleDetails } from "@infinite-monorepo/package-details"
import type { InfiniteMonorepoSpec } from "@infinite-monorepo/spec"

import type { DirPathⳇAbsolute } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

export const NODE_TYPEⵧREPO = "repository" as const // ~git repo
export const NODE_TYPEⵧMONOREPO = "monorepo" as const // monorepo (may have several per repo) https://monorepo.tools/
export const NODE_TYPEⵧWORKSPACES__LINE = "workspaces__line" as const // a subfolder containing packages. name from = a line in the "workspace" config of the monorepo
export const NODE_TYPEⵧPACKAGE = "package" as const // also named "workspace" in yarn, but unclear
// TODO review polyrepo
// TODO review multirepo

/////////////////////////////////////////////////
// inspired by https://www.jetbrains.com/help/idea/absolute-path-variables.html

// TODO 1D also create user-level config files?

export const PATHVARⵧROOTⵧREPO = `$REPO_ROOT$` as const
export type RepoPathⳇRelative = `${typeof PATHVARⵧROOTⵧREPO}/${string}`

export const PATHVARⵧROOTⵧMONOREPO = `$${NODE_TYPEⵧMONOREPO.toUpperCase()}_ROOT$` as const
export type MonorepoPathⳇRelative = `${typeof PATHVARⵧROOTⵧMONOREPO}/${string}`

export const PATHVARⵧROOTⵧWORKSPACE__LINE = `$${NODE_TYPEⵧWORKSPACES__LINE.toUpperCase()}_ROOT$` as const
export type WorkspaceLinePathⳇRelative = `${typeof PATHVARⵧROOTⵧWORKSPACE__LINE}/${string}`

export const PATHVARⵧROOTⵧPACKAGE = `$${NODE_TYPEⵧPACKAGE.toUpperCase()}_ROOT$` as const
export type PackagePathⳇRelative = `${typeof PATHVARⵧROOTⵧPACKAGE}/${string}`

// any node (TODO review useful?)
export const PATHVARⵧROOTⵧNODE = `$NODE_ROOT$` as const
export type NodePathⳇRelative = `${typeof PATHVARⵧROOTⵧNODE}/${string}`

export type AnyRepoPathⳇRelative =
	| RepoPathⳇRelative
	| MonorepoPathⳇRelative
	| WorkspaceLinePathⳇRelative
	| PackagePathⳇRelative
	| NodePathⳇRelative

export type AnyRepoFilePathⳇRelative = AnyRepoPathⳇRelative
export type AnyRepoDirPathⳇRelative = AnyRepoPathⳇRelative

/////////////////////////////////////////////////

// id = path so far
export type NodeId = DirPathⳇAbsolute // XXX or relative?

// TODO better union of descendents?
export interface NodeBase {
	type: unknown

	path‿abs: DirPathⳇAbsolute
	path‿ar: AnyRepoPathⳇRelative

	// Any node can override stuff from the root spec
	// Will be intelligently cascaded from parents (prototypically)
	// Optional bc we have several graphs and only the "semantic" one is expected to have a spec (TODO review)
	// TODO 1D
	spec?: Partial<InfiniteMonorepoSpec>

	parent_id: NodeId | null
	bfs_level: number // 0 if no parent

	// anchor for plugins to put their stuff. Will not be mutated.
	plugin_area: Record<symbol, any>
}

/////////////////////////////////////////////////

// TODO 1D file-level node? for ex. to label it "dev/prod/test" ?

/////////////////////////////////////////////////

// in the sense of a ~npm package with a package.json
export interface Package extends NodeBase {
	path‿ar: MonorepoPathⳇRelative | WorkspaceLinePathⳇRelative

	details: PureModuleDetails

	//name: string // NOT including the namespace TODO why needed?
}

/////////////////////////////////////////////////

// subset of a workspace
// usually ~ a line in the workspace definition
// (we depart from yarn definition of workspace = a package from a monorepo, too confusing)
// TODO not implemented at this stage
export interface WorkspaceLine extends NodeBase {
	path‿ar: MonorepoPathⳇRelative
}

/////////////////////////////////////////////////

// group of packages linked together by a monorepo tool
export interface Workspace extends NodeBase {
	path‿ar: MonorepoPathⳇRelative
}

/////////////////////////////////////////////////

// Source control repo
// may contain several workspaces
export interface Repository extends NodeBase {}

/////////////////////////////////////////////////

// group of repositories
export interface ArchRepository extends NodeBase {}

/////////////////////////////////////////////////

export interface NodeⳇRepo extends Workspace {
	type: typeof NODE_TYPEⵧREPO
	parent_id: null // so far until multi-repo / arch-repo
}
// XXX note that a workspace could be directly at the root of the repo = same path as the SCM/Repo node, but not the same graph
export interface NodeⳇWorkspace extends Workspace {
	type: typeof NODE_TYPEⵧMONOREPO
	details: PureModuleDetails // yes, a monorepo has its own package.json
}
export interface NodeⳇWorkspaceLine extends WorkspaceLine {
	type: typeof NODE_TYPEⵧWORKSPACES__LINE
}
export interface NodeⳇPackage extends Package {
	type: typeof NODE_TYPEⵧPACKAGE
	details: PureModuleDetails
}

export type Node = NodeⳇRepo | NodeⳇWorkspace | NodeⳇWorkspaceLine | NodeⳇPackage

// VERY important
// due to immutability, when manipulating a node, this node may already be outdated
// State reduction must act on the latest version of this node
export type NodeRef<NodeType extends NodeBase = Node> = Pick<NodeType, "type" | "path‿abs">
