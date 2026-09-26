/////////////////////////////////////////////////

const built_at‿tms: TimestampUTCMs = getꓽUTC_timestamp‿ms()

const WEB_APP_BUILD_PKG_dir‿abs: PathⳇAbsolute = nodeꓽpath.resolve(
	getꓽparent_packageᐧjson__dir(import.meta),
	"../90-final--web-app",
)

const WEB_APP_BUILD_ROOT_dir‿abs: PathⳇAbsolute = nodeꓽpath.join(WEB_APP_BUILD_PKG_dir‿abs, "module/src/")

// `docs/` (= what GitHub Pages serves) sits at the git repo root, above the monorepo root
const DOCSⵧnightly_dir‿abs = nodeꓽpath.join(
	getꓽparent_git_repo__root(import.meta),
	"docs/@tracer-bullet--web-app/nightly",
)

/////////////////////////////////////////////////

console.group(`Building app "${getꓽparent_packageᐧjson__name(import.meta)}"/${SPECⵧprod.title}"…`)
console.table({
	built_at‿tms,
	//WEB_APP_BUILD_PKG_dir‿abs,
	WEB_APP_BUILD_ROOT_dir‿abs,
	DOCSⵧnightly_dir‿abs,
})

/////////////////////////////////////////////////
// safety prep

console.group(`Ensuring deps…`)
await ೱspawnCorrectly<void>({
	spawnCommand: "pnpm",
	spawnArgs: ["install"],
	spawnOptions: { cwd: getꓽparent_pnpm_monorepo__root(import.meta) },
	onStdout: (_, stdoutFragment) => {
		// live log
		process.stdout.write(stdoutFragment)
	},
})
console.groupEnd()

/////////////////////////////////////////////////

// TODO filter .map ?

;(async function refreshꓽnightly() {
	console.group(`Refreshing "nightly"…`)

	const bundleⵧnightly = await getꓽwebᝍpropertyᝍbundle({
		...SPECⵧnightly,
		built_at‿tms,
	})

	// for inspection
	await ೱwriteꓽfile_map(bundleⵧnightly.files, nodeꓽpath.resolve(import.meta.dirname, "./~~output"), { rm: true })

	const served_files = getꓽsubpath(bundleⵧnightly.files, bundleⵧnightly.meta.serve_me‿relpath)

	await ೱwriteꓽfile_map(served_files, WEB_APP_BUILD_ROOT_dir‿abs, { rm: true })

	console.log(`Formatting…`)
	await ೱspawnCorrectly<void>({
		spawnCommand: "pnpx",
		spawnArgs: ["oxfmt"],
		spawnOptions: { cwd: getꓽparent_pnpm_monorepo__root(import.meta) },
		onStdout: (_, stdoutFragment) => {
			// live log
			process.stdout.write(stdoutFragment)
		},
	}).catch((_) => {
		// formatting is best effort, we don't care about issues
	})

	console.group(`Bundling…`)
	// Note: we expect the build command to clean first, not our concern
	await ೱspawnCorrectly<void>({
		spawnCommand: "pnpm",
		spawnArgs: ["run", "build"],
		spawnOptions: { cwd: WEB_APP_BUILD_PKG_dir‿abs },
		onStdout: (_, stdoutFragment) => {
			// live log
			process.stdout.write(stdoutFragment)
		},
	})
	console.groupEnd()

	const built_files = await ೱloadꓽfiles(nodeꓽpath.join(WEB_APP_BUILD_PKG_dir‿abs, "dist"))

	// the build's output wins: its .html reference the hashed, bundled assets
	await ೱwriteꓽfile_map(mergeꓽfiles_maps(served_files, built_files), DOCSⵧnightly_dir‿abs, { rm: true })

	console.groupEnd()
})()

/////////////////////////////////////////////////
/*
await generateꓽwebᝍproperty(
	{
		...SPECⵧprod,
		built_at‿tms,
	},
	nodeꓽpath.resolve(nodeꓽpath.dirname(fileURLToPath(import.meta.url)), "~~output--prod"),
	{ rm: true },
)
/*
await generateꓽwebᝍproperty(
	{
		...SPECⵧpreprod,
		built_at‿tms,
	},
	nodeꓽpath.resolve(nodeꓽpath.dirname(fileURLToPath(import.meta.url)), "~~output--preprod"),
	{ rm: true },
)
*/ /*
await generateꓽwebᝍproperty(
	{
		...SPECⵧnightly,
		built_at‿tms,
	},
	nodeꓽpath.resolve(nodeꓽpath.dirname(fileURLToPath(import.meta.url)), "~~output--nightly"),
	{ rm: true },
)
*/

/////////////////////////////////////////////////

import * as nodeꓽpath from "node:path"

import {
	ೱloadꓽfiles,
	ೱwriteꓽfile_map,
	getꓽwebᝍpropertyᝍbundle,
	getꓽsubpath,
	mergeꓽfiles_maps,
} from "@web-property-outfitter/generator--website-entry-points"

import {
	getꓽparent_git_repo__root,
	getꓽparent_packageᐧjson__dir,
	getꓽparent_packageᐧjson__name,
	getꓽparent_pnpm_monorepo__root,
} from "@monorepo-private/fs--parent"
import { ೱspawnCorrectly } from "@monorepo-private/spawn-correctly"
import { getꓽUTC_timestamp‿ms, type TimestampUTCMs } from "@monorepo-private/timestamps"
import type { PathⳇAbsolute } from "@monorepo-private/ts--types"

import { SPECⵧprod, SPECⵧpreprod, SPECⵧnightly } from "../index.ts"
