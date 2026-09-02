import EventEmitter from "emittery"

import { assert_from, assert } from "@monorepo-private/assert"
import { isꓽframed } from "@monorepo-private/browser-features-detection/is-framed"
import type { Immutable } from "@monorepo-private/ts--types"

import type { ImportGlob } from "../../l0-types/l0-glob/index.ts"
import { type CommonRenderParams } from "../../l0-types/l1-csf/index.ts"
import type { Config } from "../../l0-types/l2-config/index.ts"
import * as InMemState from "../l1-state/state--in-mem/index.ts"
import * as InMemStateSelectors from "../l1-state/state--in-mem/selectors.ts"
import * as UrlState from "../l1-state/state--url/index.ts"
import * as UrlStateSelectors from "../l1-state/state--url/selectors.ts"
import { type FolderUId, type StoryEntry, RenderMode, type StoryTree } from "../l1-state/types.ts"
import type { StoryUId } from "../l1-state/types.ts"

/////////////////////////////////////////////////

const EMITTER_EVT = "change"

class ObservableState {
	private stateⵧin_mem: InMemState.State = InMemState.create()

	emitter = new EventEmitter<{ [EMITTER_EVT]: string }>()

	constructor(private window: Window = self) {}

	/////////////////////////////////////////////////

	async init(stories_glob: Immutable<ImportGlob>, config?: Immutable<Config>): Promise<void> {
		console.group("Flux init...")

		this.stateⵧin_mem = InMemState.setꓽconfig(this.stateⵧin_mem, config)
		this.stateⵧin_mem = await InMemState.registerꓽstoriesⵧfrom_glob(this.stateⵧin_mem, stories_glob)

		// other states don't need an init

		const current_story = this.getꓽstoryⵧcurrent()
		if (!current_story) {
			console.warn("No stories found!")
		}

		const story_uid_from_url = UrlState.getꓽexplicit_story_uid()
		if (story_uid_from_url && current_story?.uid !== story_uid_from_url) {
			console.warn("URL and in-mem story mismatch!", { current_story, story_uid_from_url })
		}

		console.log("Flux final state =", {
			"sub-states": {
				"in-mem": this.stateⵧin_mem,
				location: {
					URL: window.location.href,
					getꓽmain_frame_url: UrlState.getꓽmain_frame_url(),
					getꓽstory_frame_url: UrlState.getꓽstory_frame_url(),
					getꓽexplicit_render_mode: UrlState.getꓽexplicit_render_mode(),
					getꓽexplicit_story_uid: UrlState.getꓽexplicit_story_uid(),
					_sp: Object.fromEntries([...UrlState._getꓽcurrent_url__search_params()]),
				},
			},
			flux: {
				getꓽrender_mode: this.getꓽrender_mode(),
				getꓽstoryⵧcurrent: this.getꓽstoryⵧcurrent(),
				getꓽRenderParamsⵧglobal: this.getꓽRenderParamsⵧglobal(),
			},
		})
		this.emitter.emit(EMITTER_EVT, `init`)

		console.groupEnd()
	}

	// explicit request on user's click
	requestꓽstory(uid: StoryUId) {
		this.stateⵧin_mem = InMemState.requestꓽstory(this.stateⵧin_mem, uid)

		UrlState.requestꓽstory(uid)

		this.emitter.emit(EMITTER_EVT, `requestꓽstory`)
	}

	addꓽannotation(key: string, value: string) {
		this.stateⵧin_mem = InMemState.addꓽannotation(this.stateⵧin_mem, key, value)

		this.emitter.emit(EMITTER_EVT, `addꓽannotation`)
	}

	/////////////////////////////////////////////////

	// for rendering the stories tree
	getꓽtree_root(): Immutable<StoryTree> {
		return this.stateⵧin_mem.tree
	}

	// for rendering a story
	getꓽconfig(): Immutable<Config> {
		return this.stateⵧin_mem.config
	}

	// initial tree render
	isꓽexpandedⵧinitially(uid: FolderUId): boolean {
		return true // TODO more complex depending on available viewport
		/*const state = getꓽstate()
		const folder = state.folders_by_uid[uid]
		*/
	}

	getꓽrender_mode(): RenderMode {
		const explicit_render_mode = UrlStateSelectors.getꓽexplicit_render_mode()
		if (explicit_render_mode) return explicit_render_mode

		if (isꓽframed()) {
			// we're in an iframe -> we're the story
			return RenderMode.story
		}

		return RenderMode.manager
	}

	getꓽpills(): Immutable<{ [key: string]: string }> {
		return this.stateⵧin_mem.view.story_area.drawer.status_bar.pills
	}

	// must only return "undef" if NO stories
	getꓽstoryⵧcurrent(): Immutable<StoryEntry> | undefined {
		const candidate_uid = UrlStateSelectors.getꓽexplicit_story_uid()
		if (candidate_uid) {
			const candidate = InMemStateSelectors.getꓽstoryⵧby_uid(this.stateⵧin_mem, candidate_uid)
			if (candidate) return candidate
		}

		return InMemStateSelectors.getꓽstoryⵧsuggested(this.stateⵧin_mem)
	}

	getꓽmain_frame_url = UrlStateSelectors.getꓽmain_frame_url
	getꓽstory_frame_url = UrlStateSelectors.getꓽstory_frame_url

	getꓽRenderParamsⵧglobal<StoryType>(): CommonRenderParams<StoryType> {
		return {
			parameters: {
				// defaults
				layout: "padded",
				...this.getꓽconfig().parameters,
				// TODO from QParams
			},
			args: {
				...this.getꓽconfig().args,
				// TODO from QParams
			},
			decorators: [...(this.getꓽconfig().decorators || [])],
		}
	}
}

/////////////////////////////////////////////////

export { ObservableState }
