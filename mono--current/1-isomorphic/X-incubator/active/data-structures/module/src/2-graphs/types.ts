/* GENERIC types for a generic graph
 * Those types should be IMPLEMENTATION INDEPENDENT
 */

import type { WithOptions, WithPayload } from "../1-common/types.ts"

/////////////////////////////////////////////////

export type NodeUId = string
export type LinkUId = string

export interface Node<NodePayload> extends WithPayload<NodePayload> {
	uid: NodeUId
}

export interface Link<LinkPayload> extends WithPayload<LinkPayload> {
	uid: LinkUId

	// NO! implementation varies
	//from: NodeUId
	//to: NodeUId
}

// is options really needed?
export interface Graph<NodePayload, LinkPayload, Options> extends WithOptions<Options> {}

/////////////////////////////////////////////////

//type createFn<NodePayload, LinkPayload, Options> = (options?: Options) => Graph<NodePayload, LinkPayload, Options>

/////////////////////////////////////////////////
