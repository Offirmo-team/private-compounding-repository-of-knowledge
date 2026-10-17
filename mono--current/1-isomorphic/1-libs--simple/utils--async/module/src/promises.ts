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

type Inspection<T> =
	| {
			readonly state: "pending"
			readonly value: undefined
	  }
	| {
			readonly state: "rejected"
			readonly value: undefined
			readonly reason?: unknown
	  }
	| {
			readonly state: "fulfilled"
			readonly value: T
	  }

export type InspectablePromise<T, ExtraProps extends object = {}> = Promise<T> & Inspection<T> & ExtraProps
export type InspectablePromiseWithResolvers<T, ExtraProps extends object = {}> = Promise<T> &
	Inspection<T> &
	ExtraProps & { resolve: (value: T | PromiseLike<T>) => void; reject: (reason?: any) => void }

export function deriveꓽInspectablePromise<T, ExtraProps extends object = {}>(
	promise: Promise<T>,
	props: ExtraProps = {} as ExtraProps,
): InspectablePromise<T, ExtraProps> {
	let state: Inspection<T>["state"] = "pending"
	let value: Inspection<T>["value"]
	let reason: unknown

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

	return Object.assign(tracked, props) as InspectablePromise<T, ExtraProps>
}

export function createꓽInspectablePromiseⵧwithResolvers<T, ExtraProps extends object = {}>(
	props: ExtraProps = {} as ExtraProps,
): InspectablePromiseWithResolvers<T, ExtraProps> {
	const { promise, resolve, reject } = Promise.withResolvers<T>()
	type ExtendedExtraProps = ExtraProps & {
		resolve: (value: T | PromiseLike<T>) => void
		reject: (reason?: any) => void
	}
	const propsWithResolvers: ExtendedExtraProps = {
		...props,
		resolve,
		reject,
	}
	const inspectable = deriveꓽInspectablePromise<T, ExtendedExtraProps>(promise, propsWithResolvers)
	return inspectable
}

/////////////////////////////////////////////////
