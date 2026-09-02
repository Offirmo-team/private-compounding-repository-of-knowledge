import type { Meta‿v3, Story‿v3 } from "@monorepo-private/storypad/types"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
	render: (args: any) => `CSFv3 shared render got args: "${JSON.stringify(args)}"!`,

	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	args: {
		target: "default",
	},
	decorators: [],
} satisfies Meta‿v3

/////////////////////////////////////////////////

export const Default: Story‿v3 = {}

export const NotDefault: Story‿v3 = {
	args: {
		target: "special",
	},
}
