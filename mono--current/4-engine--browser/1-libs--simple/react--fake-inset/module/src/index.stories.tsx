import Component from "./index"

export default {
	component: Component,
	decorators: [
		(stuff: any) => {
			import("@monorepo-private/css--framework") // needed to get the vars
			return stuff
		},
	],
}

export const Default = {}
