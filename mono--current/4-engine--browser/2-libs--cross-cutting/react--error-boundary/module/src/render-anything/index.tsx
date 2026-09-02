import "react"
import memoize_one from "memoize-one"

import { assert_from, assert } from "@monorepo-private/assert"

/////////////////////////////////////////////////

const LIB = "render_any_children()"

// from React doc
// https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
function getDisplayName(WrappedComponent: React.ComponentType) {
	return WrappedComponent.displayName || WrappedComponent.name || "UnknownReactComponent"
}

function isReactJSXElementConstructor(MaybeComponent: any): MaybeComponent is React.JSXElementConstructor<any> {
	return MaybeComponent?.render || MaybeComponent?.prototype?.render
}

// inspired from render-props:
// https://github.com/donavon/render-props/blob/develop/src/index.js
// but enhanced.
let _id = 0
interface OwnProps extends React.PropsWithChildren, React.Attributes {
	render?: () => React.ReactNode

	name?: string
}
function render_any_children<ChildComponentProps = {}>(props: OwnProps & ChildComponentProps): React.ReactNode {
	const { children, render, ...childProps } = props
	const id = props.key || props.name || `ra#${_id++}`
	//console.log(`[${LIB}] "${id}"`, { children, render, alienProps })

	assert(children || render, `[${LIB}] "${id}": no children nor render prop!`) // technically children can be undef/null/0/''/false BUT error boundaries are for wrapping "complex" nodes so falsy is highly unexpected
	assert(!(children && render), `[${LIB}] "${id}": competing children and render prop!`)

	const RenderfuncOrNode: React.ReactNode | ((props: ChildComponentProps) => React.ReactNode) = children || render

	if (isReactJSXElementConstructor(RenderfuncOrNode)) {
		//console.warn('[${LIB}]: component', getDisplayName(RenderfuncOrNode), id)
		return <RenderfuncOrNode {...props} />
	}

	if (typeof RenderfuncOrNode === "function")
		return RenderfuncOrNode({
			...((RenderfuncOrNode as any).defaultProps || {}), // defaultProps is deprecated, but just in case...
			...childProps,
		})

	//console.warn(`[${LIB}] "${id}": defaulting to "${RenderfuncOrNode}"`, RenderfuncOrNode)
	return RenderfuncOrNode
}

const render_any_m = memoize_one(render_any_children)

/////////////////////////////////////////////////

export { render_any_children, render_any_m }
