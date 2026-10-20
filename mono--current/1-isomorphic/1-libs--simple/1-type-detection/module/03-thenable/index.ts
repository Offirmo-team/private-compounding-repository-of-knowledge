/* Detect a ~promise
 */

/////////////////////////////////////////////////

// https://devdocs.io/javascript/global_objects/promise#thenables
export interface Thenable<T> {
	then<TResult1 = T, TResult2 = never>(
		// inspired by interface PromiseLike<T>
		onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
		onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
	): void
}

// credits: inspired by https://github.com/then/is-promise/blob/master/index.mjs
export function isꓽThenable<T>(p: any): p is Thenable<T> {
	return typeof p?.then === "function"
}

/////////////////////////////////////////////////
