import type { Meta‿v2, Story‿v2 } from "./index.ts"

/////////////////////////////////////////////////

export default {
	parameters: {
		layout: "centered",
	},
	args: {
		target: "default",
	},
	decorators: [],
} satisfies Meta‿v2

/////////////////////////////////////////////////

export const Default: Story‿v2 = (args: any) => `Got args: ${JSON.stringify(args)}!`

export const NotDefault: Story‿v2 = (args: any) => `Got args: ${JSON.stringify(args)}!`
NotDefault.args = {
	target: "special",
}
