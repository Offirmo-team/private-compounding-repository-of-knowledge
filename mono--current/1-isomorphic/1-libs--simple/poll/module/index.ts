/////////////////////////////////////////////////

export interface Options {
	periodMs: number
	timeoutMs: number
	debugId: string
}

const DEFAULT_OPTIONS: Options = {
	periodMs: 100, // check every 100ms
	timeoutMs: 10 * 1000, // after 10 seconds, timeout
	debugId: "an unnamed predicate",
}

type Falsy = false | 0 | 0n | "" | null | undefined

/**
 * Resolves with the first truthy value returned by the predicate. Rejects on timeout, or as soon as the predicate
 * throws.
 */
export function poll<T>(predicate: () => T, options: Partial<Options> = {}): Promise<Exclude<T, Falsy>> {
	const { periodMs, timeoutMs, debugId } = {
		...DEFAULT_OPTIONS,
		...options,
	}

	return new Promise((resolve, reject) => {
		const intervalId = setInterval(check, periodMs)
		const timeoutId = setTimeout(() => {
			stop()
			reject(new Error(`@monorepo-private/poll: Timed out while waiting for "${debugId}"`))
		}, timeoutMs)

		// early check to save an initial poll period
		check()

		function check() {
			try {
				const result = predicate()
				if (!result) return
				stop()
				resolve(result as Exclude<T, Falsy>)
			} catch (err) {
				stop()
				reject(err)
			}
		}

		function stop() {
			clearInterval(intervalId)
			clearTimeout(timeoutId)
		}
	})
}
export default poll

/////////////////////////////////////////////////
