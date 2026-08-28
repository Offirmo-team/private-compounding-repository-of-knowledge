import type { MonorepoSpec } from '@infinite-monorepo/types'

/////////////////////////////////////////////////

const SPEC: Partial<MonorepoSpec> = {
	namespace: '@offirmo',

	runtimeⵧlocal: { name: 'deno', versionsⵧacceptable: '^24' }, // imminent LTS
	package_manager: 'pnpm', // 2025/10 we need some unique security features

	workspaces: [
		// TODO autogen
	],
}

/////////////////////////////////////////////////

export default SPEC
