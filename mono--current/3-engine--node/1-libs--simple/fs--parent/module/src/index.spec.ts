/////////////////////////////////////////////////

/* Fixtures built once in a throwaway temp dir:
 *
 *   worktree/                       classic/                bare/
 *     .git            ← a FILE!       .git/      ← a dir      deep/
 *     mono/                           package.json
 *       pnpm-workspace.yaml           deep/
 *       pkg/
 *         deep/
 *
 * "worktree" mirrors this very repo: the git root sits ABOVE the pnpm root,
 * so the two helpers must not resolve to the same dir.
 *
 * The safeties get two more, where every ".git" below is one the walk must REFUSE
 * to match -- planted for real, so a missing guard is a failing test, not a silent pass:
 *
 *   home-guard/            ← stands in for "/Users"      depth/
 *     .git/                                                .git/
 *     me/                  ← stands in for $HOME           l1/ … /l13/
 *       .git/              ← ie. a dotfiles repo
 *       proj/deep/
 *     other/deep/
 */
const MODULEⵧstub__name = "some-module.ts"

let tmp__dir: string
let dirⵧworktree: string
let dirⵧclassic: string
let dirⵧbare__deep: string

beforeAll(() => {
	tmp__dir = fs.mkdtempSync(nodeꓽpath.join(os.tmpdir(), "fs--parent-test-"))

	dirⵧworktree = nodeꓽpath.join(tmp__dir, "worktree")
	makeꓽdir(dirⵧworktree)
	fs.writeFileSync(nodeꓽpath.join(dirⵧworktree, ".git"), "gitdir: /elsewhere/.git\n") // as `git worktree add` writes it
	makeꓽdir(dirⵧworktree, "mono")
	fs.writeFileSync(nodeꓽpath.join(dirⵧworktree, "mono", "pnpm-workspace.yaml"), "packages:\n  - pkg\n")
	makeꓽdir(dirⵧworktree, "mono", "pkg", "deep")

	dirⵧclassic = nodeꓽpath.join(tmp__dir, "classic")
	makeꓽdir(dirⵧclassic)
	fs.mkdirSync(nodeꓽpath.join(dirⵧclassic, ".git", "objects"), { recursive: true }) // a real dir, as in a normal clone
	fs.writeFileSync(nodeꓽpath.join(dirⵧclassic, "package.json"), JSON.stringify({ name: "@fixture/classic" }))
	makeꓽdir(dirⵧclassic, "deep")

	dirⵧbare__deep = makeꓽdir(tmp__dir, "bare", "deep")
})

afterAll(() => {
	fs.rmSync(tmp__dir, { recursive: true, force: true })
})

afterEach(() => {
	vi.unstubAllEnvs() // several safeties tests re-point $HOME
})

/////////////////////////////////////////////////

describe(`@monorepo-private/fs--parent`, () => {
	describe("getꓽparent__git_repo_root()", () => {
		it(`resolves this very repo when handed a real module's own import.meta`, () => {
			const root = getꓽparent_git_repo__root(import.meta)

			expect(fs.existsSync(nodeꓽpath.join(root, ".git"))).toBe(true)
		})

		it(`finds a repo whose ".git" is a directory`, () => {
			expect(getꓽparent_git_repo__root(fakeꓽimport_meta(dirⵧclassic, "deep"))).toBe(dirⵧclassic)
		})

		it(`finds a repo whose ".git" is a FILE -- worktree / submodule`, () => {
			expect(getꓽparent_git_repo__root(fakeꓽimport_meta(dirⵧworktree, "mono", "pkg", "deep"))).toBe(dirⵧworktree)
		})

		it(`walks from the starting dir included, not from its parent`, () => {
			expect(getꓽparent_git_repo__root(fakeꓽimport_meta(dirⵧclassic))).toBe(dirⵧclassic)
		})

		it(`throws, naming the marker, when no repo is found up to the fs root`, () => {
			expect(() => getꓽparent_git_repo__root(fakeꓽimport_meta(dirⵧbare__deep))).toThrow("Not found")
		})
	})

	describe("getꓽparent__pnpm_monorepo_root()", () => {
		it(`resolves this very monorepo when handed a real module's own import.meta`, () => {
			const root = getꓽparent_pnpm_monorepo__root(import.meta)

			expect(fs.existsSync(nodeꓽpath.join(root, "pnpm-workspace.yaml"))).toBe(true)
		})

		it(`finds the dir holding "pnpm-workspace.yaml"`, () => {
			expect(getꓽparent_pnpm_monorepo__root(fakeꓽimport_meta(dirⵧworktree, "mono", "pkg", "deep"))).toBe(
				nodeꓽpath.join(dirⵧworktree, "mono"),
			)
		})

		it(`resolves independently of the git root when the two sit at different levels`, () => {
			const import_meta = fakeꓽimport_meta(dirⵧworktree, "mono", "pkg", "deep")

			expect(getꓽparent_pnpm_monorepo__root(import_meta)).toBe(nodeꓽpath.join(dirⵧworktree, "mono"))
			expect(getꓽparent_git_repo__root(import_meta)).toBe(dirⵧworktree)
		})

		it(`throws, naming the marker, when no workspace is found up to the fs root`, () => {
			expect(() => getꓽparent_pnpm_monorepo__root(fakeꓽimport_meta(dirⵧbare__deep))).toThrow("Not found")
		})
	})

	describe("getꓽparent__packageᐧjson__name()", () => {
		it(`resolves this very package when handed a real module's own import.meta`, () => {
			expect(getꓽparent_packageᐧjson__name(import.meta)).toBe("@monorepo-private/fs--parent")
		})
	})
})

/////////////////////////////////////////////////

// The helpers only ever read `url` + `dirname`, so a stub is enough to aim them at a fixture.
// Stubbing rather than planting real modules also keeps the paths verbatim: a real
// `import.meta` resolves symlinks, which on macOS turns /var/… into /private/var/….
function fakeꓽimport_meta(...dir__segments: string[]): ImportMeta {
	const dir = nodeꓽpath.join(...dir__segments)
	const file__path = nodeꓽpath.join(dir, MODULEⵧstub__name)

	return {
		url: pathToFileURL(file__path).href,
		filename: file__path,
		dirname: dir,
	} as ImportMeta
}

// `findPackageJSON()` rejects a path that doesn't exist, so every fixture dir gets a stub module
function makeꓽdir(...dir__segments: string[]): string {
	const dir = nodeꓽpath.join(...dir__segments)

	fs.mkdirSync(dir, { recursive: true })
	fs.writeFileSync(nodeꓽpath.join(dir, MODULEⵧstub__name), "")

	return dir
}

/////////////////////////////////////////////////

import * as fs from "node:fs"
import * as os from "node:os"
import * as nodeꓽpath from "node:path"
import { pathToFileURL } from "node:url"

import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest"

import { getꓽparent_git_repo__root, getꓽparent_packageᐧjson__name, getꓽparent_pnpm_monorepo__root } from "./index.ts"
