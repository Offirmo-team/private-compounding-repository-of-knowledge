import type { RawRenderParams, GenericArgs, GenericStoryOutput } from "../common/index.ts"

/////////////////////////////////////////////////
// Component story format CSF
// https://storybook.js.org/docs/react/api/csf
// https://github.com/ComponentDriven/csf
// https://www.componentdriven.org/
// I could steal the definitions from the storybook source code,
// but they're huge: I'd rather work it out feature by feature.

/* default export
 * https://storybook.js.org/docs/api/csf#default-export
 */
export interface Meta‿v2 extends RawRenderParams<Story‿v2> {
	// https://storybook.js.org/docs/api/csf#upgrading-from-csf-2-to-csf-3

	// tweak inheritance from RenderParams
	component?: never // NO since we have a render
	render?: never // NO! the story itself is the "render"
}

/* named export = a story = a FUNCTION for v2
 */
export interface Story‿v2 extends RawRenderParams<Story‿v2> {
	(args: GenericArgs): GenericStoryOutput

	// tweak inheritance from RenderParams
	// NONE the function itself is the "render"
	render?: never
	component?: never

	name?: string
}
export function isꓽStory‿v2(s: any): s is Story‿v2 {
	return typeof s === "function"
}

/////////////////////////////////////////////////

export * from "../common/index.ts"
