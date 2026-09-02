/** "walk" is the foundation on which all the renderers are based */

import { assert_from, assert } from "@monorepo-private/assert"
import { capitalizeⵧfirst } from "@monorepo-private/normalize-string"
import {
	type NodeLike,
	NodeType,
	type SubNodeKey,
	type StrictNode,
	type Node,
	isꓽNodeLike,
} from "@monorepo-private/rich-text-format"
import {
	normalizeꓽnode,
	promoteꓽto_node,
	getꓽdisplay_type,
	getꓽtype,
	isꓽlist,
	wrap,
} from "@monorepo-private/rich-text-format"
import type { Immutable } from "@monorepo-private/ts--types"
import { hasꓽshape, isꓽexact_stringified_number } from "@monorepo-private/type-detection"

import { getꓽcontent‿nodes_list } from "./common.ts"
import { LIB } from "./consts.ts"

/////////////////////////////////////////////////
// base rendering options

interface BaseRenderingOptions {
	shouldꓽstrip_hints: boolean // experimental

	// what should happen if a sub-node could not be resolved?
	// (final, after calling resolveꓽunknown_ref())
	shouldꓽrecover_from_unknown_sub_nodes:
		| "crash" // don't recover -> crash (default)
		| "placeholder" // NOT RECOMMENDED: replace with an ugly placeholder. Useful if we can't afford to fail.
}

const DEFAULT_RENDERING_OPTIONSⵧWalk = Object.freeze<BaseRenderingOptions>({
	shouldꓽstrip_hints: false,
	shouldꓽrecover_from_unknown_sub_nodes: "crash",
})

/////////////////////////////////////////////////
// Hooks

interface BaseWalkState {
	aggregated_refs: StrictNode["$refs"]

	depthⵧh: number // header depth
	depthⵧlist: number // list depth
	depthⵧnodes: number // overall depth ((no known usage for now / debug only)

	$snk: SubNodeKey // if this node was a ref, its SubNodeKey. If not, an auto-generated "ref-like" string. Known uses: better React keys

	// TODO 1D auto aggregate classes

	//$parent_node: Immutable<CheckedNode> | null TODO review useful for context?
}

interface BaseHookParams<RendererState> {
	// shared generic state, see BaseWalkState for explanations
	$node: Immutable<StrictNode>

	// base, common state
	bstate: Immutable<BaseWalkState> // hooks can peek, but are not allowed to mutate it

	// custom renderer's state
	xstate: RendererState // hooks can freely mutate or derive
}

// known usages:
// - creating/deriving the new "sub-node" custom renderer state
// - note: renderers are free to extend the state or create a new one, depending on their needs
interface OnNodeEnterParams<RendererState> extends BaseHookParams<RendererState> {}

// known usages:
// - perform normalization/linting/autofixes on the node
// - perform post-processing on the node
interface OnNodeExitParams<RendererState> extends BaseHookParams<RendererState> {}

// known usages:
// - text renderer
interface OnConcatenateStringParams<RendererState> extends BaseHookParams<RendererState> {
	str: string
}

// known usages:
// - text renderer
// REMINDER this is done at the PARENT level => node, state, depth all refer to the PARENT node concatenating the child TODO review this?
interface OnConcatenateSubNodeParams<RendererState> extends BaseHookParams<RendererState> {
	// depending on how renderer works,
	// if they created a new state for the child node,
	// this is an opportunity to "consume/reduce" the child state into its own state
	xstateⵧsub: RendererState

	row_index: number // if this node is from an array content, its index there; else -1
	//col_index: number // if this node is from an array content, its col index there; else -1 TODO 1D
}

/*
// FILTER TODO review
interface OnFilterParams<RendererState> extends BaseHookParams<RendererState> {
	$filter: string
	$filters: string[]
}
// CLASS
interface OnClassParams<RendererState> extends BaseHookParams<RendererState> {
	$class: string
}
// TYPE
interface OnTypeParams<RendererState> extends BaseHookParams<RendererState> {
	$type: NodeType
}
*/

