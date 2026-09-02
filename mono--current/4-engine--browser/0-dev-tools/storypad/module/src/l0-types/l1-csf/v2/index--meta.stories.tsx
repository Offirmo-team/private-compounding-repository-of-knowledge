import type { Meta‿v2, Story‿v2 } from "./index.ts"

/////////////////////////////////////////////////

export default {
	parameters: {
		layout: "centered",
	},
} satisfies Meta‿v2

/////////////////////////////////////////////////

export const DefaultReactNoParams: Story‿v2 = () => {
	return <>Hello world from React!</>
}
