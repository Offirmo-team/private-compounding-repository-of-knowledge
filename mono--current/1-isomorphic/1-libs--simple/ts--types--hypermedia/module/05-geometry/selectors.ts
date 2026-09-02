/////////////////////////////////////////////////

export function getꓽdimensions2D(spec: Immutable<Dimensions2DSpec>): Dimensions2D {
	const result: Dimensions2D = {
		height: 0,
		width: 0,
	}

	if (spec.width) {
		result.width = spec.width
		result.height = (() => {
			if (spec.height) return spec.height

			if (spec.aspect_ratio) return spec.width / spec.aspect_ratio

			throw new Error(`Not enough specs to infer the height of a 2D dimension!`)
		})()
	} else if (spec.height) {
		result.height = spec.height
		result.width = (() => {
			if (spec.width) return spec.width

			if (spec.aspect_ratio) return spec.height * spec.aspect_ratio

			throw new Error(`Not enough specs to infer the width of a 2D dimension!`)
		})()
	} else {
		throw new Error(`Not enough specs to infer a 2D dimension!`)
	}

	if (spec.aspect_ratio) {
		assert(
			result.width / result.height === spec.aspect_ratio,
			`Aspect ratio should match! (${spec.aspect_ratio} vs ${result.width / result.height})`,
		)
	}

	return result
}

/////////////////////////////////////////////////

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable, IETFLanguageType, Charset } from "@monorepo-private/ts--types"

import type { Dimensions2DSpec, Dimensions2D } from "./types.ts"
