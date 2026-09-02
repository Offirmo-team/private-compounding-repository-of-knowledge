import type { Immutable } from "@monorepo-private/ts--types"
import { type UnicodeCharDetails, UNICODE_CHARS } from "@monorepo-private/unicode-data"

interface RawMonsterEntry {
	name: string
	emoji: string
}

const EMOJI_ENTRIES: Readonly<RawMonsterEntry>[] = Object.keys(UNICODE_CHARS)
	.map((key: keyof typeof UNICODE_CHARS) => UNICODE_CHARS[key]!)
	.filter((charDetails) => charDetails!.taxonomy.includes("monster"))
	.map((charDetails: Immutable<UnicodeCharDetails>) => ({
		name: charDetails.properties.description,
		emoji: charDetails.char,
	}))

const EXTRA_ENTRIES: Readonly<RawMonsterEntry>[] = [
	{
		name: "drop bear",
		emoji: "🐨",
	},
	{
		name: "dahu",
		emoji: "🐐",
	},
	// https://en.wikipedia.org/wiki/Fearsome_critters
	{
		name: "hoop snake",
		emoji: "🐍",
	},
	{
		name: "joint snake",
		emoji: "🐍",
	},
	{
		name: "spreading adder",
		emoji: "🐍",
	},
	{
		name: "fur-bearing truit",
		emoji: "🐡",
	},
	{
		name: "splintercat",
		emoji: "🐡",
	},
]

const ENTRIES: Readonly<RawMonsterEntry>[] = ([] as RawMonsterEntry[]).concat(...EMOJI_ENTRIES, ...EXTRA_ENTRIES)

export { type RawMonsterEntry, ENTRIES }
