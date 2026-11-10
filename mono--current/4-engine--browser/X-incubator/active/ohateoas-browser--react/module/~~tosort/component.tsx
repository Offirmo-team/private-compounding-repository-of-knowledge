import React, { useState, useRef } from 'react'

import {
	type Url‿str,
	getꓽuriⵧnormalized‿str,
} from '@monorepo-private/ts--types--web'
import renderⵧto_react from '@monorepo-private/rich-text-format--to-react'

import {
	type OHAHyperMedia,
	getꓽlinks,
	getꓽengagements,
	getꓽaction_blueprints,
	getꓽcta,
	OHAHyperActionBlueprint,
	deriveꓽaction, type OHAHyperLink, type OHAStory, type OHAHyperAction, type OHAServer, OHALinkRelation,
} from '@monorepo-private/ohateoas'

import ᄆChrome from './chrome/index.tsx'

import './component.css'

/////////////////////////////////////////////////
const NAME = `OHAViewPort/1`

interface Props {
	$doc: OHAHyperMedia
	onꓽinteraction: (x: OHAHyperAction | OHAHyperLink) => void
}
function ᄆComponent({$doc, onꓽinteraction}: Props) {
	if (window.oᐧextra?.flagꓽdebug_render) console.log(`🔄 ${NAME}`)

	const refⵧdialog = useRef(undefined)
	const [fg_action, setFgAction] = useState<undefined | Promise<unknown>>(undefined)

	const engagements = getꓽengagements($doc)
	const action_blueprints = getꓽaction_blueprints($doc)
	const links = getꓽlinks($doc)

	async function on_click_action(action_blueprint: OHAHyperActionBlueprint) {
		const { action, feedback } = deriveꓽaction(action_blueprint)

		console.log(`on_click_action`, action_blueprint, action, feedback)

		const ೱdispatch_result = onꓽinteraction(action)
		let ೱtask = ೱdispatch_result // so far

		// TODO durationⵧmin‿ms

		switch(feedback.tracking) {
			case 'forget':
				// TODO
				break
			case 'background':
				// not implemented yet
				// fallback on foreground
			case 'foreground': {
				setFgAction(ೱtask)
				refⵧdialog.current.showModal()
				break
			}
			default:
				throw new Error(`Feedback tracking "${feedback.tracking}" not implemented!`)
		}

		if (feedback.story) {
			throw new Error(`Not implemented feedback story!`)
		}

		if (feedback[OHALinkRelation.continueᝍto]) {
			throw new Error(`Not implemented continueᝍto!`)
		}

		ೱtask
			.then((story?: OHAStory) => {
				console.log('task done', story)

				if (story) {
					console.warn(`TODO implement displaying story!`, story)

					// TODO continue to ??
				}
			})
			.catch(err => {
				console.error('task failed', err)
			})
			.finally(() => {
				setFgAction(undefined)
				refⵧdialog.current.close()
			})
	}

	return (
		<section key={NAME}>
			<div key="notifs">
				[TODO top notifs]
				<hr />
			</div>

			{renderⵧto_react($doc)}

			<hr key='sep--actions'/>
			{Object.values(action_blueprints).map((action_blueprint) => {
				return <button
					key={action_blueprint.type /* XXX may not be unique!!! */ }
					onClick={() => {
						onꓽinteraction(action_blueprint)
					}}
				>{getꓽcta(action_blueprint)}</button>
			})}

			<hr key='sep--links'/>
			{Object.values(links).map((link, index) => {
				const href = getꓽuriⵧnormalized‿str(link)
				// XXX TODO better a with all props!!!
				return <a
					key={href + index /* XXX bad!!! */ }
					href={href}
				>{getꓽcta(link)}</a>
			})}

			<hr key='sep--bgtasks'/>
			<ᄆBackgroundTasks />

			<dialog open={!!fg_action} ref={refⵧdialog}>
				<p>Task in progress…</p>
				{/*<form method="dialog">
					<button>OK</button>
				</form>*/}
			</dialog>
		</section>
	)
}

/////////////////////////////////////////////////

function ᄆBackgroundTasks() {
	return (
		<div>
			[TODO background tasks]
		</div>
	)
}

/////////////////////////////////////////////////

export {
	type Props,
	ᄆComponent,
}
