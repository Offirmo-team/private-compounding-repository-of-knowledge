import stylize_string from "chalk"

import { DEFAULT_RENDERING_OPTIONSⵧToText, renderⵧto_text } from "@monorepo-private/rich-text-format"

/////////////////////////////////////////////////

const LIB = "@monorepo-private/rich-text-format--to-terminal"

const DEFAULT_RENDERING_OPTIONSⵧToAnsi = Object.freeze({
	...DEFAULT_RENDERING_OPTIONSⵧToText,
})

/////////////////////////////////////////////////

// TODO handle boxification ? (needed?)
// TODO single warning on unknown classes

// TODO use unicode database
const WIDTH_COMPENSATION = " "

////////////

// TODO handle clickable links https://github.com/sindresorhus/terminal-link
// TODO handle pictures https://github.com/sindresorhus/terminal-image

function on_type({ $type, $parent_node, state, $node, depth }, options) {
	//console.log(`${LIB} on_type()`)
	switch ($type) {
		case "heading":
		/* fallthrough */
		case "strong":
			state.str = stylize_string.bold(state.str)
			break
		case "weak":
			state.str = stylize_string.dim(state.str)
			break
		case "em":
			state.str = stylize_string.italic(state.str)
			break
		default:
			break
	}

	return state
}

// TODO remove and put somewhere else? (extensible)
function on_classⵧafter({ $class, state, $node, depth }, options) {
	//console.log(`${LIB} on_classⵧafter()`)
	const { $hints } = $node
	switch ($class) {
		case "item__name":
		case "avatar__name":
		case "avatar__class":
		case "monster__name":
			state.str = stylize_string.bold(state.str)
			break

		case "item--quality--common":
			//state.str = stylize_string.gray(str)
			// no color cause we can't know if the user has a dark or light background = keep default
			break
		case "item--quality--uncommon":
			state.str = stylize_string.green(state.str)
			break
		case "item--quality--rare":
			state.str = stylize_string.blue(state.str)
			break
		case "item--quality--epic":
			state.str = stylize_string.magenta(state.str)
			break
		case "item--quality--legendary":
			state.str = stylize_string.red(state.str)
			break
		case "item--quality--artifact":
			state.str = stylize_string.yellow(state.str)
			break

		case "item--armor":
			state.str = "🛡 " + WIDTH_COMPENSATION + state.str
			break
		case "item--weapon":
			state.str = "⚔ " + WIDTH_COMPENSATION + state.str
			break

		case "achievement":
			break
		case "achievement__lore":
			state.str = stylize_string.italic(state.str)
			break

		case "currency--coin":
		case "value--coin":
			state.str = "💰 " + WIDTH_COMPENSATION + state.str
			break
		case "currency--token":
		case "value--token":
			state.str = "💠 " + WIDTH_COMPENSATION + state.str
			break

		case "attribute--level":
			state.str = "👶 " + WIDTH_COMPENSATION + state.str
			break
		case "attribute--health":
			state.str = "💗 " + WIDTH_COMPENSATION + state.str
			break
		case "attribute--mana":
			state.str = "💙 " + WIDTH_COMPENSATION + state.str
			break
		case "attribute--agility":
			state.str = "🤸 " + WIDTH_COMPENSATION + state.str
			break
		case "attribute--luck":
			state.str = "🤹 " + WIDTH_COMPENSATION + state.str
			break
		case "attribute--strength":
			state.str = "🏋 " + WIDTH_COMPENSATION + state.str
			break
		case "attribute--charisma":
			state.str = "👨‍🎤 " + WIDTH_COMPENSATION + state.str
			break
		case "attribute--wisdom":
			state.str = "👵 " + WIDTH_COMPENSATION + state.str
			break

		case "monster":
			state.str = state.str + " " + $hints.possible_emoji + WIDTH_COMPENSATION
			break
		case "monster--rank--common":
			break
		case "monster--rank--elite":
			state.str = stylize_string.yellow(state.str)
			break
		case "monster--rank--boss":
			state.str = stylize_string.red(state.str)
			break
		case "rank--common":
			break
		case "rank--elite":
			state.str = stylize_string.bold(state.str + "★")
			break
		case "rank--boss":
			state.str = stylize_string.bold(state.str + " 👑" + WIDTH_COMPENSATION)
			break

		case "place":
			state.str = stylize_string.green(state.str + " 🏜" + WIDTH_COMPENSATION)
			break

		case "person":
			state.str = stylize_string.blue(state.str)
			break

		case "comparison--better":
			state.str = stylize_string.green.bold(state.str)
			break
		case "comparison--worse":
			state.str = stylize_string.red.dim(state.str)
			break
		case "comparison--equal":
			// no style
			break

		case "npc":
		case "place--name":
		case "item":
		case "item--name":
		//case 'item--weapon--name':
		case "item--enhancement":
		case "item--values":
		case "item--power":
		case "attributes":
		case "inventory--equipment":
		case "inventory--wallet":
		case "inventory--backpack":
		case "":
			// no style
			break

		default:
			console.warn(`${LIB}: unknown class "${$class}", ignored.`) // todo avoid repetition
			break
	}

	return state
}

const callbacksⵧto_terminal = {
	on_type,
	on_classⵧafter,
}

function renderⵧto_terminal(doc, callback_overrides = {}) {
	//console.log(`${LIB} Rendering:`, doc)
	return renderⵧto_text(
		doc,
		{
			style: "advanced",
		},
		{
			...callbacksⵧto_terminal,
			...callback_overrides,
		},
	)
}

/////////////////////////////////////////////////

export default renderⵧto_terminal

export { renderⵧto_terminal, callbacksⵧto_terminal }
