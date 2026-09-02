/* This is not a "unit" test (not runnable): this is a TS Typing test:
 * this file should/should not trigger TS compilation errors
 */
import type { Immutable, ImmutabilityEnforcer } from "../index.ts"

/////////////////////////////////////////////////

interface Test {
	foo: number
	bar: {
		// deep
		baz: string
	}
	special?: any // important, we have trouble with the "any" type
}
const t: Test = { foo: 42, bar: { baz: "x" } }

/////////////////////////////////////////////////
// test underlying TypeScript mechanisms
function mutateBuiltin__Readonly__Any(x: Readonly<any>): void {
	// @ts-expect-error TS2542
	x["foo"] = 33
	// XXX No error... What can we do?
	x["foo"].bar = 33
}
mutateBuiltin__Readonly__Any(t)
function mutateBuiltin__Never(x: never): void {
	// @ts-expect-error TS2322
	x = 33
}
mutateBuiltin__Never(null as never)

/////////////////////////////////////////////////
// nothing we can really test...
function mutatePrimitiveType__number(x: Immutable<number>): void {
	x = 33
}
mutatePrimitiveType__number(42)

function mutatePrimitiveType__string(x: Immutable<string>): void {
	x = "y"
}
mutatePrimitiveType__string("x")

function mutatePrimitiveType__boolean(x: Immutable<boolean>): void {
	x = false
}
mutatePrimitiveType__boolean(true)

/////////////////////////////////////////////////
// The semantic of a Readonly<unknown> is unclear
// I'm not handling it for now.
// TODO if a proper use case appears
/*const a: Immutable<unknown> = 1

function mutateUnknown(x: Immutable<unknown>): void {
	// @ts-expect-error TS2339: Property 'foo' does not exist on type 'Readonly<unknown>'
	x.foo = 33
	// @ts-expect-error TS7053: Property 'foo' does not exist on type 'Readonly<unknown>'
	x['foo'] = 33
	x['bar'].baz = 'y'
}
mutateUnknown({})
mutateUnknown({} as Immutable<unknown>)*/

/////////////////////////////////////////////////
function mutateAny(x: Immutable<any>): void {
	// XXX unfortunately we cannot map any to Readonly<any>,
	// it causes so many casting issue that the cost/benefit is not good

	// 1) should not prevent READING
	const r1 = x.foo

	// 2) should prevent MUTATING
	// 2.1) should prevent MUTATING -- immediate
	// 😢😢😢@ts-expect-error TS2542
	x.foo = 33
	// 😢😢😢@ts-expect-error TS2542
	x["foo"] = 33
	// 2.2) should prevent MUTATING -- deep
	// unfortunately, Readonly<any> is not deep :(
	// 😢😢😢@ts-expect-error TS7053 TS4111 TS2542
	x["bar"].baz = "y"

	// 3) should not WIDEN the type
	// n/a
}
mutateAny({})
mutateAny({} as Immutable<any>)
mutateAny({} as Immutable<unknown>)

/////////////////////////////////////////////////
function mutateStructure(struct: Immutable<Test>): void {
	// 1) should not prevent READING
	const r1 = struct.foo

	// 2) should prevent MUTATING
	// 2.1) should prevent MUTATING -- immediate
	// @ts-expect-error TS2540
	struct.foo = 33

	// 2.2) should prevent MUTATING -- deep
	// @ts-expect-error TS2540
	struct.bar.baz = "y"

	// 3) should not WIDEN the type
	// @ts-expect-error TS2339: Property does not exist on type
	const w1 = struct.inexistent_prop
}
mutateStructure(t)
mutateStructure(t as Immutable<any> | Immutable<Test>) // try to replicate state-utils issue
mutateStructure(t as Immutable<any>)
//mutateStructure(t as Immutable<unknown>)

// https://github.com/microsoft/TypeScript/issues/13923#issuecomment-1347610117
function mutateMutableStructure(struct: Test): void {
	struct.foo = 33
}
function indirectlyMutateImmutableStructure(struct: { readonly [K in keyof Test]: Test[K] }): void {
	// @xxx-ts-expect-error bug https://github.com/microsoft/TypeScript/issues/13347
	mutateMutableStructure(struct)
}
indirectlyMutateImmutableStructure(t)

/////////////////////////////////////////////////
function mutateUnion(union: Immutable<Test | number>): void {
	if (typeof union !== "number") {
		// 1) should not prevent READING
		const r1 = union.foo

		// 2) should prevent MUTATING
		// 2.1) should prevent MUTATING -- immediate
		// @ts-expect-error TS2540
		union.foo = 42

		// 2.2) should prevent MUTATING -- deep
		// @ts-expect-error TS2540
		union.bar.baz = "y"

		// 3) should not WIDEN the type
		// @ts-expect-error TS2339: Property does not exist on type
		const w1 = union.inexistent_prop
	}
}
mutateUnion(1)
mutateUnion(t)
//mutateUnion(t as Immutable<unknown>)

