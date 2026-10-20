#!/usr/bin/env node
// Deletes the dirs git considers empty = not ignored themselves + not holding any tracked or untracked-unignored entry.
// ⚠️ their ignored content (.DS_Store, node_modules/, .env…) is deleted with them! (except git repos: holding dirs are skipped)
// Usage: cleanup-empty-dirs.ts [dir=.] [--dry]
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

	const deletable_dirs = get_topmost_deletable_dirs(root_dir).map((dir) => {
		const leaves = list_leaves_deep(path.join(root_dir, dir)).sort()
		return { dir, leaves, nested_repos: leaves.filter(is_dot_git).map(path.dirname) }
	})
	// an ignored nested repo is invisible to git, yet its history (unpushed commits, stashes…) would be lost
	const dirs_holding_repos = deletable_dirs.filter(({ nested_repos }) => nested_repos.length > 0)
	const dirs_to_delete = deletable_dirs.filter(({ nested_repos }) => nested_repos.length === 0)

	dirs_to_delete.forEach(({ dir, leaves }) => {
		console.log(`${should_delete ? "🗑  deleting" : "👀 would delete"} ${dir}/  ${describe_content(leaves)}`)
		if (should_delete) fs.rmSync(path.join(root_dir, dir), { recursive: true })
	})

	console.log(
		dirs_to_delete.length === 0
			? "✔ no empty dir found"
			: should_delete
				? `✔ deleted ${dirs_to_delete.length} dir(s)`
				: `${dirs_to_delete.length} dir(s) would be deleted, re-run without --dry to delete them`,
	)

	dirs_holding_repos.forEach(({ dir, nested_repos }) =>
		console.warn(`⚠️  skipped ${dir}/  [holds git repo(s): ${nested_repos.join(", ")}] review it manually`),
	)
}

// Deleting only the topmost ones (recursively) is equivalent to a depth-first deletion
function get_topmost_deletable_dirs(root_dir: string): string[] {
	const visible_entries = run_git(root_dir, ["ls-files", "-z", "--cached", "--others", "--exclude-standard"])
		.stdout.split("\0")
		.filter(Boolean)
		.map((entry) => entry.replace(/\/$/, "")) // nested repos are listed as "dir/"

	// visible entries themselves are NOT descended into: submodules & nested repos manage their own content
	const dirs_to_descend = [
		...new Map(["", ...visible_entries.flatMap(get_ancestors)].map((dir) => [to_fs_identity(dir), dir])).values(),
	]
	const protected_ids = new Set([...dirs_to_descend, ...visible_entries].map(to_fs_identity))

	const candidates = dirs_to_descend
		.flatMap((dir) => list_subdirs(root_dir, dir))
		.filter((dir) => !protected_ids.has(to_fs_identity(dir)) && !is_dot_git(dir))

	const ignored_ids = new Set(get_ignored(root_dir, candidates).map(to_fs_identity))

	return candidates.filter((dir) => !ignored_ids.has(to_fs_identity(dir))).sort()
}

// leaves = files, symlinks and .git entries (dir or worktree/submodule file), relative to abs_dir
// NOT readdirSync({ recursive: true }) which follows symlinks = explodes on node_modules' symlink cycles
function list_leaves_deep(abs_dir: string, rel_dir = ""): string[] {
	return fs.readdirSync(path.join(abs_dir, rel_dir), { withFileTypes: true }).flatMap((entry) => {
		const rel_path = path.join(rel_dir, entry.name)
		return entry.isDirectory() && !is_dot_git(rel_path) ? list_leaves_deep(abs_dir, rel_path) : [rel_path]
	})
}

function is_dot_git(fs_path: string): boolean {
	return to_fs_identity(path.basename(fs_path)) === ".git"
}

function describe_content(leaves: readonly string[]): string {
	if (leaves.length === 0) return "[empty]"

	return `[${leaves.length} ignored: ${leaves.slice(0, MAX_LISTED_FILES).join(", ")}${leaves.length > MAX_LISTED_FILES ? ", …" : ""}]`
}

// git (index, NFC-precomposed) and readdir() (on-disk bytes) can spell the same macOS entry differently (case, Unicode normalization)
// over-matching is safe: it can only prevent a deletion
function to_fs_identity(fs_path: string): string {
	return fs_path.normalize("NFC").toLowerCase()
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

function get_ignored(root_dir: string, paths: readonly string[]): string[] {
	const { stdout } = run_git(root_dir, ["check-ignore", "-z", "--stdin"], paths.join("\0"))
	return stdout.split("\0").filter(Boolean)
}

function run_git(cwd: string, args: readonly string[], input?: string): { status: 0 | 1; stdout: string } {
	const { status, stdout, stderr, error } = spawnSync("git", args, { cwd, input, encoding: "utf8", maxBuffer: 1 << 30 })

	if (error) throw error
	// 1 = check-ignore's "nothing is ignored"
	if (status !== 0 && status !== 1) throw new Error(`"git ${args.join(" ")}" failed (${status}): ${stderr}`)

	return { status, stdout }
}
