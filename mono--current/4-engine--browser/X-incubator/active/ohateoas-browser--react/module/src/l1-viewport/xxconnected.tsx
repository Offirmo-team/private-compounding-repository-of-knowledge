import React, { use } from "react"

import {
	type OHAⳇHyperMedia,
	getꓽlinks,
	getꓽengagements,
	getꓽaction_blueprints,
	getꓽcta,
	OHAⳇHyperActionBlueprint,
	deriveꓽaction,
	type OHAⳇHyperLink,
	type OHAⳇStory,
	type OHAⳇHyperAction,
	type OHAServer,
} from "@monorepo-private/ohateoas"

import { ᄆComponent as ᄆComponent_ } from "./component.tsx"

/////////////////////////////////////////////////
const NAME = `OHAViewPort/2`

interface Props {
	ↆ$doc: Promise<OHAⳇHyperMedia>
	onꓽinteraction: (x: OHAⳇHyperActionBlueprint | OHAⳇHyperLink) => void
}
function ᄆComponent({ ↆ$doc, onꓽinteraction }: Props) {
	if (window.oᐧextra?.flagꓽdebug_render) console.log(`🔄 ${NAME}`)

	const $doc = use(ↆ$doc)

	return <ᄆComponent_ $doc={$doc} onꓽinteraction={onꓽinteraction} background_tasks={[]} />
}

/////////////////////////////////////////////////

export { type Props, ᄆComponent }
