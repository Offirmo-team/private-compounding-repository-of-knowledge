import * as Meta from "@oh-my-rpg/state--meta"
import { VERSION, BUILD_DATE } from "@tbrpg/state"

import * as RichText from "@monorepo-private/rich-text-format"
import type { Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

const APP_NAME = "⚔️🛡  The Boring RPG, reborn! 👆🎲"
const APP_PITCH = "The simplest fantasy RPG ever!"

function renderꓽgame_header(extra: Immutable<{ [k: string]: string | number | undefined }> = {}): RichText.Document {
	return RichText.fragmentⵧblock().setHeading(APP_NAME).pushStrong(APP_PITCH).done()
}

function renderꓽgame_info(extra: Immutable<{ [k: string]: string | number | undefined }> = {}): RichText.Document {
	const meta_infos = {
		"game version": VERSION,
		"last update date": BUILD_DATE,
		...extra,
	}

	const $doc = RichText.fragmentⵧblock()
		.setHeading(APP_NAME)
		.pushStrong(APP_PITCH)
		.pushSubNode(_renderꓽmeta_infos(meta_infos), { id: "list" })
		.done()

	return $doc
}

/////////////////////////////////////////////////

export { renderꓽgame_header, renderꓽgame_info }

/////////////////////////////////////////////////

function _renderꓽmeta_infos(metas: Immutable<{ [k: string]: string | number | undefined }>): RichText.Document {
	const $doc_list = RichText.listⵧunordered()

	Object.keys(metas).forEach((key: string) => {
		$doc_list.addSub(
			RichText.fragmentⵧinline()
				.pushText(key + ": " + metas[key])
				.done(),
			{ id: key },
		)
	})

	return $doc_list.done()
}

/*
function render_account_info(state: Immutable<Meta.State>, extra: Immutable<{[k: string]: string | number | undefined}> = {}): RichText.Document {
	const meta_infos = extra

	/* TODO rework
	meta_infos['internal user id'] = m.uuid
	meta_infos['telemetry allowed'] = String(m.allow_telemetry)
	if (m.email) meta_infos['email'] = m.email

	const $doc = RichText.fragmentⵧblock()
		.setHeading('Account infos:')
		.pushSubNode(
			_renderꓽmeta_infos(meta_infos),
			{id: 'list'},
		)
		.done()

	return $doc
}*/
