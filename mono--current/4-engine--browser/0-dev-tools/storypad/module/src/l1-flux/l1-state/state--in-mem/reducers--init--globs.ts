import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import { SEPⵧSEGMENTS, SEPⵧSTORY } from "../../../consts.ts"
import {
	type ImportGlob,
	type Module‿Parcelv2,
	isꓽMultiModule‿Parcelv2,
	isꓽModule‿Parcelv2,
	isꓽGlob‿Parcelv2,
	isꓽGlob‿Vitev8,
} from "../../../l0-types/l0-glob/index.ts"
import type { GlobLeave, GlobLeaveⳇAsync } from "../../../l0-types/l0-glob/types.ts"
import { type StoryEntry, isꓽStoryEntry } from "../types.ts"

import { registerꓽstory } from "./reducers.ts"
import type { State } from "./types.ts"

/////////////////////////////////////////////////

/////////////////////////////////////////////////

const DEBUGⵧglob_parsing = true

async function registerꓽstoriesⵧfrom_glob(state: State, stories_glob: Immutable<ImportGlob>): Promise<State> {
	DEBUGⵧglob_parsing && console.groupCollapsed(`registerꓽstoriesⵧfrom_glob()`)

	state = await _registerꓽstoriesⵧfrom_glob_or_module(state, stories_glob, [])

	DEBUGⵧglob_parsing && console.groupEnd()

	return state
}

async function _registerꓽstoriesⵧfrom_glob_or_module(
	state: State,
	stories_glob: Immutable<ImportGlob>,
	parent_path: string[] = [],
): Promise<State> {
	DEBUGⵧglob_parsing && console.group(`_registerꓽstoriesⵧfrom_glob_or_module(${parent_path.join(SEPⵧSEGMENTS)})`)
	DEBUGⵧglob_parsing && console.log("glob=", stories_glob)

	// note: we intentionally don't sort to keep the intended order (fs order should happen naturally anyway)
	await Object.keys(stories_glob)
		.sort()
		.reduce(async (acc, key) => {
			await acc

			assert(!key.includes(SEPⵧSEGMENTS), `Key contains a forbidden character! (SEP)`)
			assert(!key.includes(" "), `Key contains a forbidden character! (space)`)

			// if dynamic import, can be a promise in the process of being resolved
			const blob = await Promise.resolve(stories_glob[key])

			const subpath = [...parent_path, key]

			switch (true) {
				case Object.keys(blob).length === 0:
					// empty or ~comment
					// ignore
					break

				case isꓽModule‿Parcelv2(blob):
					if (key === "index") subpath.pop() // useless
					state = await _registerꓽstoriesⵧfromⵧModule‿Parcelv2(state, blob, subpath)
					break

				case isꓽMultiModule‿Parcelv2(blob): {
					// special case... (see type definition)
					// let's break this multi-module into individual modules
					state = await Object.keys(blob)
						.sort()
						.reduce(async (acc, extension) => {
							const state = await acc
							const module: Module‿Parcelv2 = {
								[extension]: (blob as any)[extension]!,
							}
							return await _registerꓽstoriesⵧfromⵧModule‿Parcelv2(state, module, [...subpath, extension])
						}, Promise.resolve(state))
					break
				}

				case isꓽGlob‿Vitev8(blob): {
					state = await Object.keys(blob)
						.sort()
						.reduce(async (acc, file_path) => {
							const state = await acc
							const extra_path = file_path.split("/").filter((s) => s !== "..") // vite "root" is strange

							let basename = extra_path.pop()!
							const extension = basename.split(".").at(-1)!
							basename = basename.slice(0, -extension.length - 1)
							if (basename.endsWith(".stories")) basename = basename.slice(0, -8)

							return await _registerꓽstoriesⵧfromⵧexports(state, (blob as any)[file_path]!, [
								...subpath,
								...extra_path,
								basename,
								extension,
							])
						}, Promise.resolve(state))
					break
				}

				default:
					// we assume it's a Parcel v2 glob (hard to be sure)
					state = await _registerꓽstoriesⵧfrom_glob_or_module(state, blob, subpath)
					//console.error({key, blob})
					//throw new Error(`Unsupported blob field!`)
					break
			}
		}, Promise.resolve())

	DEBUGⵧglob_parsing && console.groupEnd()

	return state
}

async function _registerꓽstoriesⵧfromⵧModule‿Parcelv2(
	state: State,
	story_module: Immutable<Module‿Parcelv2>,
	parent_path: string[] = [],
): Promise<State> {
	DEBUGⵧglob_parsing &&
		console.group(`_registerꓽstoriesⵧfromⵧModule‿Parcelv2(${parent_path.join(SEPⵧSEGMENTS)}.[js/ts/...])`)
	console.log("module=", story_module)

	const exports_sync_or_async = story_module.js || story_module.jsx || story_module.ts || story_module.tsx
	assert(exports_sync_or_async, `ESModule unrecognized extension! (Please implement)`)

	state = await _registerꓽstoriesⵧfromⵧexports(state, exports_sync_or_async, parent_path)

	DEBUGⵧglob_parsing && console.groupEnd()

	return state
}

async function _registerꓽstoriesⵧfromⵧexports(
	state: State,
	exportsⵧraw: GlobLeave,
	parent_path: string[] = [],
): Promise<State> {
	DEBUGⵧglob_parsing && console.group(`_registerꓽstoriesⵧfromⵧexports(${parent_path.join(SEPⵧSEGMENTS)})`)

	const exports = await (async () => {
		// TODO one day "on demand" resolution to avoid global js+styles pollution
		if (typeof exportsⵧraw === "function") {
			try {
				return await exportsⵧraw()
			} catch (err) {
				console.error(`💣Error while loading the story "${parent_path.join(SEPⵧSEGMENTS)}"!`, err)
				console.error(err)
				return {
					"!ERROR!": () => {
						console.error(`💣Error while loading the story "${parent_path.join(SEPⵧSEGMENTS)}"!`, err)
						return `Error while loading stories from "${parent_path.join(SEPⵧSEGMENTS)}"! (see console)`
					},
				}
			}
		}

		return exportsⵧraw
	})()

	const { default: meta, ...stories } = exports

	Object.keys(stories).forEach((story_key) => {
		DEBUGⵧglob_parsing && console.log(`Found story: key "${story_key}"`)

		if (story_key.startsWith("_")) {
			console.debug(`Ignoring because it starts with an underscore.`)
			return
		}

		assert(!story_key.includes(SEPⵧSTORY), `Story key contains a forbidden character! (story sep)`)
		assert(
			![...parent_path, story_key].some((p) => p.includes(SEPⵧSEGMENTS)),
			`Story path contains a forbidden character!`,
		) // TODO one day improve

		const uid = [...parent_path, story_key].join(SEPⵧSEGMENTS)

		const story_entry: StoryEntry = {
			uid,
			story: stories[story_key]!,
			meta,
		}
		DEBUGⵧglob_parsing && console.log(`new story entry: ${uid}`, story_entry)
		assert(isꓽStoryEntry(story_entry), `freshly created ${uid} is not a story entry??`)
		state = registerꓽstory(state, story_entry, [...parent_path, story_key].join(SEPⵧSEGMENTS))
	})

	DEBUGⵧglob_parsing && console.groupEnd()

	return state
}

/////////////////////////////////////////////////

export { registerꓽstoriesⵧfrom_glob }
