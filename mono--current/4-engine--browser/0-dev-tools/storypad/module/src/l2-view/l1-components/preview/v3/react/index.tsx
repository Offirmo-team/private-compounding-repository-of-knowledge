/* render a CSF v3 Story
 */
import * as React from "react"
import { type ProfilerOnRenderCallback } from "react"

import type { Immutable } from "@monorepo-private/ts--types"

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

	const root = createRoot(root_elt)

	const { Fragment, StrictMode, Suspense, Profiler } = libⳇreact
	const use_strict = false
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
			<Suspense fallback="suspense…">
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

/////////////////////////////////////////////////

export default render
