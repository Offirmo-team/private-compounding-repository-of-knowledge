import type { PositiveInteger, JsonⳇObject } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS"

export interface Schema<T = unknown> {
	parse(data: unknown): T
}

export interface RequestOptions<T = JsonⳇObject> {
	method: HttpMethod
	body: unknown
	headers: Record<string, string>
	timeout‿ms: number
	signal: AbortSignal
	schema: Schema<T>
}

export interface HttpResponse<T = JsonⳇObject> {
	status: number
	data: T | undefined
	headers: Headers
	duration‿ms: PositiveInteger

	_request: RequestOptions
}
