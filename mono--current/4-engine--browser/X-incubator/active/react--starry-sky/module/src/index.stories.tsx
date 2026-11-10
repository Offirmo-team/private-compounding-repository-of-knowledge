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

export const Move = {
	args: {
		move__speed: 0.2,
	},
}

export const Gradient = {
	args: {
		background__gradient__direction: 90,
		background__gradient__begin: "#000050",
		background__gradient__end: "black",
	},
}

export const DensityLow = {
	args: {
		density: 100,
		background__gradient__direction: 0,
		background__gradient__begin: "#400000",
		background__gradient__end: "black",
	},
}
export const DensityHigh = {
	args: {
		density: 2000,
		background__gradient__direction: 180,
		background__gradient__begin: "#400000",
		background__gradient__end: "black",
	},
}

export const Parallax = {
	component: function Parallax() {
		const layerFront: Props = {
			density: 200,
			move__speed: 1,
			stars__size_range: { min: 1.5, max: 2 },
			background_type: "transparent",
		}
		const layerMid: Props = {
			density: 500,
			move__speed: 0.5,
			stars__size_range: { min: 1, max: 1.5 },
			background_type: "transparent",
		}
		const layerBack: Props = {
			density: 1000,
			move__speed: 0.2,
			stars__size_range: { min: 0.5, max: 0.5 },
			background__gradient__direction: 270,
			background__gradient__begin: "#004000",
			background__gradient__end: "black",
		}
		return (
			<div>
				<Component {...layerBack} />
				<Component {...layerMid} />
				<Component {...layerFront} />
			</div>
		)
	},
}
