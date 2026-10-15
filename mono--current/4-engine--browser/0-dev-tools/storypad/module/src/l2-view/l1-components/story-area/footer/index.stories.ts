import render from "./index.ts"

/////////////////////////////////////////////////

export function Default(): HTMLElement {
	const state = new ObservableState()

	return render(state)
}

/////////////////////////////////////////////////

import { ObservableState } from "../../../../l1-flux/l2-observable/index.ts"
