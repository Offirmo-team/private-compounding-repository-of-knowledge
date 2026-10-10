#!/usr/bin/env node
// Deletes the dirs git considers empty = not ignored themselves + not holding any tracked or untracked-unignored entry.
// ⚠️ their ignored content (.DS_Store, node_modules/, .env…) is deleted with them!
// Usage: delete-empty-dirs.ts [dir=.] [--dry]
import { spawnSync } from "node:child_process"
import * as fs from "node:fs"
import * as path from "node:path"

const MAX_LISTED_FILES = 5

main(process.argv.slice(2))

/////////////////////

function main(args: readonly string[]): void {
	// deleting is the default, so a typo'd "--dry" must NOT be silently ignored
	const unknown_flags = args.filter((arg) => arg.startsWith("--") && arg !== "--dry")
	if (unknown_flags.length > 0) throw new Error(`Unknown flag(s): ${unknown_flags.join(", ")}`)

	const should_delete = !args.includes("--dry")
	const root_dir = path.resolve(args.find((arg) => !arg.startsWith("--")) ?? ".")

	if (run_git(root_dir, ["check-ignore", "--quiet", "."]).status === 0)
		throw new Error(`"${root_dir}" is git-ignored, refusing to proceed!`)

	const dirs_to_delete = get_topmost_deletable_dirs(root_dir)

	dirs_to_delete.forEach((dir) => {
		const abs_dir = path.join(root_dir, dir)
		console.log(`${should_delete ? "🗑  deleting" : "👀 would delete"} ${dir}/  ${describe_content(abs_dir)}`)
		if (should_delete) fs.rmSync(abs_dir, { recursive: true })
	})

	console.log(
		dirs_to_delete.length === 0
			? "✔ no empty dir found"
			: should_delete
				? `✔ deleted ${dirs_to_delete.length} dir(s)`
				: `${dirs_to_delete.length} dir(s) would be deleted, re-run without --dry to delete them`,
	)
}

// Deleting only the topmost ones (recursively) is equivalent to a depth-first deletion
function get_topmost_deletable_dirs(root_dir: string): string[] {
	const visible_entries = run_git(root_dir, ["ls-files", "-z", "--cached", "--others", "--exclude-standard"])
		.stdout.split("\0")
		.filter(Boolean)
		.map((entry) => entry.replace(/\/$/, "")) // nested repos are listed as "dir/"

	// visible entries themselves are NOT descended into: submodules & nested repos manage their own content
	const dirs_to_descend = new Set(["", ...visible_entries.flatMap(get_ancestors)])
	const protected_paths = new Set([...dirs_to_descend, ...visible_entries])

	const candidates = [...dirs_to_descend]
		.flatMap((dir) => list_subdirs(root_dir, dir))
		.filter((dir) => !protected_paths.has(dir) && path.posix.basename(dir) !== ".git")

	const ignored_candidates = get_ignored(root_dir, candidates)

	return candidates.filter((dir) => !ignored_candidates.has(dir)).sort()
}

function describe_content(abs_dir: string): string {
	const files = fs
		.readdirSync(abs_dir, { recursive: true, withFileTypes: true })
		.filter((entry) => !entry.isDirectory())
		.map((entry) => path.relative(abs_dir, path.join(entry.parentPath, entry.name)))
		.sort()

	if (files.length === 0) return "[empty]"

	return `[${files.length} ignored: ${files.slice(0, MAX_LISTED_FILES).join(", ")}${files.length > MAX_LISTED_FILES ? ", …" : ""}]`
}

function get_ancestors(entry: string): string[] {
	const ancestor_segments = entry.split("/").slice(0, -1)
	return ancestor_segments.map((_, index) => ancestor_segments.slice(0, index + 1).join("/"))
}

function list_subdirs(root_dir: string, dir: string): string[] {
	const abs_dir = path.join(root_dir, dir)

	if (!fs.existsSync(abs_dir)) return [] // ancestor of a tracked file deleted from the work tree

	return fs
		.readdirSync(abs_dir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory()) // symlinks are not dirs = not followed
		.map((entry) => path.posix.join(dir, entry.name))
}

function get_ignored(root_dir: string, paths: readonly string[]): Set<string> {
	const { stdout } = run_git(root_dir, ["check-ignore", "-z", "--stdin"], paths.join("\0"))
	return new Set(stdout.split("\0").filter(Boolean))
}

function run_git(cwd: string, args: readonly string[], input?: string): { status: 0 | 1; stdout: string } {
	const { status, stdout, stderr, error } = spawnSync("git", args, { cwd, input, encoding: "utf8", maxBuffer: 1 << 30 })

	if (error) throw error
	// 1 = check-ignore's "nothing is ignored"
	if (status !== 0 && status !== 1) throw new Error(`"git ${args.join(" ")}" failed (${status}): ${stderr}`)

	return { status, stdout }
}