// it's useful to have a dynamic way to resolve unknown refs, ex. if querying a big data store = inconvenient to preload all possible $refs
interface UnknownRefResolver<RendererState, RenderingOptions> {
	($ref_key: string, context: BaseHookParams<RendererState>, options: RenderingOptions): NodeLike | undefined
}

interface RendererStateCreator<RendererState, RenderingOptions> {
	(options: RenderingOptions, parent_state: RendererState | undefined): RendererState
}

// generic reducer type for all hooks
interface WalkerReducer<RendererState, P extends BaseHookParams<RendererState>, RenderingOptions> {
	(params: P, options: RenderingOptions): RendererState
}

interface WalkerCallbacks<RendererState, RenderingOptions extends BaseRenderingOptions> {
	// whatever state the renderer needs
	// usually accumulates the output (at least)
	createꓽstate: RendererStateCreator<RendererState, RenderingOptions>

	onꓽnodeⵧenter: WalkerReducer<RendererState, OnNodeEnterParams<RendererState>, RenderingOptions>
	onꓽnodeⵧexit: WalkerReducer<RendererState, OnNodeExitParams<RendererState>, RenderingOptions>

	onꓽconcatenateⵧstr: WalkerReducer<RendererState, OnConcatenateStringParams<RendererState>, RenderingOptions>
	onꓽconcatenateⵧsub_node: WalkerReducer<RendererState, OnConcatenateSubNodeParams<RendererState>, RenderingOptions>

	/* TODO review
	onꓽclassⵧbefore: WalkerReducer<RendererState, OnClassParams<RendererState>, RenderingOptions>
	onꓽclassⵧafter: WalkerReducer<RendererState, OnClassParams<RendererState>, RenderingOptions>

	onꓽfilter: WalkerReducer<RendererState, OnFilterParams<RendererState>, RenderingOptions>
	onꓽfilterꘌCapitalize: WalkerReducer<
		RendererState,
		OnFilterParams<RendererState>,
		RenderingOptions
	>
	// extensions
	[onꓽfilterꘌxyz: string]: WalkerReducer<RendererState, OnFilterParams<RendererState>, RenderingOptions>,

	onꓽtype: WalkerReducer<RendererState, OnTypeParams<RendererState>, RenderingOptions>
	// select known specials
	onꓽtypeꘌhr?: WalkerReducer<RendererState, OnTypeParams<RendererState>, RenderingOptions>
	onꓽtypeꘌbr?: WalkerReducer<RendererState, OnTypeParams<RendererState>, RenderingOptions>
	// extensions
	[onꓽtypeꘌxyz: string]: WalkerReducer<RendererState, OnTypeParams<RendererState>, RenderingOptions>,

	// hard to type strictly
	[onꓽfilter_or_type: string]: any
	*/

	// useful for dynamically generated refs
	resolveꓽunknown_ref: UnknownRefResolver<RendererState, RenderingOptions>
}

/////////////////////////////////////////////////

function _getꓽcallbacksⵧdefault<RendererState, RenderingOptions extends BaseRenderingOptions = any>(): WalkerCallbacks<
	RendererState,
	RenderingOptions
> {
	function identityReducer({ xstate }: { xstate: RendererState }): RendererState {
		return xstate
	}

	return {
		createꓽstate: () => {
			// tricky to get right
			throw new Error("YOU NEED TO IMPLEMENT createꓽstate()!")
		},

		onꓽnodeⵧenter: identityReducer,
		onꓽnodeⵧexit: identityReducer,

		onꓽconcatenateⵧstr: identityReducer,
		onꓽconcatenateⵧsub_node: identityReducer,

		/*
		onꓽclassⵧbefore: identityReducer,
		onꓽclassⵧafter: identityReducer,

		onꓽfilter: identityReducer,
		onꓽfilterꘌCapitalize: ({ state }: { state: RendererState }) => {
			// TODO review many capitalize!
			// generic processing that works for text, ansi, React...
			const generic_state = state as any
			if (generic_state && typeof generic_state.str === 'string') {
				//console.log(`${LIB} auto capitalizing...`, state)
				return {
					...(generic_state as any),
					str: capitalizeⵧfirst(generic_state.str),
				} satisfies RendererState
			}

			return state
		},

		onꓽtype: identityReducer,
		*/

		resolveꓽunknown_ref(
			$refs_node_id: string,
			context: BaseHookParams<RendererState>,
			options: RenderingOptions,
		): Node | undefined {
			// BEWARE OF INFINITE LOOPS!
			// RECOMMENDED TO ONLY RETURN SIMPLE NODES (just text)
			return undefined
		},
	}
}

