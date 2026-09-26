import { defineConfig, type UserConfig } from "vite"

import { extend_web_app_config } from "@monorepo-private/vite--config--default"

export default defineConfig(({ command }): UserConfig => {
	const config = extend_web_app_config() as UserConfig
	// extend here if needed
	return config
})
