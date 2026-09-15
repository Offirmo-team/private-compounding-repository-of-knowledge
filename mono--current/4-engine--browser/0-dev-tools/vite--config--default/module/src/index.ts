// https://vite.dev/config/

/////////////////////////////////////////////////

export const CONFIGⵧDEFAULT: UserConfig = {
	//devtools: true,
	plugins: [
		react(),
		//Inspect(),
		//xPlugin(),
	],
}

export function extend_default_config(configⵧoverrides: UserConfig): ReturnType<typeof defineConfig> {
	const configⵧfinal = mergeⵧdeep<UserConfig>(CONFIGⵧDEFAULT, configⵧoverrides)
	return defineConfig(configⵧfinal)
}

/////////////////////////////////////////////////

// For our "final web app" packages: a generated multi-page site under module/src/, built into dist/.
// Every *.html is an entry; static siblings (.json, .txt, .webmanifest, .well-known/…) are copied verbatim.
// Zero-arg by default — paths derive from the invoking package's cwd. Pass overrides to opt out.
export function extend_web_app_config(configⵧoverrides: UserConfig = {}): ReturnType<typeof defineConfig> {
	const dirⵧroot = configⵧoverrides.root ?? resolve(process.cwd(), "module/src")
	const dirⵧout = configⵧoverrides.build?.outDir ?? resolve(process.cwd(), "dist")

	const configⵧweb_app: UserConfig = {
		root: dirⵧroot,
		build: {
			outDir: dirⵧout,
			emptyOutDir: true,
			rollupOptions: {
				input: html_entry_points(dirⵧroot),
			},
		},
		server: {
			port: 1981,
			strictPort: true,
			open: true,
		},
		plugins: [copy_non_html_assets(dirⵧroot, dirⵧout)],
	}

	return extend_default_config(mergeⵧdeep(configⵧweb_app, configⵧoverrides))
}

function html_entry_points(dir: string): Record<string, string> {
	return Object.fromEntries(
		readdirSync(dir)
			.filter((name) => name.endsWith(".html"))
			.map((name) => [name.slice(0, -".html".length), resolve(dir, name)]),
	)
}

// These siblings aren't referenced by the HTML, so Vite won't emit them — copy them as-is after the build.
function copy_non_html_assets(from: string, to: string): Plugin {
	return {
		name: "copy-non-html-assets",
		apply: "build",
		closeBundle() {
			cpSync(from, to, {
				recursive: true,
				filter: (src) => !src.endsWith(".html"),
			})
		},
	}
}

/////////////////////////////////////////////////

import { cpSync, readdirSync } from "node:fs"
import { resolve } from "node:path"

import react from "@vitejs/plugin-react"
import type { Plugin, UserConfig } from "vite"
import { defineConfig } from "vite"

import { mergeⵧdeep } from "@monorepo-private/merge"
//import xPlugin from '@monorepo-private/vite-plugin-parcel-features'
//import Inspect from 'vite-plugin-inspect'
