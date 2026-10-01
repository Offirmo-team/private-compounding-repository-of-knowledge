import Component from "./index"

export default {
	component: Component,
	decorators: [
		(stuff: any) => {
			import("@monorepo-private/css--framework")
			return stuff
		},
		(Story) => (
			<div className="o⋄full-viewport">
				<Story />
			</div>
		),
	],
}

export const Default = {}
