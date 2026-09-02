import type {
	VersionSpecification,
	LocalJsRuntimeKey,
	JsRuntimeSpec,
	PackageManagerKey,
	PackageManagerSpec,
} from "@infinite-monorepo/primitives"

import type {
	SemVerⳇExact,
	SemVerⳇRange,
	PathSeparator,
	EndOfLine,
	DirPathⳇAbsolute,
	FilePathⳇAbsolute,
} from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

export interface ToolSpec extends VersionSpecification {
	name: string
	executable?: string // to test for presence in the path
	requirement_level: "required" | "recommended" | "optional"
}

/////////////////////////////////////////////////

export interface InfiniteMonorepoSpec {
	/////// META ///////
	mode: "SSoT" | "hybrid"

	/////// RUNTIMES ///////
	// the runtime used to do monorepo operations such as running tasks, building, etc.
	// (should we support multiple at once? Not for now, complex, need an actual use case)
	runtimeⵧlocal: LocalJsRuntimeKey | JsRuntimeSpec<LocalJsRuntimeKey>

	/////// GRAPH ///////
	root_path‿abs: DirPathⳇAbsolute
	workspaces: Array<string> // TODO refine, should be cross-pkg-managers? https://pnpm.io/pnpm-workspace_yaml see convo https://turborepo.dev/docs/crafting-your-repository/structuring-a-repository#specifying-packages-in-a-monorepo

	/////// TOOLING ///////
	package_manager: PackageManagerKey | PackageManagerSpec
	package_manager__config?: any
	//runtime_envⵧdev: { [key: string]: JsRuntimeSpec }

	/////// CODEGEN ///////
	namespace: `@${string}` // e.g. @monorepo
	namespaceⵧprivate: `@${string}` // e.g. @monorepo-private
	EOL: EndOfLine // useful?
	PATH_SEP: PathSeparator // useful?

	/////// META ///////
	_config_fileⵧroot: FilePathⳇAbsolute | null | undefined
}
