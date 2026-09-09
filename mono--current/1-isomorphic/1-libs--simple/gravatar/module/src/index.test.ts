import { describe, it, expect } from "vitest"

import { getꓽgravatar_url } from "./index.ts"

describe("@monorepo-private/gravatar", () => {
	describe("getꓽgravatar_url()", () => {
		it("builds the avatar URL from the SHA-256 of the normalized email (Gravatar docs vector)", async () => {
			expect(await getꓽgravatar_url("MyEmailAddress@example.com")).toBe(
				"https://www.gravatar.com/avatar/84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee?s=256",
			)
		})

		it("defaults the size to 256px and honors a custom size", async () => {
			expect(await getꓽgravatar_url("foo@bar.com")).toMatch(/\?s=256$/)
			expect(await getꓽgravatar_url("foo@bar.com", { size‿px: 64 })).toMatch(/\?s=64$/)
		})

		it("normalizes (trim + lowercase) so casing/whitespace map to the same avatar", async () => {
			const canonical =
				"https://www.gravatar.com/avatar/0c7e6a405862e402eb76a70f8a26fc732d07c32931e9fae9ab1582911d2e8a3b?s=256"
			expect(await getꓽgravatar_url("foo@bar.com")).toBe(canonical)
			expect(await getꓽgravatar_url(" Foo@Bar.com ")).toBe(canonical)
		})

		it("rejects an empty email", async () => {
			await expect(getꓽgravatar_url("   ")).rejects.toThrow()
		})
	})
})
