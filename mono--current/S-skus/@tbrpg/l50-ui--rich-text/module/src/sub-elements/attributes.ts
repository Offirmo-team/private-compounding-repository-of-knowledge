import { type State as CharacterState, CharacterAttribute, CHARACTER_ATTRIBUTES_SORTED } from "@tbrpg/state--character"

import * as RichText from "@monorepo-private/rich-text-format"
import type { Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

function renderꓽavatar(state: Immutable<CharacterState>): RichText.Document {
	const $doc_name = RichText.fragmentⵧinline().addClass("avatar__name").pushText(state.name).done()
	const $doc_class = RichText.fragmentⵧinline().addClass("avatar__class").pushText(state.klass).done()

	const $doc = RichText.fragmentⵧblock()
		.setHeading("Identity:")
		.pushSubNode(RichText.listⵧunordered().pushKeyValue("name", $doc_name).pushKeyValue("class", $doc_class).done())
		.done()

	return $doc
}

function renderꓽattributes(state: Immutable<CharacterState>): RichText.Document {
	const $doc_list = RichText.listⵧunordered().addClass("attributes").$node

	CHARACTER_ATTRIBUTES_SORTED.forEach((stat: CharacterAttribute, index: number) => {
		const label = stat
		const value = state.attributes[stat]

		const $doc_attr = RichText.keyꓺvalue(label, `${value}`).done()

		$doc_list.$refs[`000${index}`.slice(-3)] = $doc_attr
	})

	const $doc = RichText.fragmentⵧblock()
		.setHeading(RichText.fragmentⵧinline().pushText("Attributes:").done())
		.pushSubNode($doc_list, { id: "list" })
		.done()

	return $doc
}

function renderꓽcharacter_sheet(state: Immutable<CharacterState>): RichText.Document {
	const $doc = RichText.fragmentⵧblock()
		.pushSubNode(renderꓽavatar(state), { id: "avatar" })
		.pushSubNode(renderꓽattributes(state), { id: "attributes" })
		.done()

	return $doc
}

/////////////////////////////////////////////////

export { renderꓽavatar, renderꓽattributes, renderꓽcharacter_sheet }
