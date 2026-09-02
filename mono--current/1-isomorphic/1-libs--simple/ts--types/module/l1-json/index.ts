/* JSON
 * https://devblogs.microsoft.com/typescript/announcing-typescript-3-7-rc/#more-recursive-type-aliases
 *
 * As of 2025/09, this causes "excessive deep instantiation" errors
 * and it's not really useful = turn them into pure names instead
 * IF NEEDED resurrect them from type-fest
 */

export type JSONPrimitiveType = null | boolean | number | string | undefined // undefined is technically not allowed but added for convenience

export type JSONObjectKey = string // only string allowed

export interface JSONObject {
	[k: JSONObjectKey]: any
}

export type JSONArray = Array<any>

export type JSON = any
