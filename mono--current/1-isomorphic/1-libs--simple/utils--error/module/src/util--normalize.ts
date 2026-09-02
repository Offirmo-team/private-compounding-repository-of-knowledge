import { COMMON_ERROR_FIELDS_EXTENDED } from "./fields.ts"
import { type XXError, isꓽError } from "./types.ts"

/////////////////////////////////////////////////

const DEBUG = false
const WARN_NON_ERROR_THROWN = true

// Normalize any thrown object into a true, normal error.
// NOTE: will *always* recreate the error. TODO evaluate if possible to improve?
// Anything can be thrown: undefined, string, number...
// But that's obviously not a good practice.
// Even Error-like objects are sometime fancy!
// - seen: in browser, sometimes, an error-like, un-writable object is thrown
// - seen: frozen
// - seen: non-enumerable props
// So we want to ensure a true, safe, writable error object.
function normalizeError(
	err_like: Readonly<Partial<Error>> | unknown = undefined as unknown,
	{ alwaysRecreate = false }: { alwaysRecreate?: boolean } = {},
): XXError {
	const hasꓽminimal_error_shape = isꓽError(err_like)

	// TODO should we normalize "cause" as well?

	if (hasꓽminimal_error_shape && !alwaysRecreate) {
		// shortcut for most of the time
		return err_like as any
	}
	if (!hasꓽminimal_error_shape) {
		WARN_NON_ERROR_THROWN && console.warn(`WARNING: normalizeError() saw a non-Error thing thrown!`, { err_like })
	}

	if (err_like === undefined || err_like === null) {
		// we can't get prototype from those, shortcut it:
		return new Error(`[non-error: "${err_like}" thrown!]`) as any
	}

	// just for a clearer message
	if (typeof err_like === "string") {
		return new Error(`[non-error of type "${typeof err_like}" thrown: "${err_like}"!]`) as any
	} else if (typeof err_like !== "object") {
		// we can't get prototype from those, shortcut it:
		return new Error(`[non-error of type "${typeof err_like}" thrown!]`) as any
	}

	try {
		const should_recreate = alwaysRecreate || !hasꓽminimal_error_shape

		const true_err: XXError = should_recreate
			? (() => {
					const true_err: XXError = (() => {
						let message = (err_like as any)?.message // even no error shape may have a message prop
							? String((err_like as any).message)
							: `[object with no error shape thrown!]`

						try {
							const current_prototype = Object.getPrototypeOf(err_like)
							// should we restrict to global standard constructors? TBD
							const wanted_constructor = current_prototype?.constructor?.name?.endsWith("Error")
								? current_prototype.constructor
								: Error
							// https://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
							const candidate: XXError = new (Function.prototype.bind.call(wanted_constructor, null, message))()
							if (!isꓽError(candidate))
								throw new Error("[re-created but still !hasꓽminimal_error_shape: will be caught below]")

							return candidate
						} catch (_err) {
							DEBUG && console.error("NE1", _err)
							// the constructor didn't work or didn't yield a proper error, fallback to a normal, safe Error
							const true_err: XXError = new Error(message) as any
							return true_err
						}
					})()

					// properly re-attach fields if they exist
					// and normalize them if well defined and important enough
					COMMON_ERROR_FIELDS_EXTENDED.forEach((prop) => {
						if ((err_like as any)[prop]) {
							switch (prop) {
								case "message":
									// this prop is from the constructor, no need to copy it
									break
								case "name":
									// this prop is from the constructor, no need to copy it
									break
								case "framesToPop":
									// normalization recommended for processing the stack properly
									;(true_err as any)[prop] = Number.parseInt((err_like as any)[prop])
									break
								default:
									// TODO consider deep copies?
									;(true_err as any)[prop] = (err_like as any)[prop]
									break
							}
						}
					})

					return true_err
				})()
			: (err_like as any)

		return true_err
	} catch (_err) {
		DEBUG && console.error("NE2", _err)
		WARN_NON_ERROR_THROWN && console.warn(`WARNING: normalizeError() saw a dangerous thing thrown!`, { err_like })
		// if we're here, that means that err_like is *very* fancy, better not probe out further.
		return new Error(`[non-error: <fancy object> thrown!]`) as any
	}
}

/////////////////////////////////////////////////

export { normalizeError }
