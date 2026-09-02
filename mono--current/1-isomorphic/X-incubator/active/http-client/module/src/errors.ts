import type { Url‿str } from "@monorepo-private/ts--types"

import type { HttpMethod } from "./types.ts"

export class HttpClientError extends Error {
	readonly status: number | undefined
	readonly code: string
	readonly retryable: boolean
	readonly url?: Url‿str | undefined
	readonly method?: HttpMethod | undefined
	readonly responseBody?: unknown

	constructor(
		message: string,
		options: {
			status?: number
			code: string
			retryable: boolean
			cause?: unknown
			url?: string
			method?: HttpMethod
			responseBody?: unknown
		},
	) {
		super(message, { cause: options.cause })
		this.name = "HttpClientError"
		this.status = options.status
		this.code = options.code
		this.retryable = options.retryable
		this.url = options.url
		this.method = options.method
		this.responseBody = options.responseBody
	}
}

export class HttpRequestError extends HttpClientError {
	constructor(url: string, method: HttpMethod, options?: { cause?: unknown }) {
		super(`HTTP Request failed!`, {
			code: "REQUEST_FAILED",
			retryable: true,
			url,
			method,
			cause: options?.cause,
		})
		this.name = "HttpRequestError"
	}
}

export class HttpResponseError extends HttpClientError {
	constructor(
		url: string,
		method: HttpMethod,
		status: number,
		options?: { retryable?: boolean; responseBody?: unknown },
	) {
		super(`HTTP Response failed due to status ${status}`, {
			status,
			code: `HTTP_${status}`,
			retryable: options?.retryable ?? false,
			url,
			method,
			responseBody: options?.responseBody,
		})
		this.name = "HttpResponseError"
	}
}

export class HttpTimeoutError extends HttpClientError {
	constructor(url: string, method: HttpMethod, timeout: number, options?: { cause?: unknown }) {
		super(`HTTP Request timed out after ${timeout}ms`, {
			code: "TIMEOUT",
			retryable: true,
			url,
			method,
			cause: options?.cause,
		})
		this.name = "HttpTimeoutError"
	}
}

export class HttpResponseValidationError extends HttpClientError {
	constructor(url: string, method: HttpMethod, options?: { cause?: unknown }) {
		super(`HTTP Response validation failed`, {
			code: "RESPONSE_VALIDATION",
			retryable: false,
			url,
			method,
			cause: options?.cause,
		})
		this.name = "HttpResponseValidationError"
	}
}

const RETRYABLE_STATUSES = new Set([429, 502, 503, 504])

export function isRetryableStatus(status: number): boolean {
	return RETRYABLE_STATUSES.has(status)
}

export function isRetryableError(error: unknown): boolean {
	if (error instanceof HttpClientError) {
		return error.retryable
	}
	if (error instanceof TypeError && error.message === "fetch failed") {
		return true
	}
	return false
}

export async function classifyResponseError(
	response: Response,
	url: string,
	method: HttpMethod,
): Promise<HttpResponseError> {
	let responseBody: unknown
	try {
		responseBody = await response.json()
	} catch {
		// Non-JSON or empty body — leave undefined
	}
	return new HttpResponseError(url, method, response.status, {
		retryable: isRetryableStatus(response.status),
		responseBody,
	})
}
