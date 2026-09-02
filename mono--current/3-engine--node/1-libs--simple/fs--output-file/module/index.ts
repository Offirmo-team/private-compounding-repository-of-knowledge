import * as fs from "node:fs/promises"
import * as path from "node:path"

import { promiseTry } from "@monorepo-private/promise-try"

export function outputFileSync() {
	throw new Error(`Not implemented!`)
}

export function ೱoutputꓽfile(...args: Parameters<typeof fs.writeFile>): ReturnType<typeof fs.writeFile> {
	return promiseTry(function ensure_parent_dir() {
		const file = args[0]

		if (typeof file === "string") return fs.mkdir(path.dirname(file), { recursive: true })

		return undefined
	}).then(() => {
		return fs.writeFile(...args)
	})
}
