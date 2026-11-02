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

function ǃꓽshape<T extends object>(
	reference: T,
	under_test: object,
	{
		match_reference_props = "all",
		allow_extra_props = true,
		type_match = "simple",
		test_depth = 0,
	}: Partial<Options> = {},
) {
	const ǃ = assert_from({ assertꓽshape })

	ǃ.forⵧparam({ reference }).check(isꓽobjectⵧdefined_non_array(reference), `should be a k/v object`)
	ǃ.forⵧparam({ under_test }).check(isꓽobjectⵧdefined_non_array(under_test), `should be a k/v object`)
	if (ǃ.hasꓽissues()) return ǃ

	const keysⵧref = new Set<string>(Object.keys(reference))
	const keysⵧunder_test = new Set<string>(Object.keys(under_test))

	const keysⵧmatching = keysⵧunder_test.intersection(keysⵧref) as Set<keyof typeof reference>

	// even if technically possible with some + allow extra,
	// this is too suspicious
	ǃ.check(!keysⵧunder_test.isDisjointFrom(keysⵧref), `ref & ut must have some common props`)

	switch (match_reference_props) {
		case "all":
			ǃ.check(keysⵧunder_test.isSupersetOf(keysⵧref), `missing props from reference`)
			break
		case "some":
			// already tested above with isDisjointFrom
			//if (keysⵧmatching.size === 0) return false
			break
		default:
			assertⵧnever_reached({ match_reference_props })
	}

	if (!allow_extra_props) {
		const extra = keysⵧunder_test.difference(keysⵧref)
		ǃ.check(extra.size === 0, `unexpected extraneous props, e.g. "${Array.from(extra.keys())[0]!}"!`)
	}

	switch (type_match) {
		case "any":
			// no further test
			// no need to recurse
			break
		case "simple": {
			for (const key of keysⵧmatching) {
				ǃ.forⵧvalue({ key }).check(
					getꓽtypeofⵧimproved(reference[key]) === getꓽtypeofⵧimproved((under_test as any)[key]),
					`types for prop "${String(key)}" should match: "${getꓽtypeofⵧimproved(reference[key])}" vs. "${getꓽtypeofⵧimproved((under_test as any)[key])}"`,
				)
			}
			ǃ.check(test_depth === 0, `unsupported test_depth param`)
			break
		}
		default:
			assertⵧnever_reached({ type_match })
	}

	return ǃ
}

export function assertꓽshape<T extends object>(
	reference: T,
	under_test: object,
	options?: Partial<Options>,
): asserts under_test is T {
	const ǃ = ǃꓽshape(reference, under_test, options)
	ǃ.assertꓽno_issues()
}

export function hasꓽshape<T extends object>(
	reference: T,
	under_test: object,
	options: Partial<Options> = {},
): under_test is T {
	const ǃ = ǃꓽshape(reference, under_test, options)
	return ǃ.hasꓽno_issues()
}

/////////////////////////////////////////////////

import { assert_from, assertⵧnever_reached } from "@monorepo-private/assert"

import { isꓽobjectⵧdefined_non_array } from "../01-primitives/index.ts"
import { isꓽThenable } from "../03-thenable/index.ts"
