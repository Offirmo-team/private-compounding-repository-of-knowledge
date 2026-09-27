import type { LooseDateAnnotated, Org, OrgId, Person, PersonId } from "../types.ts"

/////////////////////////////////////////////////

// careful of duplicates!
// TODO deprecations? ex. ex-partner_of
const RELATIONSHIP_TYPES__PARTNER = [
	"spouse_of", // normalized a < b
	"partner_of", // normalized a < b
	"husband_of",
	"wife_of",
] as const
// closest only if @me AND initiator
const RELATIONSHIP_TYPES__CLOSEST = [
	...RELATIONSHIP_TYPES__PARTNER,
	"father_of",
	"mother_of",
	//'parent_of', // normalized = -- target
] as const
const RELATIONSHIP_TYPES__CLOSE = [
	...RELATIONSHIP_TYPES__CLOSEST,
	"twin_sister_of",
	"twin_brother_of",

	//'child_of', // normalized = -- target or else parent_of/mother_of/father_of
	"son_of",
	"daughter_of",
	//'sibling_of', // normalized a < b
	"sister_of",
	"brother_of",

	"godfather_of",
	"godmother_of",
	//'godparent_of',
	"goddaughter_of",
	"godson_of",
	//'godchild_of',
] as const
const RELATIONSHIP_TYPES = [
	...RELATIONSHIP_TYPES__CLOSE,
	"coworker_of", // normalized a < b
	"neighbor_of",
	"teacher_of",
	"student_of",

	"other", // normalized a < b
] as const
type RelationshipType = (typeof RELATIONSHIP_TYPES)[number]
function isꓽRelationshipType(r: string): r is RelationshipType {
	return RELATIONSHIP_TYPES.includes(r)
}

interface Relationship {
	a: PersonId
	b: PersonId
	type: RelationshipType
	date?: LooseDateAnnotated
}

interface State {
	orgs: Record<OrgId, Org>

	persons: Record<PersonId, Person>

	relationships: Array<Relationship>

	dates: {
		[group: string]: LooseDateAnnotated[]
	}
}

/////////////////////////////////////////////////

export {
	RELATIONSHIP_TYPES__PARTNER,
	RELATIONSHIP_TYPES__CLOSEST,
	RELATIONSHIP_TYPES__CLOSE,
	RELATIONSHIP_TYPES,
	type RelationshipType,
	isꓽRelationshipType,
	type Relationship,
	type State,
}
