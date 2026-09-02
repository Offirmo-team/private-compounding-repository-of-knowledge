import * as React from 'react'

import {
	renderⵧto_react,
	intermediate_onꓽnodeⵧexit,
	intermediate_assemble,
	InteractiveRichTextFragment,
} from '../../../index.js'

////////////

function on_nodeⵧexit(params, options) {
	const { children, classes, component, wrapper } = intermediate_onꓽnodeⵧexit(params, options)
	const {
		state,
		$node: { $hints },
		$id,
	} = params

	if (classes.includes('monster')) {
		children.push(
			<span key={$id} className="monster-emoji">
				{$hints.possible_emoji}
			</span>,
		)
	}

	let element = intermediate_assemble(
		{ ...params, children, classes, component, wrapper },
		options,
	)

	if ($hints.uuid) {
		//console.log(`${LIB} seen element with uuid:`, $node)
		const UUID = $hints.uuid
		const base = element
		const render_detailed = () => {
			return (
				<React.Fragment>
					{base}
					<p>additional info</p>
					<p className="o⋄colorꘌancillary">piece of lore</p>
					<button>foo</button>
					<button>bar</button>
				</React.Fragment>
			)
		}

		// note: key with UUID is needed in case the popup is open
		// and the parent element changes, ex. inventory item swap
		element = (
			<InteractiveRichTextFragment
				key={`IRTF.${$id}.uuid:${UUID}`}
				UUID={UUID}
				render_detailed={render_detailed}
			>
				{base}
			</InteractiveRichTextFragment>
		)
	}

	state.element = element
	return state
}

////////////

const DEFAULT_OPTIONS = {
	key: 'rich-text-to-react[DEMO]--root',
	render_interactive: true,
}

export default function rich_text_to_react(doc, options = {}) {
	//console.log(`${LIB} Rendering a rich text:`, doc)
	return renderⵧto_react(
		doc,
		{
			on_nodeⵧexit,
		},
		{
			...DEFAULT_OPTIONS,
			...options,
		},
	)
}
