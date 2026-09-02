import { Enum } from "typescript-string-enums"

import type { Emoji, Hyperlink‿x } from "@monorepo-private/ts--types--hypermedia"

/////////////////////////////////////////////////

// using type instead of interface to prevent extra properties
// (bc not supposed to extend this. See $hints for an open-ended extension point)
type StrictNode = {
	$v: number // schema version

	// if not provided, inferred from $content shape: Array → block, otherwise → inline
	// (this is the key invariant: block-level nodes MUST have an Array $content)
	// Not in $hints because it's core to the rendering
	$type: NodeType | "auto" // auto = "resolve later from $content shape" (see getꓽtype() in misc.ts)

	// Heading, in the generic/semantic sense =
	// - word or phrase that or sentence that explains what the following part is about
	// - written at the beginning of a structural part => is a structural element of a document
	// - clearly indicates the content of the following section
	// In our case:
	// - indicates that the content is collapsible into just the heading (if UI allows it)
	// - ~maps to a heading (HTML h1..h6, Markdown # ## ###) most of the time
	//   - thus heading is supposed to be an inline fragment
	//   - a document outline algorithm will tell the renderer the depth of the heading in the document structure
	// - MAY map to a caption/figcaption if the node is a figure
	// - may map to simple text if the content is a list (no <h>)
	$heading: NodeLike | null
	// Note: no footer, no known use case so far + not the same "collapsible" semantics

	// Content of the node
	// KEY INVARIANT: Array $content ↔ block-level node (this is how 'auto' $type is resolved)
	// - block-level nodes MUST have an Array $content
	// - inline nodes should stay a string/number as much as possible for readability
	// can refer sub-nodes with ⎨⎨key⎬⎬ syntax
	$content: NodeLike | Array<NodeLike>

	// slottable/re-usable content that can be referenced by their key
	$refs: {
		// Note: unused are allowed for convenience, excess will not be checked
		[key: SubNodeKey]: NodeLike // ~~Immutable to clearly convey that a node will not modify its given sub-nodes~~ NOO! actually it allows preparing node and improving them later!
	}

	// hints for renderers. May or may not be used, depending on renderer support
	// important read: https://nicolasgallagher.com/about-html-semantics-front-end-architecture/
	$classes: string[] // not in $hints because too useful, 1st class citizen

	// - NOTE rendering should be still acceptable even if $hints is stripped out
	// - NOTE if a feature in $hints is too good to be stripped out, then it's a hint it should be natively supported
	$hints: Hints
}

const NodeType = Enum(
	// inline vs. block https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Display/Block_and_inline_layout

	/////// display "inline"
	// strong > em > [normal] > weak
	// https://www.shecodes.io/athena/7571-understanding-the-difference-between-strong-and-em-in-html
	// https://stackoverflow.com/questions/1936864/what-is-the-difference-between-strong-and-em-tags
	"strong", // emphasis -- strong (but less strong than heading) usually rendered as bold.
	"em", // emphasis -- medium. usually rendered as italic.
	"weak", // DE-emphasis, ex. ansi.dim
	"emoji", // This node type represent a single emoji. Useful for optimal rendering. (As of 2024, emojis are still very hard to handle properly)
	// ref: https://nolanlawson.com/2024/09/17/the-continuing-tragedy-of-emoji-on-the-web/
	// TODO 1D 'code', // A short fragment of code. (too useful, and markdown has it)
	"fragmentⵧinline", // = generic inline = ~span
	// TODO 1D dedicated short formats such as number, currency, date, time, datetime, duration
	// TODO 1D dedicated micro formats such as email, phone, address...
	// TODO 1D pills?

	/////// display "block"
	//'heading' -> now a dedicated $heading prop
	"ol",
	"ul",
	"hr",
	// TODO 1D 'quoteⵧblock',
	// TODO 1D 'codeⵧblock',
	"fragmentⵧblock", // = generic block = ~div

	// TODO 1D https://www.markdownguide.org/cheat-sheet/#extended-syntax
	// TODO 1D footnotes
	// TODO 1D task list
	// TODO 1D "warnings" (GitHub `> [!IMPORTANT]`)
	// TODO 1D sub/super

	/////// special
	"br", // Useful for poems etc.
	// do not abuse, use other semantic elements (heading, lists) as much as possible before this one.
	// REMINDER the client should be the one doing line breaks for long content
	// TODO 1D 'wbr'

	// internally used, do NOT use directly
	"_h", // header, MUST be "inline" because to be used in a Markdown line: ## Lorem Ipsum
	"_li", // list item

	// 'auto' is intentionally not listed here: it's NOT a NodeType but a special internal hint to ask the NodeType to be resolved.
)
type NodeType = Enum<typeof NodeType> // eslint-disable-line no-redeclare

// hints for progressive enhancement
// - for rendering, hints should be OPTIONAL and any renderer should be able to render decently without them
// - for non-rendering (ex. hypermedia features) hints can be made mandatory
// UnderlyingData = JSON = no, causes the error "Type instantiation is excessively deep and possibly infinite."
interface Hints<UnderlyingData = any, HyperLink = Hyperlink‿x> {
	// string or keyword to use as bullets. to remove bullets: ''
	// https://www.w3schools.com/cssref/pr_list-style-type.php
	list__style__type?: string

	possible_emoji?: Emoji // this emoji can be used to represent/augment this node

	underlying__data?: UnderlyingData // the resource data this representation was rendered from. Usage: a better renderer (ex. interactive widget) may ignore the rich text and re-render from this instead
	//underlying__uuid?: string // for ex. to recognize a specific resource without attaching it to the content TODO review duplicate of href?

	// Hypermedia
	href?: HyperLink // make this node as an anchor to another Hypermedia resource
	// advanced = moved to dedicated OHA lib

	// TODO styles TODO colors TODO theme

	key?: string // for ex. to recognize a specific content. Also used for debug in building React keys. (do not abuse! Reminder to keep everything text-compatible)

	// TODO review uuid

	// anything allowed
	[k: string]: any // TODO better TS hintable format cf. Matt Poccock
}

type SubNodeKey = string

type Node = Partial<StrictNode>

// Node + stuff trivial+safe to promote to a Node
type NodeLike = string | number | Node
// We want Nodes to be natively JSON serializable, so no BigInt, date...
// boolean, null = let's wait before assigning meaning to them

///////

// aliases
type Document = NodeLike

/////////////////////////////////////////////////

export { NodeType, type Hints, type SubNodeKey, type StrictNode, type Node, type NodeLike, type Document }