const SUB_NODE_BR: Node = Object.freeze<Node>({
	$type: "br",
	$content: "\n", // convenient, prevent the renderers from having to do special handling
})

const SUB_NODE_HR: Node = Object.freeze<Node>({
	$type: "hr",
	// no content, this one is too special
})

/////////////////////////////////////////////////

function walk<CustomWalkState, RenderingOptions extends BaseRenderingOptions>(
	$raw_node: Immutable<NodeLike>,
	raw_callbacks: Immutable<Partial<WalkerCallbacks<CustomWalkState, RenderingOptions>>>,
	options: RenderingOptions, // this internal fn can't default unknown type, so we expect the caller to give us full options
) {
	const ǃ = assert_from({ walk })

	const callbacksⵧdefault = _getꓽcallbacksⵧdefault<CustomWalkState, RenderingOptions>()
	ǃ.assert(
		hasꓽshape(callbacksⵧdefault, raw_callbacks, {
			allow_extra_props: false,
			match_reference_props: "some",
		}),
		`${LIB}[walk]: custom callbacks should match the expected format, check the API!`,
	)

	const callbacks: WalkerCallbacks<CustomWalkState, RenderingOptions> = {
		...callbacksⵧdefault,
		...(raw_callbacks as any as WalkerCallbacks<CustomWalkState, RenderingOptions>),
	}

	ǃ.assert(
		hasꓽshape(options, DEFAULT_RENDERING_OPTIONSⵧWalk, {
			allow_extra_props: true,
			match_reference_props: "some",
		}),
		`${LIB}[walk]: options should match the expected format, check the API!`,
	)

	const bstate: BaseWalkState = {
		aggregated_refs: {},

		depthⵧh: -1, // TODO 1D allow starting at different depth through options
		depthⵧnodes: -1,
		depthⵧlist: -1,

		$snk: "_$root",

		//$parent_node: null,
		//$id: 'root',
		//$root_node,
	}
	let xstate = callbacks.createꓽstate(options, undefined)
	//xstate = callbacks.onꓽnodeⵧenter({ $node, bstate, xstate }, options) not really needed since no parent. avoid a promotion.

	return _walk(callbacks, options, bstate, xstate, $raw_node, "_$root")
}

/////////////////////////////////////////////////

export { type BaseRenderingOptions, DEFAULT_RENDERING_OPTIONSⵧWalk, type WalkerCallbacks, type BaseWalkState, walk }

/////////////////////////////////////////////////

/** Walk recursively inside a node. Must return a NEW "node" state = this is NOT a reducer!! */
function _walk<CustomWalkState, RenderingOptions extends BaseRenderingOptions>(
	callbacks: Immutable<WalkerCallbacks<CustomWalkState, RenderingOptions>>,
	options: RenderingOptions,
	bstateⵧparent: BaseWalkState,
	xstateⵧparent: CustomWalkState,
	$raw_node: Immutable<NodeLike>,
	$snk?: SubNodeKey, // if this node was a ref, its SubNodeKey
) {
	const ǃ = assert_from({ _walk })

	ǃ.forⵧparam({ $raw_node }).require(isꓽNodeLike($raw_node))

	const $node = maybe_strip_hints(normalizeꓽnode(promoteꓽto_node($raw_node)), options.shouldꓽstrip_hints)
	const { $heading, $refs, $type } = $node
	ǃ.forⵧparam({ $raw_node }).require($type !== "auto", `${LIB}: $type should never be "auto" at this stage!`)

	// ~linting
	// TODO 1D lint which block can be a child of another
	// TODO 1D lint circular refs

	// build child states
	const bstate: BaseWalkState = {
		...bstateⵧparent,
		aggregated_refs: Object.create(
			bstateⵧparent.aggregated_refs,
			Object.fromEntries(Object.entries($refs).map(([k, value]) => [k, { value }])),
		),
		depthⵧnodes: bstateⵧparent.depthⵧnodes + 1,
		...(getꓽtype($node) === NodeType.ol && { depthⵧlist: bstateⵧparent.depthⵧlist + 1 }),
		...(getꓽtype($node) === NodeType.ul && { depthⵧlist: bstateⵧparent.depthⵧlist + 1 }),

		// XXX
		...($heading !== null && { depthⵧh: bstateⵧparent.depthⵧh + 1 }),

		...($snk && { $snk }),
	}
	let xstate = callbacks.createꓽstate(options, xstateⵧparent)

	xstate = callbacks.onꓽnodeⵧenter({ $node, bstate, xstate }, options)

	xstate = _walkꓽcontent(callbacks, options, bstate, xstate, $node)

	xstate = callbacks.onꓽnodeⵧexit({ $node, bstate, xstate }, options)

	return xstate
}

