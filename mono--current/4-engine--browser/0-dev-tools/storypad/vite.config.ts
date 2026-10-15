import { fileURLToPath } from "node:url"

import { extendꓽconfigⵧdefault } from "@monorepo-private/vite--config--default"

export default extendꓽconfigⵧdefault({
	resolve: {
		alias: {
			// needed to wire the official Storybook examples to storypad
			"@storybook/test": fileURLToPath(new URL("./module/src/l3-compat/@storybook/test.ts", import.meta.url)),
		},
	},
})
