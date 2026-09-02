import { InventorySlot, type Item, ITEM_SLOTS, ITEM_SLOTS_TO_INT } from "@tbrpg/definitions"
import { appraise_power } from "@tbrpg/logic--shop"
import { type State as InventoryState, iterables_unslotted, getꓽitem_in_slot } from "@tbrpg/state--inventory"
import { type State as WalletState } from "@tbrpg/state--wallet"

import * as RichText from "@monorepo-private/rich-text-format"
import type { Immutable } from "@monorepo-private/ts--types"

import { DEFAULT_RENDER_ITEM_OPTIONS } from "./consts.ts"
import { render_item_short } from "./items.ts"
import type { RenderItemOptions } from "./types.ts"
import { render_wallet } from "./wallet.ts"

/////////////////////////////////////////////////

// we want the slots sorted by types according to an arbitrary order
function renderꓽequipment(
	inventory: Immutable<InventoryState>,
	options?: Immutable<RenderItemOptions>,
): RichText.Document {
	const $doc_list = RichText.listⵧunordered().addClass("inventory--equipment").$node

	ITEM_SLOTS.forEach((slot: InventorySlot) => {
		const item = getꓽitem_in_slot(inventory, slot)

		const $doc_item = item ? render_item_short(item, options) : RichText.fragmentⵧinline().pushText("-").done()

		//const $doc_line = RichText.key_value(slot, $doc_item).done()
		const $doc_line = RichText.fragmentⵧinline()
			.pushText(slot)
			.pushText(": ")
			.pushSubNode($doc_item, { id: "item" })
			.done()

		$doc_list.$refs[`000${ITEM_SLOTS_TO_INT[slot]}`.slice(-3)] = $doc_line
	})

	const $doc = RichText.fragmentⵧblock()
		.setHeading(RichText.fragmentⵧinline().pushText("Active equipment:").done())
		.pushSubNode($doc_list, { id: "list" })
		.done()

	return $doc
}

// we want the slots sorted by types according to an arbitrary order
// = nothing to do, the inventory is auto-sorted
function renderꓽbackpack(
	inventory: Immutable<InventoryState>,
	options?: Immutable<RenderItemOptions>,
): RichText.Document {
	const builder = RichText.listⵧordered().addClass("inventory--backpack")

	const misc_items: Item[] = Array.from(iterables_unslotted(inventory)).filter((i) => !!i) as Item[]
	const item_count = misc_items.length

	const reference_powers: any = {}

	misc_items.forEach((i: Item) => {
		if (!reference_powers[i.slot]) {
			const item = getꓽitem_in_slot(inventory, i.slot)
			reference_powers[i.slot] = item ? appraise_power(item) : 0
		}

		builder.addSub(
			render_item_short(i, {
				...options,
				reference_power: reference_powers[i.slot],
			}),
		)
	})

	const $doc_list = builder.$node

	if (Object.keys($doc_list.$refs).length === 0) {
		// completely empty
		$doc_list.$type = RichText.NodeType.ul
		$doc_list.$refs["-"] = RichText.fragmentⵧinline().pushText("(empty)").done()
	}

	const $doc = RichText.fragmentⵧblock()
		.setHeading(
			RichText.fragmentⵧinline().pushText(`Backpack: (${item_count}/${inventory.unslotted_capacity})`).done(),
		)
		.pushSubNode($doc_list, { id: "list" })
		.done()

	return $doc
}

function renderꓽfull_inventory(
	inventory: Immutable<InventoryState>,
	wallet: Immutable<WalletState>,
	options: Immutable<RenderItemOptions> = DEFAULT_RENDER_ITEM_OPTIONS,
): RichText.Document {
	const $doc = RichText.fragmentⵧblock()
		.pushSubNode(renderꓽequipment(inventory, options), { id: "equipped" })
		.pushSubNode(render_wallet(wallet), { id: "wallet" })
		.pushSubNode(renderꓽbackpack(inventory, options), { id: "backpack" })
		.done()

	//console.log(JSON.stringify($doc, null, 2))
	return $doc
}

/////////////////////////////////////////////////

export { renderꓽbackpack, renderꓽequipment, renderꓽfull_inventory }