function maybe_strip_hints($node: Immutable<StrictNode>, should_strip: boolean): Immutable<StrictNode> {
	if (!should_strip) {
		return $node
	}

	return {
		...$node,
		$hints: {},
	}
}

/////////////////////////////////////////////////

function _walkꓽStringWithRefs<CustomWalkState, RenderingOptions extends BaseRenderingOptions>(
	callbacks: WalkerCallbacks<CustomWalkState, RenderingOptions>,
	options: RenderingOptions,
	bstate: BaseWalkState,
	xstate: CustomWalkState,
	$node: Immutable<StrictNode>,
	$content: string, // looks like "Hello ⎨⎨world⎬⎬, welcome to ⎨⎨place|filter1|filter2⎬⎬
) {
	const ǃ = assert_from({ _walk_StringWithRefs: _walkꓽStringWithRefs })

	const splitⵧby_opening_brace = $content.split("⎨⎨")
	const splitⵧby_closing_brace = $content.split("⎬⎬")

	// quick check for matching
	// 1. open and close count should match
	ǃ.assert(
		splitⵧby_closing_brace.length === splitⵧby_opening_brace.length,
		`${LIB}: syntax error in content "${$content}", unmatched ⎨⎨⎬⎬! (1)`,
	)
	// 2. should be ordered open - close - open - close...
	ǃ.assert(
		splitⵧby_opening_brace.every((s) => s.split("⎬⎬").length <= 2),
		`${LIB}: syntax error in content "${$content}", unmatched ⎨⎨⎬⎬! (2a)`,
	)
	ǃ.assert(
		splitⵧby_closing_brace.every((s) => s.split("⎨⎨").length <= 2),
		`${LIB}: syntax error in content "${$content}", unmatched ⎨⎨⎬⎬! (2b)`,
	)

	const initial_str: string = splitⵧby_opening_brace.shift()!
	if (initial_str) {
		ǃ.assert(initial_str.split("⎬⎬").length === 1, `${LIB}: syntax error in content "${$content}", unmatched ⎨⎨⎬⎬!`)
		xstate = callbacks.onꓽconcatenateⵧstr(
			{
				$node,
				bstate,
				xstate,
				str: initial_str,
			},
			options,
		)
	}

	xstate = splitⵧby_opening_brace.reduce(
		(xstate: CustomWalkState, param_and_text: string, row_index): CustomWalkState => {
			const split_end = param_and_text.split("⎬⎬")
			if (split_end.length !== 2) throw new Error(`${LIB}: syntax error in content "${$content}", unmatched ⎨⎨⎬⎬!`)

			// splitting the ⎨⎨place|filter1|filter2⎬⎬ content
			const [$ref_key, ...$filters] = split_end.shift()!.split("|")
			assert($ref_key, `${LIB}: syntax error in content "${$content}", empty ⎨⎨⎬⎬!`)

			let $referenced_node = promoteꓽto_node(
				(function _resolve_ref_by_id(): Immutable<StrictNode>["$refs"][string] {
					if ($ref_key === "br") {
						ǃ.assert(
							!bstate.aggregated_refs[$ref_key],
							`${LIB}: error in content "${$content}", having a reserved subnode "${$ref_key}"!`,
						)
						return SUB_NODE_BR
					}

					if ($ref_key === "hr") {
						ǃ.assert(
							!bstate.aggregated_refs[$ref_key],
							`${LIB}: error in content "${$content}", having a reserved subnode "${$ref_key}"!`,
						)
						return SUB_NODE_HR
					}

					if (bstate.aggregated_refs[$ref_key] !== undefined) {
						// reminder: can be a falsy node-like 0, ''
						return bstate.aggregated_refs[$ref_key]!
					}

					// sub node is missing on the node or its ancestors, advanced resolution:

					const candidate_from_resolver = callbacks.resolveꓽunknown_ref(
						$ref_key,
						{
							$node,
							bstate,
							xstate,
						},
						options,
					)
					if (candidate_from_resolver) return candidate_from_resolver

					if (options.shouldꓽrecover_from_unknown_sub_nodes === "placeholder") {
						return { $content: `{{??${$ref_key}??}}` }
					}

					if (true) {
						console.error("shouldꓽrecover_from_unknown_sub_nodes FAILURE")
						console.error($node, { $content, sub_node_id: $ref_key })
					}
					throw new Error(
						`${LIB}: syntax error in content "${$content}", it's referencing an unknown sub-node "${$ref_key}"! (recover mode = ${options.shouldꓽrecover_from_unknown_sub_nodes})`,
					)
				})(),
			)

			let xstateⵧsub = _walk(callbacks, options, bstate, xstate, $referenced_node, $ref_key)

			if ($filters.length > 0) {
				console.log("TODO review & reimplement filters", $filters)

				xstateⵧsub = $filters.reduce((xstateⵧsub, $filter) => {
					ǃ.forⵧvalue({ $filter }).ensure(!!$filter)
					/*
				return callbacks.onꓽfilter(
					{
						$filter,
						$filters,
						state,
						$node,
						depth,
					},
					options,
				)
				 */
					return xstateⵧsub
				}, xstateⵧsub)
			}

			xstate = callbacks.onꓽconcatenateⵧsub_node(
				{
					$node,
					bstate,
					xstate,
					xstateⵧsub,
					row_index,
				},
				options,
			)

			if (split_end[0])
				xstate = callbacks.onꓽconcatenateⵧstr(
					{
						$node,
						bstate,
						xstate,
						str: split_end[0],
					},
					options,
				)

			return xstate
		},
		xstate,
	)

	return xstate
}

