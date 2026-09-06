/* Common building blocks for the more advanced types.
 */

/////////////////////////////////////////////////

// a single-line, free-form, short preferred naming
export type ContentⳇDisplayName = string

// a single-line, free-form, short preferred naming intended at crediting/marketing
export type ContentⳇPublicName = string // E.g. "Offirmo"

// a single line, plain text, short title
export type ContentⳇTitle = string // E.g. "The Boring RPG" or "La Joconde"

// is a short piece of text attached to something—most commonly an image, photo, illustration, chart, or video—that identifies it, explains it, or provides context.
export type ContentⳇCaption = string // E.g. "Sydney Harbour at sunrise"

// Normally single-line but not strict
// ~short storytelling
// TODO refine
export type ContentⳇMiniBio = string // E.g. "Creator 👨‍💻 Senior Fullstack Developer 💛 Open-source contributor"

/////////////////////////////////////////////////

export interface WithLang {
	lang?: IETFLanguageType
}

export interface WithCharset {
	charset?: never // Nothing. I use utf-8 everywhere by default.
	// trivial to implement if needed.
}

export interface WithTitle {
	title?: ContentⳇTitle
}

/////////////////////////////////////////////////

import type { IETFLanguageType, Charset } from "@monorepo-private/ts--types"
