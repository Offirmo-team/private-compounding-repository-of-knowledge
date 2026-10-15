import { describe, it, expect } from "vitest"

import { deriveꓽgit_clone_dir, inferꓽgit_owner_category, parseꓽgit_remote_url } from "./git-clone-dir.ts"

describe("@infinite-monorepo/heuristics — git clone dir", () => {
	describe("deriveꓽgit_clone_dir()", () => {
		it("groups Offirmo orgs under x-external/off, owner lowercased, repo name case preserved", () => {
			expect(
				deriveꓽgit_clone_dir({
					url: "https://github.com/Offirmo-team/private-compounding-repository-of-knowledge.git",
				}),
			).toBe("$HOME/work/src/x-external/off/offirmo-team/private-compounding-repository-of-knowledge")
			expect(deriveꓽgit_clone_dir({ url: "git@offirmo.github.com:offirmo/Offirmo-Monorepo.git" })).toBe(
				"$HOME/work/src/x-external/off/offirmo/Offirmo-Monorepo",
			)
		})

		it("puts unknown owners under x-external", () => {
			expect(deriveꓽgit_clone_dir({ url: "https://github.com/Microsoft/TypeScript/" })).toBe(
				"$HOME/work/src/x-external/microsoft/TypeScript",
			)
		})

		it("puts personal owners under private and work owners at top level", () => {
			const owners = { ownersⵧpersonal: ["JohnDoe"], ownersⵧwork: ["ACME-corp"] }
			expect(deriveꓽgit_clone_dir({ ...owners, url: "git@github.com:johndoe/dotfiles.git" })).toBe(
				"$HOME/work/src/private/johndoe/dotfiles",
			)
			expect(deriveꓽgit_clone_dir({ ...owners, url: "ssh://git@bitbucket.acme.com:7999/acme-corp/api.git" })).toBe(
				"$HOME/work/src/acme-corp/api",
			)
		})

		it("honors custom root, subdirs and dir name", () => {
			expect(
				deriveꓽgit_clone_dir({
					url: "https://github.com/facebook/react.git",
					dirⵧroot: "/tmp/src/",
					subdir_by_category: { external: "3rd-party" },
					dir_nameⵧcustom: "react--fork",
				}),
			).toBe("/tmp/src/3rd-party/facebook/react--fork")
		})

		it("rejects an unparseable URL", () => {
			expect(() => deriveꓽgit_clone_dir({ url: "   " })).toThrow()
			expect(() => deriveꓽgit_clone_dir({ url: "https://github.com/Offirmo/.git" })).toThrow()
		})
	})

	describe("parseꓽgit_remote_url()", () => {
		it("extracts owner and repo name from https and ssh URLs", () => {
			const expected = { owner: "Offirmo", repo_name: "offirmo-monorepo" }
			expect(parseꓽgit_remote_url("https://github.com/Offirmo/offirmo-monorepo.git")).toEqual(expected)
			expect(parseꓽgit_remote_url("https://github.com/Offirmo/offirmo-monorepo")).toEqual(expected)
			expect(parseꓽgit_remote_url("git@github.com:Offirmo/offirmo-monorepo.git")).toEqual(expected)
		})
	})

	describe("inferꓽgit_owner_category()", () => {
		it("gives offirmo > work > personal precedence, case-insensitively", () => {
			const owners = {
				ownersⵧoffirmo: ["offirmo"],
				ownersⵧwork: ["Offirmo", "both"],
				ownersⵧpersonal: ["both", "me"],
			}
			expect(inferꓽgit_owner_category("OFFIRMO", owners)).toBe("offirmo")
			expect(inferꓽgit_owner_category("both", owners)).toBe("work")
			expect(inferꓽgit_owner_category("Me", owners)).toBe("personal")
			expect(inferꓽgit_owner_category("someone", owners)).toBe("external")
		})
	})
})
