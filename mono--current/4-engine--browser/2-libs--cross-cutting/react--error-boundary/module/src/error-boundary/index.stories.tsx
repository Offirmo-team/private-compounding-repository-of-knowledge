import { ErrorBoundary } from "./index.tsx"

/////////////////////////////////////////////////

export default {}

/////////////////////////////////////////////////

export const NoChildren = {
	render: () => <ErrorBoundary name="no-children" />,
}

export const String = {
	render: () => <ErrorBoundary name="str">String</ErrorBoundary>,
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
			<SubComponent />
		</ErrorBoundary>
	),
}

/////////////////////////////////////////////////

function SubComponent(props: React.PropsWithChildren) {
	return <div>I may crash 😈</div>
}