//////////////////////////////////////////////////////////////////////////////////////////////////
// CONTAINERS
//////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////
function mutateArray(array: Immutable<[Test]>): void {
	array.forEach((element) => {
		// 1) should not prevent READING
		const r1 = element.foo

		// 2) should prevent MUTATING
		// 2.1) should prevent MUTATING -- immediate
		// @ts-expect-error TS2540
		element.foo = 42

		// 2.2) should prevent MUTATING -- deep
		// @ts-expect-error TS2540
		element.bar.baz = "y"

		// 3) should not WIDEN the type
		// @ts-expect-error TS2339: Property does not exist on type
		const w1 = element.inexistent_prop
	})

	// 1) should not prevent READING
	const r1 = array.length
	const r2 = array[0]

	// 2) should prevent MUTATING
	// 2.1) should prevent MUTATING -- immediate
	// @ts-expect-error TS2540: Cannot assign to 'length' because it is a read-only property
	array.length = 3
	// @ts-expect-error TS2540
	array[0] = { foo: 42, bar: { baz: "x" } }

	// 2.2) should prevent MUTATING -- deep
	// @ts-expect-error TS2540
	array[0].bar.baz = "y"

	// 3) should not WIDEN the type
	// @ts-expect-error TS2339: Property does not exist on type
	const x = array.inexistent_prop
	// @ts-expect-error TS2339: Property does not exist on type
	const y = array[0].inexistent_prop
}
mutateArray([t])
mutateArray([t] as Immutable<any>)
//mutateArray([t] as Immutable<unknown>)

/////////////////////////////////////////////////
function mutateTuple(tuple: Immutable<[number, Test]>): void {
	// 1) should not prevent READING
	const r1 = tuple[0]

	// 2) should prevent MUTATING
	// 2.1) should prevent MUTATING -- immediate
	// @ts-expect-error TS2540
	tuple[0] = 42
	// @ts-expect-error TS2540
	tuple[1] = { foo: 42, bar: { baz: "x" } }

	// 2.2) should prevent MUTATING -- deep
	// @ts-expect-error
	tuple[1].bar.baz = "y"

	// 3) should not WIDEN the type
	// @ts-expect-error TS2339: Property does not exist on type
	const x = tuple.inexistent_prop
	// @ts-expect-error TS2339: Property does not exist on type
	const y = tuple[0].inexistent_prop
}
mutateTuple([42, { foo: 42, bar: { baz: "x" } }])
//mutateTuple(1 as Immutable<unknown>)

/////////////////////////////////////////////////
function mutateFunction(f: Immutable<(x: string) => string>): void {
	const s1: string = f("world")
	const s2: string = f.call(undefined, "world")
}
mutateFunction((s: string) => `Hello, ${s}!`)
//mutateFunction(1 as Immutable<unknown>)

/////////////////////////////////////////////////
function mutateRecord(record: Immutable<Record<string, Test>>): void {
	// 1) should not prevent READING
	const r1 = record["foo"]

	// 2) should prevent MUTATING
	// 2.1) should prevent MUTATING -- immediate
	// @ts-expect-error TS2542
	record["foo"] = { foo: 42, bar: { baz: "x" } }

	// 2.2) should prevent MUTATING -- deep
	// @ts-expect-error TS2540
	record["foo"].bar.baz = "y"

	// 3) should not WIDEN the type
	// @ts-expect-error TS2339: Property does not exist on type
	const y = record["foo"].inexistent_prop
}
mutateRecord({ foo: t })
mutateRecord({ foo: t } as Immutable<any>)

/////////////////////////////////////////////////
function mutateSet(set: Immutable<Set<Test>>): void {
	// 1) should not prevent READING
	const r1 = set.has(t)

	// @ts-expect-error TS2339
	set.add({ foo: 42, bar: { baz: "x" } })

	set.forEach((element) => {
		// 2) should prevent MUTATING
		// 2.1) should prevent MUTATING -- immediate
		// @ts-expect-error TS2540
		element.foo = 33
		// 2.2) should prevent MUTATING -- deep
		// @ts-expect-error TS2540
		element.bar.baz = "y"

		// 3) should not WIDEN the type
		// @ts-expect-error TS2339: Property does not exist on type
		const x = element.inexistent_prop
	})

	// @ts-expect-error TS2540
	;[...set.values()][0]!.bar.baz = "y"

	// 3) should not WIDEN the type
	// @ts-expect-error TS2339: Property does not exist on type
	const x = set.inexistent_prop
}
mutateSet(new Set<Test>([t]))
//mutateSet((new Set<Test>([t])) as Immutable<unknown>)

/////////////////////////////////////////////////
function mutateMap(map: Immutable<Map<Test, Test>>): void {
	// 1) should not prevent READING
	const r1 = map.get(t)

	// 2) should prevent MUTATING
	const t2: Test = { foo: 33, bar: { baz: "y" } }
	// @ts-expect-error TS2339
	map.add(t2, t2)

	map.forEach((value, key, map) => {
		// 2) should prevent MUTATING
		// 2.1) should prevent MUTATING -- immediate
		// @ts-expect-error TS2540
		value.foo = 33
		// @ts-expect-error TS2540
		key.foo = 33
		// 2.2) should prevent MUTATING -- deep
		// @ts-expect-error TS2540
		value.bar.baz = "y"
		// @ts-expect-error TS2540
		key.bar.baz = "y"

		// @ts-expect-error TS2339
		map.add(t2, t2)

		// 3) should not WIDEN the type
		// @ts-expect-error TS2339: Property does not exist on type
		const x = value.inexistent_prop
	})

	// @ts-expect-error TS2540
	;[...map.values()][0]!.bar.baz = "y"
	// @ts-expect-error TS2540
	;[...map.keys()][0]!.bar.baz = "y"

	// 3) should not WIDEN the type
	// @ts-expect-error TS2339: Property does not exist on type
	const x = map.inexistent_prop
}
;(() => {
	const map = new Map<Test, Test>()
	map.set(t, t)
	const r1 = map.get(t)

	mutateMap(map)
	//mutateMap(map as Immutable<unknown>)
})()

/////////////////////////////////////////////////

const t2: Immutable<Test> = t

const ie: ImmutabilityEnforcer = <T>(s: T | Immutable<T>) => s as Immutable<T>
