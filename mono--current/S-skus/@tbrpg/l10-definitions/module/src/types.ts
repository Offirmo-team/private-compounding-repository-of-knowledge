import { Enum } from "typescript-string-enums"

import { type NodeLike } from "@monorepo-private/rich-text-format"
import { type WithUUID } from "@monorepo-private/uuid"

/////////////////////////////////////////////////

/** The hypermedia type we use all over the app */
type HypermediaContentType = NodeLike
// TODO hints for progressive enhancement

/////////////////////

// An element is everything which can be interacted with and/or has a rich tooltip
// ex. item, place, achievement, title...
// TODO Review with HATEOAS in mind

const ElementType = Enum(
	"item",
	"achievement_snapshot",
	// TODO expand
	//'location',
	//'lore',
)
type ElementType = Enum<typeof ElementType> // eslint-disable-line no-redeclare

interface Element extends WithUUID {
	element_type: ElementType
	// TODO add schema version ?
}

/////////////////////

const ItemQuality = Enum("common", "uncommon", "rare", "epic", "legendary", "artifact")
type ItemQuality = Enum<typeof ItemQuality> // eslint-disable-line no-redeclare

const InventorySlot = Enum(
	"weapon",
	"armor",
	"none", // = non slottable
)
type InventorySlot = Enum<typeof InventorySlot> // eslint-disable-line no-redeclare

///////

interface Item extends Element {
	slot: InventorySlot
	quality: ItemQuality
	// TODO generation date ?
	// TODO made by ?
}

/////////////////////////////////////////////////

export { type HypermediaContentType, ElementType, type Element, ItemQuality, InventorySlot, type Item }
