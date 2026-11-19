// other ad-hoc typings improvements not in ts-reset

/* TODO find source and re-evaluate:
export {};

type NonFalsy<T> = T extends false | 0 | '' | null | undefined | 0n ? never : T;

declare global {

	interface Array<T> {
		filter<S extends T>(
			predicate: (value: T, index: number, array: T[]) => value is S,
			thisArg?: any,
		): S[];
		filter(predicate: BooleanConstructor, thisArg?: any): NonFalsy<T>[];
	}

	interface ReadonlyArray<T> {
		filter<S extends T>(
			predicate: (value: T, index: number, array: T[]) => value is S,
			thisArg?: any,
		): S[];
		filter(predicate: BooleanConstructor, thisArg?: any): NonFalsy<T>[];
	}
}
 */

// TODO one day evaluate https://www.mattstobbs.com/object-keys-typescript/
