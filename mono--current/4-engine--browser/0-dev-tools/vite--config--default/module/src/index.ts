// https://vite.dev/config/

import react from "@vitejs/plugin-react"
import type { UserConfig } from "vite"
import { defineConfig } from "vite"

import { mergeⵧdeep } from "@monorepo-private/merge"
//import xPlugin from '@monorepo-private/vite-plugin-parcel-features'
//import Inspect from 'vite-plugin-inspect'

/////////////////////////////////////////////////

const CONFIGⵧDEFAULT: UserConfig = {
	//devtools: true,
	plugins: [
		react(),
		//Inspect(),
		//xPlugin(),
	],

	// sniped by Gemini. Works.
	esbuild: {
		// we use "preserve" as default, but final app should be explicit
		jsx: "automatic",
	},
}

function extend_default_config(configⵧoverrides: UserConfig): ReturnType<typeof defineConfig> {
	const configⵧfinal = mergeⵧdeep<UserConfig>(CONFIGⵧDEFAULT, configⵧoverrides)
	return defineConfig(configⵧfinal)
}

/////////////////////////////////////////////////

export { CONFIGⵧDEFAULT, extend_default_config }
