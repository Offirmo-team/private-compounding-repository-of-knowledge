// explanation of those fields is in ./fields.ts
/////////////////////////////////////////////////

export type ErrorStack = string // TODO 1D more complex

// eXtended error
export interface XError extends Error {
	// redefine the standard fields in case the target ES lib doesn't have all of them
	name: string
	message: string
	stack?: ErrorStack
	cause?: XError | Error
	errors?: Array<XError | Error>
	suppressed?: XError | Error

	// optional
	code?: string
	statusCode?: number
	shouldRedirect?: boolean
	framesToPop?: number
}

export interface XXError extends XError {
	cause?: XXError | XError | Error
	errors?: Array<XXError | XError | Error>
	suppressed?: XXError | XError | Error

	details?: {
		logicalStack?: string
		[k: string]: boolean | number | string | null | undefined
	}

	_temp?: {
		SXC?: any // Software eXecution Context (Offirmo private)
		statePath?: any // other known SXC temp

		[k: string]: any
	}
}

const DEBUG = false
const DEMO_ERROR = new Error("[Test!]")
export function isꓽError(err_like: any): err_like is XXError {
	if (typeof err_like?.message !== "string" || !err_like?.message) {
		DEBUG &&
			console.error("hasErrorShape() BAD message", {
				type: typeof err_like?.message,
				expected_type: typeof DEMO_ERROR?.message,
				err_like,
			})
		return false
	}

	if (typeof err_like?.name !== "string" || !err_like?.name) {
		DEBUG &&
			console.error("hasErrorShape() BAD name", {
				type: typeof err_like?.name,
				expected_type: typeof DEMO_ERROR?.name,
				err_like,
			})
		return false
	}

	if (typeof err_like?.stack !== "string") {
		DEBUG &&
			console.error("hasErrorShape() BAD stack", {
				type: typeof err_like?.stack,
				expected_type: typeof DEMO_ERROR?.stack,
				err_like,
			})
		return false
	}

	return true
}

/////////////////////////////////////////////////
