import { expect } from "chai"

import { createꓽHttpClient } from "./client.ts"
import type { HttpClientError } from "./errors.ts"

/////////////////////////////////////////////////

describe(`http-client -- client`, function () {
	describe("path merging", function () {
		describe("when having NO base path", function () {
			it("should reject", async () => {
				expect(() => createꓽHttpClient("")).to.throw("Invalid URL")
			})
		})

		describe("when having a base path", function () {
			it("should correctly merge pathes -- AA", async () => {
				const client = createꓽHttpClient("https://api.linkedin.com/v2/") // note the trailing
				try {
					await client.get("/me") // note the leading
					throw new Error("Should have thrown")
				} catch (err: HttpClientError) {
					// correct path but no Auth
					expect(err).to.have.deep.property("url", "https://api.linkedin.com/v2/me")
					expect(err).to.have.deep.property("status", 401)
				}
			})
			it("should correctly merge pathes -- AB", async () => {
				const client = createꓽHttpClient("https://api.linkedin.com/v2/") // note the trailing
				try {
					await client.get("me") // note NO leading
					throw new Error("Should have thrown")
				} catch (err: HttpClientError) {
					// correct path but no Auth
					expect(err).to.have.deep.property("url", "https://api.linkedin.com/v2/me")
					expect(err).to.have.deep.property("status", 401)
				}
			})
			it("should correctly merge pathes -- BA", async () => {
				const client = createꓽHttpClient("https://api.linkedin.com/v2") // note NO trailing
				try {
					await client.get("/me")
					throw new Error("Should have thrown")
				} catch (err: HttpClientError) {
					// correct path but no Auth
					expect(err).to.have.deep.property("url", "https://api.linkedin.com/v2/me")
					expect(err).to.have.deep.property("status", 401)
				}
			})
			it("should correctly merge pathes -- BB", async () => {
				const client = createꓽHttpClient("https://api.linkedin.com/v2") // note NO trailing
				try {
					await client.get("me") // note NO leading
					throw new Error("Should have thrown")
				} catch (err: HttpClientError) {
					// correct path but no Auth
					expect(err).to.have.deep.property("url", "https://api.linkedin.com/v2/me")
					expect(err).to.have.deep.property("status", 401)
				}
			})
		})
	})
})
