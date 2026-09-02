import { Enum } from "typescript-string-enums"

import { type FileSystemNodeⳇFolder } from "@monorepo-private/data-structures"

import { type Story, isꓽStory, type Meta } from "../../l0-types/l1-csf"

/////////////////////////////////////////////////

export type StoryUId = string
export interface StoryEntry {
	uid: StoryUId // for convenience when passing the payload around

	story: Story

	meta: Meta | undefined
}
export function isꓽStoryEntry(x: any): x is StoryEntry {
	return isꓽStory(x?.story)
}

export type FolderUId = string
export interface StoryFolder {
	uid: FolderUId // for convenience when passing the payload around

	isꓽexpandedⵧinitially: boolean
}
export function isꓽStoryFolder(x: any): x is StoryFolder {
	return !isꓽStoryEntry(x) // simple for now ;)
}

export type StoryTree = FileSystemNodeⳇFolder<StoryEntry, StoryFolder>

/////////////////////////////////////////////////

// tslint:disable-next-line: variable-name
export const RenderMode = Enum(
	// from Storybook
	"story",
	"settings", // ??
	"docs",
	// storypad extensions
	"manager", // = full
	"story_full", // story + control bar + panel
)
export type RenderMode = Enum<typeof RenderMode> // eslint-disable-line no-redeclare

export function isꓽrender_mode(x: any): x is RenderMode {
	return Enum.isType(RenderMode, x)
}
