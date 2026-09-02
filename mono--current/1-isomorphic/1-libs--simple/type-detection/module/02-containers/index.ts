import type { Immutable } from "@monorepo-private/ts--types"

import { isꓽobjectⵧliteral } from "../01-primitives/index.ts"

/////////////////////////////////////////////////
// Notes: Typescript
// https://stackoverflow.com/questions/49464634/difference-between-object-and-object-in-typescript
// {} = any (non-null/undefined) value with zero or more properties, Doesn't Mean object! https://github.com/microsoft/TypeScript/wiki/FAQ#primitives-are---and---doesnt-mean-object
// object = values which have Object in their prototype chain https://github.com/microsoft/TypeScript/wiki/FAQ#primitives-are---and---doesnt-mean-object
// Object = ??? accepts numbers??

function isꓽarrayⵧempty(a: Immutable<Array<any>>): a is [] {
	return Array.isArray(a) && a.length === 0
}

function isꓽobjectⵧliteralⵧempty(o: Immutable<object>): o is {} {
	if (!isꓽobjectⵧliteral(o)) return false // safety against wrong dynamic types

	return isꓽarrayⵧempty(Object.keys(o))
}

function isꓽcontainer(c: Immutable<Array<any> | object>): c is {} | [] {
	if (Array.isArray(c)) return true

	return isꓽobjectⵧliteral(c)
}

function isꓽcontainerⵧempty(c: Immutable<Array<any> | object>): c is {} | [] {
	if (Array.isArray(c)) return isꓽarrayⵧempty(c)

	return isꓽobjectⵧliteralⵧempty(c)
}

function hasꓽcontent(x: any, prop?: string): boolean {
	if (!!prop) x = x[prop]

	switch (true) {
		case !x: // null, undef, empty string, 0
			return false

		case typeof x === "number":
			return !isNaN(x)

		case typeof x === "string":
			return x.length > 0

		default:
			return !isꓽcontainerⵧempty(x)
	}
}

/////////////////////////////////////////////////

export { isꓽarrayⵧempty, isꓽobjectⵧliteralⵧempty, isꓽcontainer, isꓽcontainerⵧempty, hasꓽcontent }
