/////////////////////////////////////////////////

// same as typeof but for better matching
// returns:
// - "undefined"
// - "array" NEW
// - "null" NEW
// - "boolean"
// - "number"
// - "bigint"
// - "string"
// - "symbol"
// - "function"
// - "thenable" NEW
// - "object"
// Use case: shape matching, see below
export function getꓽtypeofⵧimproved(x: any): string {
	const t = typeof x

	switch (t) {
		case "object":
			if (Array.isArray(x)) return "array"
			if (x === null) return "null"
			break
		default:
			break
	}

	if (isꓽThenable(x)) return "thenable"

	return t
}

/////////////////////////////////////////////////

type Options = {
	match_reference_props:
		| "all" // all properties from ref must be matched by tested
		| "some" // tested must have at least 1 prop from ref
	// add more one day if needed

	allow_extra_props: boolean // allow/disallow extraneous properties

	type_match:
		| "any" // no type test on matching props
		//| 'typeof' // typeof
		| "simple" // typeof + slight improvements to not match arrays/null

	test_depth: 0 // which depth to go. !0 not supported yet
}

// TODO swap has -> assert?
export function assertꓽshape<T extends object>(
	reference: T,
	under_test: object,
	{
		match_reference_props = "all",
		allow_extra_props = true,
		type_match = "simple",
		test_depth = 0,
	}: Partial<Options> = {},
): asserts under_test is T {
	const ǃ = assert_from({ assertꓽshape })

	ǃ.forⵧparam({ reference }).require(isꓽobjectⵧkv(reference), `should be a k/v object!`)
	ǃ.forⵧparam({ under_test }).require(isꓽobjectⵧkv(under_test), `should be a k/v object!`)

	const keysⵧref = new Set<string>(Object.keys(reference))
	const keysⵧunder_test = new Set<string>(Object.keys(under_test))

	const keysⵧmatching = keysⵧunder_test.intersection(keysⵧref) as Set<keyof typeof reference>

	// even if technically possible with some + allow extra,
	// this is too suspicious
	ǃ.require(!keysⵧunder_test.isDisjointFrom(keysⵧref), `ref & ut must have some common props`)

	switch (match_reference_props) {
		case "all":
			ǃ.require(keysⵧunder_test.isSupersetOf(keysⵧref), `missing props from reference`)
			break
		case "some":
			// already tested above with isDisjointFrom
			//if (keysⵧmatching.size === 0) return false
			break
		default:
			throw new Error(`hasꓽshape: unsupported match_reference_props value!`)
	}

	if (!allow_extra_props) {
		const extra = keysⵧunder_test.difference(keysⵧref)
		ǃ.require(extra.size === 0, `unexpected extraneous props, ex. "${Array.from(extra.keys())[0]!}"!`)
	}

	switch (type_match) {
		case "any":
			// no further test
			// no need to recurse
			break
		case "simple": {
			for (const key of keysⵧmatching) {
				ǃ.forⵧvalue({ key }).ensure(
					getꓽtypeofⵧimproved(reference[key]) === getꓽtypeofⵧimproved((under_test as any)[key]),
					`types for prop "${String(key)}" should match: "${getꓽtypeofⵧimproved(reference[key])}" vs. "${getꓽtypeofⵧimproved((under_test as any)[key])}"`,
				)
			}
			ǃ.assert(test_depth === 0, `unsupported test_depth param`)
			break
		}
		default:
			throw new Error(`hasꓽshape: unsupported type_match value!`)
	}
}

export function hasꓽshape<T extends object>(
	reference: T,
	under_test: object,
	options: Partial<Options> = {},
): under_test is T {
	try {
		assertꓽshape(reference, under_test, options)
		return true
	} catch {
		// TODO one day filter arg error vs runtime error
		return false
	}
}

/////////////////////////////////////////////////

import { assert_from } from "@monorepo-private/assert"

import { isꓽobjectⵧkv } from "../01-primitives/index.ts"
import { isꓽThenable } from "../03-thenable/index.ts"
