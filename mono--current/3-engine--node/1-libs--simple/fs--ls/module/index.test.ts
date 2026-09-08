import { lsDirsSync, lsFilesRecursiveSync, lsFilesSync } from "./index.ts"

/////////////////////////////////////////////////

/* Fixture built once in a throwaway temp dir:
 *   <root>/
 *     file-a.txt
 *     file-b.txt
 *     sub-1/
 *       nested.txt
 *     sub-2/          (empty)
 */
let root: string

beforeAll(() => {
	root = fs.mkdtempSync(path.join(os.tmpdir(), "fs--ls-test-"))
	fs.writeFileSync(path.join(root, "file-a.txt"), "a")
	fs.writeFileSync(path.join(root, "file-b.txt"), "b")
	fs.mkdirSync(path.join(root, "sub-1"))
	fs.writeFileSync(path.join(root, "sub-1", "nested.txt"), "nested")
	fs.mkdirSync(path.join(root, "sub-2"))
})

afterAll(() => {
	fs.rmSync(root, { recursive: true, force: true })
})

/////////////////////////////////////////////////

describe("@monorepo-private/fs--ls", () => {
	describe("lsDirsSync()", () => {
		it("lists only the direct sub-directories, sorted, as names", () => {
			expect(lsDirsSync(root, { full_path: false })).toEqual(["sub-1", "sub-2"])
		})

		it("returns absolute paths by default", () => {
			expect(lsDirsSync(root)).toEqual([path.join(root, "sub-1"), path.join(root, "sub-2")])
		})
	})

	describe("lsFilesSync()", () => {
		it("lists only the direct files, sorted, as names", () => {
			expect(lsFilesSync(root, { full_path: false })).toEqual(["file-a.txt", "file-b.txt"])
		})

		it("does not descend into sub-directories", () => {
			expect(lsFilesSync(root, { full_path: false })).not.toContain("nested.txt")
		})

		it("returns absolute paths by default", () => {
			expect(lsFilesSync(root)).toEqual([path.join(root, "file-a.txt"), path.join(root, "file-b.txt")])
		})
	})

	describe("lsFilesRecursiveSync()", () => {
		it("lists every file at any depth, sorted, relative to srcpath", () => {
			expect(lsFilesRecursiveSync(root, { full_path: false })).toEqual([
				"file-a.txt",
				"file-b.txt",
				path.join("sub-1", "nested.txt"),
			])
		})

		it("returns absolute paths by default", () => {
			expect(lsFilesRecursiveSync(root)).toEqual([
				path.join(root, "file-a.txt"),
				path.join(root, "file-b.txt"),
				path.join(root, "sub-1", "nested.txt"),
			])
		})
	})
})

/////////////////////////////////////////////////

import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"

import { afterAll, beforeAll, describe, expect, it } from "vitest"
