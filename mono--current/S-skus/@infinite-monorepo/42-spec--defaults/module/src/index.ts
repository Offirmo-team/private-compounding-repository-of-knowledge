import type { InfiniteMonorepoSpec } from "@infinite-monorepo/spec"

import type { Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

const MONOREPO_SPEC_DEFAULT: Immutable<InfiniteMonorepoSpec> = {
	mode: "SSoT",
	runtimeⵧlocal: "node",
	namespace: "@monorepo",
	namespaceⵧprivate: "@monorepo-private",
	workspaces: [],
	package_manager: "pnpm",
	EOL: "\n",
	PATH_SEP: "/",
	root_path‿abs: "NOT_YET_LOADED/",
	_config_fileⵧroot: undefined,
}

function completeꓽspec(spec: Immutable<Partial<InfiniteMonorepoSpec>>): Immutable<InfiniteMonorepoSpec> {
	return {
		...MONOREPO_SPEC_DEFAULT,
		...spec,
	}
}

/////////////////////////////////////////////////

export { MONOREPO_SPEC_DEFAULT, completeꓽspec }
