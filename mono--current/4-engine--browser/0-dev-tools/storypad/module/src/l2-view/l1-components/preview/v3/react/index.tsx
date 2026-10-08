/* render a CSF v3 Story
 */
import * as React from "react"
import { type ProfilerOnRenderCallback } from "react"
import type { RootOptions } from "react-dom/client"

import type { Immutable } from "@monorepo-private/ts--types"

import FakeInset from "../../../../../__vendor/@monorepo-private/react--fake-inset"
import { LIB } from "../../../../../consts"
import type { RenderParamsWithComponent, StoryContext } from "../../../../../l0-types/l1-csf"
import type { Meta‿v3, Story‿v3 } from "../../../../../l0-types/l1-csf/v3"
import type { ObservableState } from "../../../../../l1-flux/l2-observable"

/////////////////////////////////////////////////

async function render(
	state: ObservableState,
	render_params: Immutable<RenderParamsWithComponent<Story‿v3>>,
	container: HTMLElement,
) {
	console.group(`[${LIB}] Rendering a React component…`)

	// https://react.dev/reference/react-dom/client/createRoot
	const libⳇreactᝍdomⳇclient = await import("react-dom/client")
	const libⳇreact = React //await import('react')
	/*console.log('libs', {
		libⳇreactᝍdomⳇclient,
		libⳇreact,
	})*/

	const { createRoot } = libⳇreactᝍdomⳇclient
	let root_elt = document.createElement("div")
	root_elt.setAttribute("id", "react-root")
	root_elt.innerHTML = `[React will load here]`
	container.innerHTML = "" // reset any loading message
	container.appendChild(root_elt)

	const root = createRoot(root_elt, {
		onCaughtError,
		onUncaughtError,
	})

	const { Fragment, StrictMode, Suspense, Profiler } = libⳇreact
	const use_strict = true // TODO 1D add a switch?
	const StrictWrapper = use_strict ? StrictMode : Fragment

	const props = render_params.args
	const Component = render_params.component

	let StoryAsReactComponent: React.FunctionComponent = () => <Component {...props} />

	if (render_params.decorators.length) {
		const context: StoryContext = {
			args: render_params.args,
			parameters: render_params.parameters,
			viewMode: "canvas",
		}
		render_params.decorators.forEach((decorator) => {
			// TODO one day, not sure we're correctly implementing decorators here https://storybook.js.org/docs/writing-stories/decorators
			const output = decorator(StoryAsReactComponent, context)
			StoryAsReactComponent = (
				typeof output !== "function"
					? () => output // the decorator returned direct JSX, it's allowed
					: output
			) as any // TODO clarify
		})
	}

	// TODO add a pill if suspended

	// TODO error boundary
	root.render(
		<StrictWrapper>
			{render_params.parameters.layout === "fullscreen" && (
				/* reminder: FakeInset needs geometry CSS vars = ~offirmo framework, will display nothing if absent */
				<FakeInset />
			)}
			<Suspense fallback="<Suspense… />">
				<Profiler id="storypad-story" onRender={onRender}>
					<StoryAsReactComponent />
				</Profiler>
			</Suspense>
		</StrictWrapper>,
	)

	console.groupEnd()
}

const onRender: ProfilerOnRenderCallback = (...args) => {
	// Aggregate or log render timings...
	console.log(`React <Profiler> onRender():`, args)
}

const onCaughtError: NonNullable<RootOptions["onCaughtError"]> = (error, { componentStack, errorBoundary }) => {
	logꓽreact_error(`Error caught by ${getꓽboundary_name(errorBoundary)}`, error, componentStack)
}

const onUncaughtError: NonNullable<RootOptions["onUncaughtError"]> = (error, { componentStack }) => {
	logꓽreact_error(`Uncaught error (not caught by any error boundary)`, error, componentStack)
	reportError(error) // preserve React's default = dispatch a global "error" event, listened to by SXC
}

function logꓽreact_error(title: string, error: unknown, componentStack: string | undefined) {
	// Owner Stacks are only correct HERE (root error handlers): React sets the throwing component as "current" around them.
	// Elsewhere (ex. in an error boundary) captureOwnerStack() returns the stack of whatever React is processing at that time.
	// https://react.dev/reference/react/captureOwnerStack
	const owner_stack = React.captureOwnerStack?.() // dev only

	console.group(`[${LIB}] React: ${title}`)
	console.error(error)
	console.log("componentStack:", componentStack)
	console.log("ownerStack:", owner_stack)
	console.groupEnd()
}

function getꓽboundary_name(boundary: React.Component<unknown> | undefined): string {
	if (!boundary) return "<unknown boundary>"

	const component_name = boundary.constructor.name
	const { name } = (boundary.props ?? {}) as { name?: unknown }
	return typeof name === "string" ? `<${component_name} name="${name}" />` : `<${component_name} />`
}

/////////////////////////////////////////////////

export default render
