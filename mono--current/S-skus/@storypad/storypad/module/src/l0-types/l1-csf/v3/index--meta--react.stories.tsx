import type { Meta‿v3, Story‿v3 } from "./index.ts"

interface Props {
	target: string
}
function Component({ target = "default" }: Props) {
	return (
		<div>
			Hello, <strong>{target}</strong> from CSFv3 shared React Component!
		</div>
	)
}

// Meta
export default {
	component: Component,
} satisfies Meta‿v3

export const Default: Story‿v3 = {}

export const WithTarget: Story‿v3 = {
	args: {
		target: "special",
	},
}
