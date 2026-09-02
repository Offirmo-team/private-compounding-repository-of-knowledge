/////////////////////////////////////////////////

export type Uri‿str = string
export type Url‿str = Uri‿str
// IRI = Uri with more characters https://en.wikipedia.org/wiki/Internationalized_Resource_Identifier
// XRI = deprecated https://en.wikipedia.org/wiki/Extensible_Resource_Identifier

////////////

// TODO review! scheme agnostic?? query optional??
// ex. /foo?sort=asc#bar
export interface SchemeSpecificURIPart {
	// TODO clarify encoding
	// TODO https://blog.whatwg.org/url-pattern-standard

	// authority: not needed for now

	/** Core property */
	path: string

	/**
	 * (optional) non-hierarchical data https://en.wikipedia.org/wiki/Query_string
	 *
	 * - The exact structure of the query string is not standardized. Methods used to parse the query string may differ
	 *   between websites. NOTE: in-scope of the scheme
	 * - Considered "unclean", try to not abuse NOT necessarily a key/value store
	 */
	query: string // TODO or query params or anything

	/**
	 * (optional) sub-resource identifier, sub-set, portion of the primary rsrc or view = representation the resource
	 * https://en.wikipedia.org/wiki/URI_fragment recommended to only use when it's not practical to serve the sub-rsrc
	 * independently https://www.w3.org/TR/cooluris/ NOTE: independent of the scheme ex. :~:text=whatever
	 */
	fragment?: string

	/**
	 * (optional) the immediate parent in the cascade. Useful to resolve the full URI IF NEEDED TODO clarify how to set a
	 * "encapsulating URI" for properly detecting and resolving relative URIs
	 */
	//parent?: SchemeSpecificURIPart
}

// "x" = "any [kind of format]"
export type Uri‿x = Uri‿str | SchemeSpecificURIPart

/////////////////////////////////////////////////

// https://www.iana.org/assignments/link-relations/link-relations.xhtml
export type LinkRelation =
	| "home"
	| "back"
	| "self" // Conveys an identifier for the link's context.
	| "about"
	| "external" // Refers to a resource that is not part of the same site as the current context.
	| "item" // The target IRI points to a resource that is a member of the collection represented by the context IRI.
	| "nofollow" // Indicates that the context’s original author or publisher does not endorse the link target.
	| "noopener" // Indicates that any newly created top-level browsing context which results from following the link will not be an auxiliary browsing context. 	[HTML]
	| "noreferrer" // Indicates that no referrer information is to be leaked when following the link. 	[HTML]
	| "opener" // Indicates that any newly created top-level browsing context which results from following the link will be an auxiliary browsing context.
	| "section" // Refers to a section in a collection of resources.'
	// TODO one day look into webmention, "Linkback" mechanism to the ones of Refback, Trackback, and Pingback
	// ultimately, everything is valid
	| string

// inspired by https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/target
export type LinkTarget =
	// from https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#target
	| "_self" // The current browsing context (default)
	| "_blank" // Usually a new tab, but users can configure browsers to open a new window instead.
	| "_parent" // The parent browsing context of the current one. If no parent, behaves as _self.
	| "_top" // The topmost browsing context. To be specific, this means the "highest" context that's an ancestor of the current one. If no ancestors, behaves as _self.
	| string // The name of a browsing context (window or tab) in which to display the resource. If no such context exists, the user agent will create one with that name

export interface Hyperlink extends WithLang {
	// hyper target of this
	href: Uri‿x

	/** https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel */
	rel: LinkRelation[] // https://www.iana.org/assignments/link-relations/link-relations.xhtml

	target?: LinkTarget

	// referrer TODO
	// opener TODO

	// do we endorse this link?
	// should we add ref?
	// follow?
	// etc...

	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
	// download
	// href
	// ping
	// referrer policy
	// attribution https://wicg.github.io/attribution-reporting-api/?sjid=5871821160398133867-AP#monkeypatch-attributionsrc
}

// "x" = "any [kind of format]"
export type Hyperlink‿x = Hyperlink | Uri‿x

////////////

export type SocialNetworkId =
	| "artstation"
	| "facebook"
	| "github"
	| "instagram"
	| "itch.io" // https://itch.io/profile/xyz
	| "linkedin"
	| "producthunt"
	| "dev.to" // DEV community https://dev.to/xyz
	| "reddit"
	| "twitch"
	| "ko-fi" // https://ko-fi.com/xyz
	| "twitter" // we keep "twitter" as an internal id, "X" is too generic
	| "me.developers.google" // Google Developers Program https://me.developers.google.com/
	| "gumroad" // digital marketplace https://gumroad.com/discover?sort=best_sellers
// TODO more on-demand

export interface SocialNetworkLink {
	url: Url‿str // mandatory
	handle?: string // ex @Offirmo, u/Offirmo
	network: SocialNetworkId // helps to parse. Not optional bc I can add if missing
}

/////////////////////////////////////////////////

import type { WithLang } from "../00-base/index.ts"
