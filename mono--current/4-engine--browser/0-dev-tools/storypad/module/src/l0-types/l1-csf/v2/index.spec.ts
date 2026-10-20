import { expect } from "chai"

import { LIB } from "../../../consts.ts"

import * as NoMetaStories from "./index--no-meta.stories.ts"

import { isꓽStory‿v2 } from "./index.ts"

/////////////////////////////////////////////////

describe(`${LIB} -- type -- CSF v2`, function () {
	describe("isꓽStory‿v2", function () {
		it("should work", () => {
			Object.entries(NoMetaStories).forEach(([name, story]) => {
				expect(isꓽStory‿v2(story), `isꓽStory‿v2(${name})`).to.be.true
			})
		})
	})
})
