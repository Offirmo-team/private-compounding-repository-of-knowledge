import { render_any_children } from "./index.tsx"

/////////////////////////////////////////////////

export default {
	//title: 'Types/CSFv3',
	component: Component,
	args: {
		foo: "Bar",
		//key: '1',
	},
	/*parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		backgroundColor: { control: 'color' },
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: { onClick: fn() },*/
}

function Component(props: React.PropsWithChildren) {
	return (
		<table>
			<thead>
				<tr>
					<th>
						<code>props.children</code>
					</th>
					<th>
						<code>render_any_children(props)</code>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						[{typeof props.children}]{props.children}
					</td>
					<td>{render_any_children(props)}</td>
				</tr>
			</tbody>
		</table>
	)
}

/////////////////////////////////////////////////

interface Component1ⳇProps {
	foo: string
}
function Component1ⳇfunc(props: Component1ⳇProps) {
	return ["foo =", props.foo]
}
const Component1: FunctionComponent<Component1ⳇProps> = Component1ⳇfunc
Component1.displayName = "Component1"

/////////////////////////////////////////////////

export const IssuesⳇNoChildrenNorRender = {
	// NOT correct
}
export const IssuesⳇCompetingChildrenAndRender = {
	args: {
		children: "a string",
		render: () => "a string",
	},
}

/////////////////////////////////////////////////

export const ChildrenⳇString = {
	args: {
		children: "a string",
	},
}

export const ChildrenⳇStringArray = {
	args: {
		children: ["a string", "another string"],
	},
}

export const ChildrenⳇRenderFunc = {
	args: {
		children: () => ["a string", "another string"],
	},
}

export const ChildrenⳇFunctionComponent = {
	args: {
		children: Component1,
	},
}

export const RenderⳇRenderFunc = {
	args: {
		render: () => ["a string", "another string"],
	},
}

/////////////////////////////////////////////////

import type { FunctionComponent } from "react"
