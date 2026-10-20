/* JSON
 * https://devblogs.microsoft.com/typescript/announcing-typescript-3-7-rc/#more-recursive-type-aliases
 *
 * We use names close to type-fest.
 * TODO 1D evaluate whether worth switching to type-fest
 */

export type JsonⳇPrimitive = null | boolean | number | string | undefined // undefined is technically not allowed but added for convenience

export interface JsonⳇObject {
	[k: JsonⳇObjectⳇKey]: JsonⳇValue
}

export type JsonⳇObjectⳇKey = string // only string allowed

export type JsonⳇArray = Array<JsonⳇValue>

// As of 2025/09, strictly typing causes "excessive deep instantiation" errors
// and is not really useful.
// We only keep the alias.
export type JsonⳇValue = any
