import Component, { type Props } from "./index"

export default {
	component: Component,
	//title: 'Task',
	//tags: ['autodocs'],
	//👇 Our exports that end in "Data" are not stories.
	//excludeStories: /.*Data$/,
	/*args: {
		...ActionsData,
	},*/
	decorators: [
		(Story) => {
			import("@monorepo-private/css--framework")
			return Story
		},
		(Story) => (
			<div className="o⋄full-viewport">
				<Story />
			</div>
		),
	],
}

export const Default = {}

export const Classic = {
	args: {
		preset: "classic",
	} as Props,
}

export const Reddish = {
	args: {
		preset: "reddish",
	} as Props,
}

export const Hyper = {
	args: {
		preset: "hyper",
	} as Props,
}

export const StarGate = {
	args: {
		preset: "stargate",
	} as Props,
}

export const StarGateCustom = {
	args: {
		preset: "stargate",
		extra_filters: [["hue-rotate", "320deg"]],
	} as Props,
}

export const Purple = {
	args: {
		preset: "purple",
	} as Props,
}

export const Fiery = {
	args: {
		preset: "fiery",
	} as Props,
}

export const OriginalNoahBlon = {
	args: {
		preset: "original",
	} as Props,
}

export const Test = {
	args: {
		preset: "test",
	} as Props,
}
