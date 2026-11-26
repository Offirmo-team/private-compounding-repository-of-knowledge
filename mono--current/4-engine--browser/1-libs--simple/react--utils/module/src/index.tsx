/////////////////////////////////////////////////

// from React doc
// https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
export function getꓽdisplayName(WrappedComponent: React.ComponentType): string {
	return WrappedComponent.displayName || WrappedComponent.name || "UnknownReactComponent"
}

/////////////////////////////////////////////////
// TODO clarify
/*

// extracted from JSXElementConstructor (not exposed)
export type JSXElementConstructorⳇRenderFunction<Props = unknown> = FunctionComponent<Props>
export type JSXElementConstructorⳇComponentConstructor<Props = unknown> = ComponentClass<Props>

export function isꓽJSXElementConstructorⳇRenderFunction<Props = unknown>(
	maybe‿JSXRenderFunction: any,
): maybe‿JSXRenderFunction is JSXElementConstructorⳇComponentConstructor<Props> {
	if (typeof maybe‿JSXRenderFunction !== "function") return false

	// it's a function, is it returning a node or a component?
	return true
}

export function isꓽJSXElementConstructorⳇComponentConstructor<Props = unknown>(
	MaybeComponent: any,
): MaybeComponent is JSXElementConstructor<Props> {
	return MaybeComponent?.render || MaybeComponent?.prototype?.render
}
*/
/////////////////////////////////////////////////

import type { ReactNode, JSXElementConstructor, FunctionComponent, ComponentClass } from "react"
