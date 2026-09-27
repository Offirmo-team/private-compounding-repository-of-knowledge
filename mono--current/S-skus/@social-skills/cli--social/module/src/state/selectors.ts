import { Temporal } from "temporal-polyfill"

import assert from "@monorepo-private/assert/v1"
import {
	capitalizeⵧfirst,
	capitalizeⵧwordsⵧadvanced,
	remove_all_spaces,
	coerce_underscores_to_space,
	coerce_delimiters_to_space,
} from "@monorepo-private/normalize-string"
import type { Immutable } from "@monorepo-private/ts--types"

import * as LooseDateLib from "../to-own/loose-dates/index.ts"
import type { OrgId, PersonId } from "../types.ts"

import {
	RELATIONSHIP_TYPES__PARTNER,
	RELATIONSHIP_TYPES__CLOSEST,
	RELATIONSHIP_TYPES__CLOSE,
	type State,
} from "./types.ts"

/////////////////////////////////////////////////

const formatter_duration_narrow = new Intl.DurationFormat("en-us", { style: "narrow" })

/////////////////////////////////////////////////
// person

function getꓽname(state: Immutable<State>, id: PersonId | OrgId): string {
	const org = state.orgs[id]
	if (org) {
		return org.name || capitalizeⵧfirst(org.id.slice(1))
	}

	const person = state.persons[id]
	assert(!!person, `get_name: no person with id ${id}!`)
	if (person.name) return person.name

	if (!person.id.includes("/")) return capitalizeⵧwordsⵧadvanced(coerce_underscores_to_space(person.id.slice(1)))

	const [org_id, alias] = person.id.split("/")
	return capitalizeⵧfirst(org_id!.slice(1)) + "/" + capitalizeⵧwordsⵧadvanced(coerce_underscores_to_space(alias!))
}

function getꓽone_linerⵧperson(state: Immutable<State>, id: PersonId): string {
	const person = state.persons[id]
	assert(person, `get_one_liner: no person with id ${id}!`)

	const age = (() => {
		const birth_day‿lda = person.dates["🎂"]
		if (!birth_day‿lda) return undefined

		if (!birth_day‿lda.YYYY) return undefined // no way to know

		const birth_day‿temporal = Temporal.PlainDate.from(LooseDateLib.getꓽPlainDateIso(birth_day‿lda))
		const now = Temporal.Now.plainDateISO()
		const duration_y = now.since(birth_day‿temporal, {
			largestUnit: "years",
			smallestUnit: "years",
		})
		const duration_ym = now.since(birth_day‿temporal, {
			largestUnit: "years",
			smallestUnit: "months",
		})

		let result = birth_day‿lda.MM
			? remove_all_spaces(formatter_duration_narrow.format(duration_ym))
			: formatter_duration_narrow.format(duration_y) + "o"

		return result
	})()

	return [
		//id : no need, the caller has it, can add if needed
		getꓽname(state, person.id),
		age,
		...person.known_nationalities,
	]
		.filter((s) => !!s)
		.join(" ")
}

/////////////////////////////////////////////////
// personS

function getꓽall(state: Immutable<State>, { status = "active" } = {}): Set<PersonId> {
	const ids = Object.keys(state.persons)
	const matching_status = ids.filter((id) => state.persons[id]!.status === status)
	return new Set<PersonId>(matching_status)
}

// TODO fix with tree
function getꓽfamily(state: Immutable<State>, { status = "active" } = {}): Set<PersonId> {
	const person_ids = getꓽall(state, { status }).values()

	// heuristic: no org = family
	const candidates = Array.from(person_ids).filter((id) => !id.includes("/"))

	return new Set<PersonId>(candidates)
}

function getꓽfamilyⵧclosest(state: Immutable<State>, { status = "active" } = {}): Set<PersonId> {
	const all = new Set<PersonId>()

	state.relationships.forEach((r) => {
		if (r.a !== "@me")
			// special
			return

		if (!RELATIONSHIP_TYPES__CLOSEST.includes(r.type)) return

		all.add(r.a === "@me" ? r.b : r.a)
	})

	// TODO filter alive
	return all
}

function getꓽfamilyⵧclose(state: Immutable<State>, { status = "active" } = {}): Set<PersonId> {
	const all = new Set<PersonId>()

	state.relationships.forEach((r) => {
		if (r.a !== "@me" && r.b !== "@me") return

		if (!RELATIONSHIP_TYPES__CLOSE.includes(r.type)) return

		all.add(r.a === "@me" ? r.b : r.a)
	})

	// TODO filter alive
	return all
}

function getꓽpartner(state: Immutable<State>): PersonId | undefined {
	const me_partnership = state.relationships.find((r) => {
		if (!RELATIONSHIP_TYPES__PARTNER.includes(r.type)) return false
		if (r.a !== "@me" && r.b !== "@me") return false
		// TODO filter alive

		return true
	})
	if (!me_partnership) return undefined

	const partner_id = me_partnership.a === "@me" ? me_partnership.b : me_partnership.a

	return partner_id
}

/////////////////////////////////////////////////

export { getꓽone_linerⵧperson, getꓽall, getꓽfamily, getꓽfamilyⵧclose, getꓽfamilyⵧclosest, getꓽpartner }
