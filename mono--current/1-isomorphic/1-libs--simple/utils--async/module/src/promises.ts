/* Utilities related to Promises
 */

/////////////////////////////////////////////////

type MapFn<T> = (elt: T, index: number, array: ReadonlyArray<T>) => Promise<void>

// TODO improve readability
export function forArray<T = any>(elements: ReadonlyArray<T>) {
	return {
		// TODO clarify behaviour on failure -> continue with next?
		async executeSequentially(mapFn: MapFn<T>): Promise<void> {
			return elements.reduce(async (acc, elt: T, i: number) => {
				await acc
				const awaitable = mapFn(elt, i, elements)
				await Promise.resolve(awaitable) // wrapping for safety in dynamic situation
			}, Promise.resolve())
		},
	}
}

/////////////////////////////////////////////////
// useful for sync flux states

// TODO better union
type Inspection<T> = {
	readonly state: "pending" | "fulfilled" | "rejected"
	readonly value?: T
	readonly reason?: unknown
}

export type InspectablePromise<T, P extends object = {}> = Promise<T> & Inspection<T> & P

export function deriveꓽInspectablePromise<T, P extends object = {}>(
	promise: Promise<T>,
	props: P = {} as P,
): InspectablePromise<T, P> {
	let state: Inspection<T>["state"] = "pending"
	let value: Inspection<T>["value"]
	let reason: Inspection<T>["reason"]

	const tracked = promise.then(
		(v) => {
			state = "fulfilled"
			value = v
			return v
		},
		(e) => {
			state = "rejected"
			reason = e
			throw e
		},
	)

	Object.defineProperties(tracked, {
		state: { get: () => state, enumerable: true },
		value: { get: () => value, enumerable: true },
		reason: { get: () => reason, enumerable: true },
	})

	return Object.assign(tracked, props) as InspectablePromise<T, P>
}

/////////////////////////////////////////////////
