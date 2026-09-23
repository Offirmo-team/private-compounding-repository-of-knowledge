import { defineConfig, type UserConfig } from "vite"

import { extend_web_app_config } from "@monorepo-private/vite--config--default"

// Optional: serve under a sub-path to exercise the relative-asset behavior locally,
// since this app may be served under a path (ex. /foo/app/nightly/).
// `vite build` is untouched: the built output always stays relative ("./").
// Toggle by swapping which of the two lines below is commented:
const DEV_SUBPATH: string | undefined = "/subpath/"
// const DEV_SUBPATH: string | undefined = undefined

export default defineConfig(({ command }): UserConfig => {
	const config = extend_web_app_config() as UserConfig
	return command === "serve" && DEV_SUBPATH ? { ...config, base: DEV_SUBPATH } : config
})
