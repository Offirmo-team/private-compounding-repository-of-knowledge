/////////////////////////////////////////////////

import type { ErrorInfo } from "react"

const payload: ErrorBoundaryPayload = {
	error: new Error("Demo error"),

	// React details https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
	errorInfo: {
		componentStack: "Demo componentStack",
	},
	ownerStack: "Demo ownerStack",

	context: {
		name: "Demo name",
	},
}

export default {
	component: ErrorOverlay,
	args: payload,
}

/////////////////////////////////////////////////

export const Default = {}

/////////////////////////////////////////////////

import type { ErrorBoundaryPayload } from "../type.ts"

import { ErrorOverlay } from "./index.tsx"
