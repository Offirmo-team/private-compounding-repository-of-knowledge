import { defineConfig, type UserConfig } from "vite"

import { extendꓽconfigⵧweb_app } from "@monorepo-private/vite--config--default"

export default defineConfig(({ command }): UserConfig => {
	const config = extendꓽconfigⵧweb_app({
		// extend here if needed
	}) as UserConfig
	// extend here if needed
	return config
})
