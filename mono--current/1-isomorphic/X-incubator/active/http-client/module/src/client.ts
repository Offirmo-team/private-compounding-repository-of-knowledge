import type { PositiveInteger, Url‿str, Immutable } from "@monorepo-private/ts--types"

import {
	HttpClientError,
	HttpTimeoutError,
	HttpRequestError,
	HttpResponseValidationError,
	classifyResponseError,
} from "./errors.ts"
import { _fetch } from "./fetch.ts"
import type { HttpResponse, RequestOptions, HttpMethod, Schema } from "./types.ts"

const DEFAULT_TIMEOUT_MS = 30_000

type MethodOptions<T = unknown> = Omit<RequestOptions<T>, "method">

export interface HttpClient {
	request<T>(path: string, options?: RequestOptions<T>): Promise<HttpResponse<T>>

	get<T>(path: string, options?: MethodOptions<T>): Promise<HttpResponse<T>>
	post<T>(path: string, options?: MethodOptions<T>): Promise<HttpResponse<T>>
	put<T>(path: string, options?: MethodOptions<T>): Promise<HttpResponse<T>>
	patch<T>(path: string, options?: MethodOptions<T>): Promise<HttpResponse<T>>
	delete<T>(path: string, options?: MethodOptions<T>): Promise<HttpResponse<T>>
}

export interface HttpClientOptions {
	timeout‿ms: PositiveInteger
	//retry: RetryOptions;
	//circuitBreaker: CircuitBreakerOptions;
	headers: Record<string, string>
}

export function createꓽHttpClient(
	base_url: Url‿str,
	optionsⵧbase: Immutable<Partial<HttpClientOptions>> = {},
): HttpClient {
	const base_url‿Url = new URL(base_url)
	// new URL(path, base) only merge base path until last '/': this is what we most likely want
	const base_url__hrefⵧwith_trailing_slash = base_url‿Url.pathname.endsWith("/")
		? base_url‿Url.href
		: `${base_url‿Url.href}/`

	async function _execute_request<T>(
		path: string,
		method: HttpMethod,
		optionⵧrequest: Immutable<Partial<MethodOptions<T>>> = {},
	): Promise<HttpResponse<T>> {
		const logger = console // TODO SXC

		const url = (() => {
			// new URL(path, base) skips the base path if the path is absolute: this is what we most likely DON'T want
			path = path.startsWith("/") ? path.slice(1) : path
			const target‿Url = new URL(path, base_url__hrefⵧwith_trailing_slash)
			if (target‿Url.origin !== base_url‿Url.origin) {
				throw new HttpClientError(
					`URL origin mismatch: expected ${base_url‿Url.origin}, got ${target‿Url.origin}`,
					{
						code: "INVALID_URL",
						retryable: false,
						url: target‿Url.toString(),
						method,
					},
				)
			}

			return target‿Url.toString()
		})()

		const timeout‿ms = optionⵧrequest.timeout‿ms ?? optionsⵧbase.timeout‿ms ?? DEFAULT_TIMEOUT_MS

		const headersⵧmerged: Record<string, string> = {
			...(optionⵧrequest.body
				? {
						"content-type": "application/json",
					}
				: {}),
			...optionsⵧbase.headers,
			...optionⵧrequest.headers,
		}

		const start = performance.now()
		const timeoutSignal = AbortSignal.timeout(timeout‿ms)
		const signal = optionⵧrequest.signal ? AbortSignal.any([timeoutSignal, optionⵧrequest.signal]) : timeoutSignal

		let response: Response
		try {
			logger.debug({ msg: "http request", method, url })

			const fetch_init: RequestInit = {
				method,
				headers: headersⵧmerged,
				signal,
			}

			if (optionⵧrequest.body !== undefined) {
				fetch_init.body = JSON.stringify(optionⵧrequest.body)
			}

			response = await _fetch(url, fetch_init)
		} catch (error) {
			const durationMs = Math.round(performance.now() - start)
			if (error instanceof DOMException && (error.name === "AbortError" || error.name === "TimeoutError")) {
				logger.debug({ msg: "http timeout", method, url, durationMs })
				throw new HttpTimeoutError(url, method, timeout‿ms, { cause: error })
			}
			logger.debug({ msg: "http error", method, url, durationMs, err: error })
			throw new HttpRequestError(url, method, { cause: error })
		}

		const duration‿ms = Math.round(performance.now() - start)

		logger.debug({ msg: "http response", method, url, status: response.status, durationMs: duration‿ms })

		if (!response.ok) {
			throw await classifyResponseError(response, url, method)
		}

		const contentType = response.headers.get("content-type")
		if (!contentType?.includes("application/json")) {
			return {
				status: response.status,
				data: undefined,
				headers: response.headers,
				duration‿ms,
			} satisfies HttpResponse<T>
		}

		let data: T = (await response.json()) as T
		if (optionⵧrequest.schema) {
			try {
				data = optionⵧrequest.schema.parse(data) as T
			} catch (error) {
				throw new HttpResponseValidationError(url, method, { cause: error })
			}
		}

		const _request: RequestOptions = {
			method,
			body: optionⵧrequest.body,
			headers: headersⵧmerged,
			timeout‿ms,
			signal: optionⵧrequest.signal,
			schema: optionⵧrequest.schema,
		}

		return {
			status: response.status,
			data,
			headers: response.headers,
			duration‿ms,

			_request,
		} satisfies HttpResponse<T>
	}

	return {
		request<T>(path: string, requestOptions: RequestOptions<T> = {}): Promise<HttpResponse<T>> {
			const { method = "GET", ...method_options } = requestOptions
			return _execute_request<T>(path, method, method_options)
		},
		get<T>(path: string, options?: MethodOptions<T>): Promise<HttpResponse<T>> {
			return _execute_request<T>(path, "GET", options)
		},
		post<T>(path: string, options?: MethodOptions<T>): Promise<HttpResponse<T>> {
			return _execute_request<T>(path, "POST", options)
		},
		put<T>(path: string, options?: MethodOptions<T>): Promise<HttpResponse<T>> {
			return _execute_request<T>(path, "PUT", options)
		},
		patch<T>(path: string, options?: MethodOptions<T>): Promise<HttpResponse<T>> {
			return _execute_request<T>(path, "PATCH", options)
		},
		delete<T>(path: string, options?: MethodOptions<T>): Promise<HttpResponse<T>> {
			return _execute_request<T>(path, "DELETE", options)
		},
	}
}
