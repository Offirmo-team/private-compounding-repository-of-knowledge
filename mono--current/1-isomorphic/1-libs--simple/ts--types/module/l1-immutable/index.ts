/////////////////////
// better than Readonly<T>
// To be used in parameters to enforce immutability / no side effects
//
// WARNING MANAGE YOUR EXPECTATIONS!
// Due to various bugs and limitations of TypeScript,
// it's not possible to provide a true Immutable<T> type.
// The one below is a trade-off.
// Also, remember that Immutable<T> is already good as documentation
// even if TypeScript can't enforce it!
//
// Why providing this type ourselves when there are many libs offering it?
// - it's critical
// - uses the "Immutable" semantic
// - deep by default
// - has unit tests
// - can be cancelled for special cases
//
// We aim at the most common types, not exhaustive
// Reminder: Readonly is meaningful for aggregation types (arrays, maps, etc.)

// 1) derived from https://github.com/microsoft/TypeScript/issues/13923#issuecomment-557509399
// 2) improved
// 3) then contributed back https://github.com/microsoft/TypeScript/issues/13923#issuecomment-716706151
export type ImmutablePrimitive = undefined | null | boolean | string | number | Function
interface EmptyStruct {}

/* Implementation notes:
 *
 * Readonly<any> exists but
 * 1) not deep :-(
 * 2) Not castable to other types
 * In the global Immutable<T> we don't use Readonly<any>
 * and Immutable<any> resolves to "any".
 * This is a compromise.
 *
 * All type test: https://gist.github.com/c6a67f81526eb2f43ae600523747ceaf#file-condtypes-ts
 */

export type ImmutableArray<T> = ReadonlyArray<Immutable<T>>
export type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>
export type ImmutableSet<T> = ReadonlySet<Immutable<T>>
export type ImmutableObject<T> = { +readonly [K in keyof T]: Immutable<T[K]> }

export type Immutable<T> = true extends false
	? never
	: // IMPORTANT! All those conditional type tests are distributive on "any" https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
		T extends ImmutablePrimitive
		? T // "any" matches, turning "Immutable<any>" into "any" (due to "x | y | any" being coalesced as just "any")
		: //: T extends Array<infer U>        ? ImmutableArray<U> ??? strangely this line is 1) not needed 2) causes problem with tuples (spreading = possibly undef)
			T extends Map<infer K, infer V>
			? ImmutableMap<K, V>
			: T extends Set<infer M>
				? ImmutableSet<M>
				: T extends EmptyStruct
					? ImmutableObject<T> // this line is greedy with other container types+fn, must be last!
					: never // if we reach this, need to extend this conditional type

/////////////////////

export type ImmutabilityEnforcer = <T>(x: T | Immutable<T>) => Immutable<T>

/////////////////////

// to cancel an Immutable (beware! You're breaking the contract!)
// Example usage: API outside your control that refuse to take an Immutable, ex. ORM
export type Mutable<I> = I extends ImmutablePrimitive
	? I
	: I extends ImmutableMap<infer IK, infer IV>
		? MutableMap<IK, IV>
		: I extends ImmutableSet<infer IM>
			? MutableSet<IM>
			: MutableObject<I>

export type MutableMap<IK, IV> = Map<Mutable<IK>, Mutable<IV>>
export type MutableSet<IT> = Set<Mutable<IT>>
export type MutableObject<IT> = { -readonly [K in keyof IT]: Mutable<IT[K]> }
