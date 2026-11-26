/////////////////////////////////////////////////

export default {}

/////////////////////////////////////////////////

export const IssuesⳇNoChildren = {
	render: () => <ErrorBoundary name="no-children" />,
}
export const IssuesⳇCompetingChildrenAndRender = {
	render: () => (
		<ErrorBoundary name="conflicting-children" render={() => "bad1"}>
			{() => "bad2"}
		</ErrorBoundary>
	),

	args: {
		children: "a string",
		render: () => "a string",
	},
}

export const String = {
	render: () => <ErrorBoundary name="str">Hello</ErrorBoundary>,
}

export const Strings = {
	render: () => (
		<ErrorBoundary name="strs">
			String
			<br />
			And another string
			<br />
			{+Date.now()}
		</ErrorBoundary>
	),
}

export const Component = {
	render: () => (
		<ErrorBoundary name={"demo"}>
			<ComponentThatThrows />
		</ErrorBoundary>
	),
}

/////////////////////////////////////////////////

import { ComponentThatThrows } from "../__fixtures/component-that-throws.tsx"

import { ErrorBoundary } from "./index.tsx"
