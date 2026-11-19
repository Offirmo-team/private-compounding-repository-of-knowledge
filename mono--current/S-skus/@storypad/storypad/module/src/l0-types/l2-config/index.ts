import { type CommonRenderParams } from "../l1-csf/index.ts"

/////////////////////////////////////////////////

// note: extending RenderParams for convenience, but this is non-standard
export interface Config<StoryType = any> extends Partial<CommonRenderParams<StoryType>> {
	// https://storybook.js.org/docs/configure#configure-your-storybook-project
	addons?: never // not implemented

	// my extensions
	root_title: string
}
