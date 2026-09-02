/////////////////////////////////////////////////

// MUST be kept in sync with updateⵧfrom_manifest()
export interface PureModuleSpec {
	// hard to infer
	isꓽpublished: boolean
	isꓽapp: boolean // app in the generic sense of "provide peer deps" vs. "use peer deps"
	hasꓽside_effects: boolean // assuming most pkgs don't. automatically true for apps (standard practice)
	status: QualityStatus
	scripts: Record<string, string>
	description?: string
	license?: SoftwareLicense‿SPDX

	// usually inferred, e.g. from the path
	name: string // NOT including the namespace
	target: Runtime

	// usually defaulted
	namespace: string | undefined // may have no namespace
	version: SemVer
	author: string // https://docs.npmjs.com/cli/v11/configuring-npm/package-json#people-fields-author-contributors
}

// all entries are optional, only to be used if an override is needed or if not inferrable
export interface PureModuleManifest extends Partial<PureModuleSpec> {
	_dontꓽpresent?: boolean // unsupported module, don't "present" it TODO remove once all the modules are compatible!

	_overrides?: {
		// ignore = currently use to allow using optional "cross-cutting" libs
		// which may not be available if resurrecting bolt workspace 1-by-1
		// thus should not appear in package.json
		dependencies: Record<string, DependencyDetails | "ignore">
		files: {
			packageᐧjson?: { [path: string]: any }
			// TODO 1D tsconfig.json and other
		}
	}
}

// Details gathered by analyzing the package, with a goal to (re)generate:
// - package.json
// - tsconfig.json
// - ...
export interface PureModuleDetailsDerived {
	root‿abspath: string

	_error?: Error // if an error is encountered in the analysis process

	fqname: PkgFQName // FOR CONVENIENCE (secondary SoT compared to namespace + name)

	// entry points
	entrypointⵧexports: {
		// TODO is main here?
		// extra exports (if any)
		[label: string]: FileEntry
	}
	// special, leading to scripts
	entrypointⵧmain?: FileEntry // still useful vs. entrypointⵧexports[.]
	entrypointⵧdemo?: FileEntry
	entrypointⵧsandbox?: FileEntry
	entrypointⵧstorypad?: FileEntry
	entrypointsⵧbuild: {
		// TODO review
		// build scripts (if any)
		[label: string]: FileEntry
	}

	hasꓽtestsⵧunit: boolean
	hasꓽtestsⵧevals: boolean
	hasꓽstories: boolean
	//hasꓽtestsⵧsmoke: boolean // TODO 1D

	// must cover all DependencyType
	depsⵧnormal: Map<PkgFQName, Omit<DependencyDetails, "type">>
	depsⵧpeer: Map<PkgFQName, Omit<DependencyDetails, "type">>
	depsⵧbundle: Map<PkgFQName, Omit<DependencyDetails, "type">>
	depsⵧoptional: Map<PkgFQName, Omit<DependencyDetails, "type">>
	depsⵧdev: Map<PkgFQName, Omit<DependencyDetails, "type">>
	depsⵧconfig: Map<PkgFQName, Omit<DependencyDetails, "type">>
	depsⵧvendored: Map<PkgFQName, Omit<DependencyDetails, "type">>

	// needed to build "scripts"
	languages: Set<ProgrammingLanguage>

	// to access manifest-specific fields
	_manifest: PureModuleManifest
}

export type PureModuleDetails = PureModuleSpec & PureModuleDetailsDerived

/////////////////////////////////////////////////

import type {
	ProgrammingLanguage,
	PkgFQName,
	DependencyDetails,
	QualityStatus,
	Runtime,
} from "@infinite-monorepo/primitives"

import type { FileEntry } from "@monorepo-private/file-entry"
import type { SemVer, SoftwareLicense‿SPDX } from "@monorepo-private/ts--types"
