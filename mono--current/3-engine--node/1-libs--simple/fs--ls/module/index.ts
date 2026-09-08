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

// 1-level only
// hat tip to https://stackoverflow.com/a/24594123/587407
function lsDirsSync(srcpath: string, options: Partial<Options> = {}): Array<string> {
	const opts: Options = {
		...DEFAULT_OPTIONS,
		...options,
	}

	return fs
		.readdirSync(srcpath, { withFileTypes: true })
		.map((dirent) => {
			if (!dirent.parentPath) {
				throw new Error("Missing dirent.parentPath! Are you properly using node >= 20?")
			}
			return dirent
		})
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => (opts.full_path ? path.join(dirent.parentPath, dirent.name) : dirent.name))
		.sort()
}

// 1-level only
function lsFilesSync(srcpath: string, options: Partial<Options> = {}): Array<string> {
	const opts: Options = {
		...DEFAULT_OPTIONS,
		...options,
	}

	return fs
		.readdirSync(srcpath, { withFileTypes: true })
		.map((dirent) => {
			if (!dirent.parentPath) {
				throw new Error("Missing dirent.parentPath! Are you properly using node >= 20?")
			}
			return dirent
		})
		.filter((dirent) => dirent.isFile())
		.map((dirent) => (opts.full_path ? path.join(dirent.parentPath, dirent.name) : dirent.name))
		.sort()
}

// deep
function lsFilesRecursiveSync(srcpath: string, options: Partial<Options> = {}): Array<string> {
	const opts: Options = {
		...DEFAULT_OPTIONS,
		...options,
	}

	return fs
		.readdirSync(srcpath, { recursive: true, withFileTypes: true })
		.filter((dirent) => dirent.isFile())
		.map((dirent) => {
			const full_path = path.join(dirent.parentPath, dirent.name)
			return opts.full_path ? full_path : path.relative(srcpath, full_path)
		})
		.sort()
}

/////////////////////////////////////////////////

export { type Options, lsDirsSync, lsFilesSync, lsFilesRecursiveSync }
