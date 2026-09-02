import type { RawRenderParams } from "../common/index.ts"
import { isꓽStory‿v2 } from "../v2/index.ts"

/////////////////////////////////////////////////
// Component story format CSF
// https://storybook.js.org/docs/react/api/csf
// https://github.com/ComponentDriven/csf
// https://www.componentdriven.org/
// I could steal the definitions from the storybook source code,
// but they're huge: I'd rather work it out feature by feature.

// = default export + named exports

/* default export
 * https://storybook.js.org/docs/api/csf#default-export
 * TODO remove ? and auto-set them
 */
export interface Meta‿v3 extends RawRenderParams<Story‿v3> {
	// https://storybook.js.org/docs/writing-stories#default-export

	// tweak inheritance from RenderParams
	//component?: StoryComponent‿v3
	//render?: (args: GenericArgs) => StoryOutput‿v3

	title?: never

	includeStories?: never
	excludeStories?: never
	argTypes?: {
		[key: string]: never
	}
}

/* named export = a story = an OBJECT for v3
 */
export interface Story‿v3 extends RawRenderParams<Story‿v3> {
	// https://storybook.js.org/docs/writing-stories#defining-stories

	// tweak inheritance from RenderParams
	//render?: (args: GenericArgs) => StoryOutput‿v3
	//component?: StoryComponent‿v3

	name?: never
}
export function isꓽStory‿v3(s: any): s is Story‿v3 {
	return !isꓽStory‿v2(s)
}

/////////////////////////////////////////////////

export * from "../common/index.ts"
