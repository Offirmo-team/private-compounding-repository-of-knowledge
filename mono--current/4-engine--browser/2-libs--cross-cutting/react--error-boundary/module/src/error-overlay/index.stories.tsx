import { ErrorOverlay } from "./index.tsx"

/////////////////////////////////////////////////

export default {
	component: ErrorOverlay,
	args: {
		name: "Demo",
		error: new Error("Demo error"),
		errorInfo: {
			digest: "Demo error digest",
		},
	},
}

/////////////////////////////////////////////////

export const Default = {}