function _walkꓽcontent<CustomWalkState, RenderingOptions extends BaseRenderingOptions>(
	callbacks: WalkerCallbacks<CustomWalkState, RenderingOptions>,
	options: RenderingOptions,
	bstate: BaseWalkState,
	xstate: CustomWalkState,
	$node: Immutable<StrictNode>,
) {
	const ǃ = assert_from({ _walk_content: _walkꓽcontent })

	if ($node.$heading) {
		const $heading = wrap($node.$heading, "_h")
		const xstateⵧsub = _walk(callbacks, options, bstate, xstate, $heading, "_$heading")
		xstate = callbacks.onꓽconcatenateⵧsub_node(
			{
				$node,
				bstate,
				xstate,
				xstateⵧsub,
				row_index: -1,
			},
			options,
		)
	}

	let $content = getꓽcontent‿nodes_list($node)
	$content.forEach(($row_node, row_index) => {
		if (typeof $row_node === "string") {
			xstate = _walkꓽStringWithRefs(callbacks, options, bstate, xstate, $node, $row_node)
			return
		}

		const xstateⵧsub = _walk(callbacks, options, bstate, xstate, $row_node, `_ct#${row_index}`)
		xstate = callbacks.onꓽconcatenateⵧsub_node(
			{
				$node,
				bstate,
				xstate,
				xstateⵧsub,
				row_index,
			},
			options,
		)
	})

	return xstate
}
