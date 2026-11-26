/////////////////////////////////////////////////
// inspired from render-props: https://github.com/donavon/render-props/
// but enhanced.
// concepts:
// - we LIKE render functions because it's easier to catch render errors
// TODO CLARIFY USAGE, UNCLEAR ATM

const LIB = "render_any_children()"

//
export type RenderFunc<P = {}> = (params: P) => ReactNode

export interface RenderAnyⳇProps<RenderFuncParams = {}> extends React.Attributes {
	children?: ReactNode | RenderFunc<RenderFuncParams> | undefined
	render?: RenderFunc<RenderFuncParams>

	displayName?: FunctionComponent["displayName"]
}

let _id = 0
export function render_any_children<PropsOrParams = {}>(
	props: RenderAnyⳇProps<PropsOrParams> & PropsOrParams,
): React.ReactNode {
	const ǃ = assert_from({ render_any_children })

	const { children, render, ...child_props } = props
	const id = props.key || props.displayName || `ra#${_id++}`
	//console.log(`[${LIB}] "${id}"`, { children, render, alienProps })

	ǃ.require(children || render, `[${LIB}] "${id}": no children nor render prop`) // technically children can be undef/null/0/''/false BUT error boundaries are for wrapping "complex" nodes so we call out falsy
	ǃ.require(!(children && render), `[${LIB}] "${id}": competing children and render prop`)

	const RenderfuncOrNode: React.ReactNode | RenderFunc<PropsOrParams> = children || render

	if (typeof RenderfuncOrNode === "function") {
		const props: PropsOrParams = {
			...((RenderfuncOrNode as any).defaultProps || {}), // defaultProps is deprecated, but just in case...
			...child_props,
		}

		return RenderfuncOrNode(props)
	}

	return RenderfuncOrNode
	/*
	// https://github.com/donavon/render-props/blob/develop/src/index.js

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
	 */
}

export const render_any_childrenⵧmemoized = memoize_one(render_any_children)

/////////////////////////////////////////////////

function isReactJSXElementConstructor(MaybeComponent: any): MaybeComponent is React.JSXElementConstructor<any> {
	// NOT CORRECT
	return MaybeComponent?.render || MaybeComponent?.prototype?.render
}

/////////////////////////////////////////////////
import memoize_one from "memoize-one"
import type { ReactNode, FunctionComponent } from "react"

import { assert_from } from "@monorepo-private/assert"
import { getꓽdisplayName } from "@monorepo-private/react--utils"
