import { type ErrorInfo } from "react"

export interface ErrorBoundaryContext {
	name: string | undefined // undef because of static getDerivedStateFromError() where we don't know the name

	//[key: string]: unknown
}

export type ErrorBoundaryPayload = {
	error: unknown

	// React details https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
	errorInfo: ErrorInfo | undefined
	ownerStack: string | undefined

	// custom info
	context: ErrorBoundaryContext
}
