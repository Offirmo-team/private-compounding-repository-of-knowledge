/* Extra fs functions to list directories and files under a given path
 */
import { strict as assert } from "node:assert"
import * as fs from "node:fs"
import * as path from "node:path"

/////////////////////////////////////////////////

interface Options {
	full_path: boolean
}

const DEFAULT_OPTIONS: Options = {
	full_path: true, // because it's what we usually want
}

// hat tip to https://stackoverflow.com/a/24594123/587407
function lsDirsSync(srcpath: string, options: Partial<Options> = {}): Array<string> {
	options = {
		...DEFAULT_OPTIONS,
		...options,
	}

	let result = fs
		.readdirSync(srcpath, { withFileTypes: true })
		.map((dirent) => {
			if (!dirent.parentPath) {
				throw new Error("Missing dirent.parentPath! Are you properly using node >= 20?")
			}
			return dirent
		})
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => (options.full_path ? path.join(dirent.parentPath, dirent.name) : dirent.name))

	return result.sort()
}

function lsFilesSync(srcpath: string, options: Partial<Options> = {}): Array<string> {
	options = {
		...DEFAULT_OPTIONS,
		...options,
	}

	let result = fs
		.readdirSync(srcpath, { withFileTypes: true })
		.map((dirent) => {
			if (!dirent.parentPath) {
				throw new Error("Missing dirent.parentPath! Are you properly using node >= 20?")
			}
			return dirent
		})
		.filter((dirent) => dirent.isFile())
		.map((dirent) => (options.full_path ? path.join(dirent.parentPath, dirent.name) : dirent.name))

	return result.sort()
}

function lsFilesRecursiveSync(srcpath: string, options: Partial<Options> = {}): Array<string> {
	options = {
		...DEFAULT_OPTIONS,
		...options,
	}

	let result = lsFilesSync(srcpath, options)
	let dirs = lsDirsSync(srcpath, options)
	dirs.forEach((full_dir) => {
		result = [...result, ...lsFilesRecursiveSync(full_dir)]
	})

	return result.sort()
}

/////////////////////////////////////////////////

export { type Options, lsDirsSync, lsFilesSync, lsFilesRecursiveSync }
