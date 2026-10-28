/////////////////////////////////////////////////

export interface SXCPlugin<State = {}> {
	id: SXCPluginⳇId

	augment: (ROOT_PROTOTYPE: any) => void

	state: {
		create(parent_state: State | undefined): State
	}
}

// to be extended through TS module augmentation
export interface InternalSXCⳇStateⳇPlugins {}

export type SXCPluginⳇId = keyof InternalSXCⳇStateⳇPlugins

/////////////////////////////////////////////////
