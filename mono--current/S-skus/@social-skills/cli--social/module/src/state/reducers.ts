import type { Immutable } from '@monorepo-private/ts--types'

import {
	// base
	ensure_string,

	coerce_toꓽascii,
	RECOMMENDED_UNICODE_NORMALIZATION,
	normalize_unicode,

	to_lower_case,
	to_upper_case,

	trim,

	coerce_blanks_to_single_spaces,
	remove_all_spaces,
	coerce_delimiters_to_space,
	convert_spaces_to_camel_case,
	convert_spaces_to_kebab_case,

	// content
	normalizeꓽtextⵧsentence,

	// email
	normalizeꓽemailⵧsafe,
	normalizeꓽemailⵧreasonable,
	normalizeꓽemailⵧfull,

	// fs
	coerce_toꓽsafe_basenameⵧstrictest,
	normalizeꓽpath,

	// handle
	coerce_toꓽnicknameⵧsafe,

	// misc
	coerce_toꓽtokens,
	coerce_toꓽredeemable_code,
	normalizeꓽIETFLanguageType,

	// url
	normalizeꓽurl,
	normalizeꓽurlⵧhttpₓ,

	// arrays
	normalizeꓽarrayⵧof_strings,
} from '@monorepo-private/normalize-string'

import type { RelationshipType, Relationship, State } from './types.ts'
import type { PersonId, Person, Org, OrgId, LooseDateAnnotated, Nationality } from '../types.ts'
import assert from "tiny-invariant";

/////////////////////////////////////////////////

function create(): Immutable<State> {
	return {
		orgs: {},
		persons: {},
		relationships: [],
		dates: {},
	}
}

function ensureꓽorg(state: Immutable<State>, org_id: OrgId): Immutable<State> {
	if (state.orgs[org_id]) return state

	assert(org_id.startsWith('@'), 'org_id must start with @!')
	assert(org_id.length > 1, 'org_id must not be empty!')
	assert(remove_all_spaces(normalize_unicode(org_id.toLowerCase())) === org_id, 'org_id must be normalized!')

	assert(!Object.keys(state.persons).includes(org_id), `org_id ${org_id} is conflicting with a person!`)

	const org: Org = {
		id: org_id,
		notes: [],
	}

	return {
		...state,
		orgs: {
			...state.orgs,
			[org_id]: org,
		},
	}
}

function ensureꓽperson(state: Immutable<State>, person_id: PersonId): Immutable<State> {
	if (state.persons[person_id]) return state

	assert(person_id.startsWith('@'), 'person_id must start with @!')
	assert(person_id.length > 1, 'person_id must not be empty!')
	assert(remove_all_spaces(normalize_unicode(person_id.toLowerCase())) === person_id, 'person_id must be normalized!')

	const org_id: OrgId | undefined = person_id.includes('/')
		? person_id.split('/').at(0)
		: undefined
	if (org_id) {
		assert(person_id.length > org_id.length + 1, 'person_id must not be longer than org_id!')
		state = ensureꓽorg(state, org_id)
	}
	else {
		assert(!Object.keys(state.orgs).includes(person_id), `person_id ${person_id} is conflicting with an org!`)
	}

	const person: Person = {
		id: person_id,
		...(org_id && { org_id }),
		status: 'active', // so far
		known_nationalities: [],
		known_cultures: [],
		dates: {},
		notes: [],
	}

	return {
		...state,
		persons: {
			...state.persons,
			[person_id]: person,
		},
	}
}

function claimꓽperson__status(state: Immutable<State>, person_id: PersonId, status: Person['status']): Immutable<State> {
	assert(state.persons[person_id], `person_id ${person_id} should exist!`)

	if (state.persons[person_id].status === status) return state

	return {
		...state,
		persons: {
			...state.persons,
			[person_id]: {
				...state.persons[person_id],
				status,
			}
		},
	}
}

function claimꓽperson__gender(state: Immutable<State>, person_id: PersonId, gender: NonNullable<Person['gender']>): Immutable<State> {
	assert(state.persons[person_id], `person_id ${person_id} should exist!`)

	if (state.persons[person_id].gender === gender) return state

	return {
		...state,
		persons: {
			...state.persons,
			[person_id]: {
				...state.persons[person_id],
				gender,
			}
		},
	}
}

function claimꓽperson__date(state: Immutable<State>, person_id: PersonId, id: string, lda: LooseDateAnnotated): Immutable<State> {
	assert(state.persons[person_id], `person_id ${person_id} should exist!`)

	assert(!state.persons[person_id].dates[id], `person_id ${person_id} should not already have a date with id ${id}!`)

	return {
		...state,
		persons: {
			...state.persons,
			[person_id]: {
				...state.persons[person_id],
				dates: {
					...state.persons[person_id].dates,
					[id]: lda,
				}
			}
		},
	}
}

function claimꓽperson__nationality(state: Immutable<State>, person_id: PersonId, n: Nationality): Immutable<State> {
	assert(state.persons[person_id], `person_id ${person_id} should exist!`)

	if (state.persons[person_id].known_nationalities.includes(n)) return state

	const known_nationalities: Person['known_nationalities'] = [
		...state.persons[person_id].known_nationalities,
		n
	].sort()

	return {
		...state,
		persons: {
			...state.persons,
			[person_id]: {
				...state.persons[person_id],
				known_nationalities,
			}
		},
	}
}

function claimꓽperson__note(state: Immutable<State>, person_id: PersonId, note: string): Immutable<State> {
	assert(state.persons[person_id], `claimꓽperson__note(): person_id ${person_id} should exist!`)

	const notes = [
		...state.persons[person_id].notes,
		note,
	].sort()

	return {
		...state,
		persons: {
			...state.persons,
			[person_id]: {
				...state.persons[person_id],
				notes,
			}
		},
	}
}
function claimꓽorg__note(state: Immutable<State>, org_id: OrgId, note: string): Immutable<State> {
	assert(state.orgs[org_id], `org_id ${org_id} should exist!`)

	const notes = [
		...state.orgs[org_id].notes,
		note,
	].sort()

	return {
		...state,
		orgs: {
			...state.orgs,
			[org_id]: {
				...state.orgs[org_id],
				notes,
			}
		},
	}
}
function claimꓽperson_or_org__note(state: Immutable<State>, person_or_org_id: PersonId | OrgId, note: string): Immutable<State> {
	if (Object.keys(state.orgs).includes(person_or_org_id))
		return claimꓽorg__note(state, person_or_org_id, note)

	return claimꓽperson__note(state, person_or_org_id, note)
}

function claimꓽperson__name(state: Immutable<State>, person_id: PersonId, name: string): Immutable<State> {
	assert(state.persons[person_id], `claimꓽperson__name(): person_id ${person_id} should exist!`)

	if (state.persons[person_id].name === name) return state

	assert(!state.persons[person_id].name, `person "${person_id}" name conflict!`)

	return {
		...state,
		persons: {
			...state.persons,
			[person_id]: {
				...state.persons[person_id],
				name,
			}
		},
	}
}
function claimꓽorg__name(state: Immutable<State>, org_id: OrgId, name: string): Immutable<State> {
	assert(state.orgs[org_id], `claimꓽorg__name(): org_id ${org_id} should exist!`)

	if (state.orgs[org_id].name === name) return state

	assert(!state.orgs[org_id].name, `org "${org_id}" name conflict!`)

	return {
		...state,
		orgs: {
			...state.orgs,
			[org_id]: {
				...state.orgs[org_id],
				name,
			}
		},
	}
}
function claimꓽperson_or_org__name(state: Immutable<State>, person_or_org_id: PersonId | OrgId, name: string): Immutable<State> {
	if (Object.keys(state.orgs).includes(person_or_org_id))
		return claimꓽorg__name(state, person_or_org_id, name)

	return claimꓽperson__name(state, person_or_org_id, name)
}

function claimꓽrelationship(state: Immutable<State>, type: RelationshipType, a: PersonId, b: PersonId): Immutable<State> {
	state = ensureꓽperson(state, a)
	state = ensureꓽperson(state, b)

	let person_a = state.persons[a]!
	let person_b = state.persons[b]!


	// normalization
	// ungendered to gendered
	switch (type) {
		case 'spouse_of': // bc emoji
			if (person_a.gender === 'male') {
				type = 'husband_of'
			}
			else if (person_a.gender === 'female') {
				type = 'wife_of'
			}
			else if (person_b.gender === 'male') {
				type = 'wife_of'
			}
			else if (person_b.gender === 'female') {
				type = 'husband_of'
			}
			else {
				[a, b] = [a, b].sort()!
			}
			break
		default:
			break
	}

	// order
	switch (type) {
		case 'spouse_of':
		case 'partner_of'

			break

			, // normalized a < b
				'husband_of',
				'wife_of',
		] as const
// closest only if @me AND initiator
			const RELATIONSHIP_TYPES__CLOSEST = [
			...RELATIONSHIP_TYPES__PARTNER,
			'father_of',
			'mother_of',
			'parent_of', // normalized = -- target
		] as const
			const RELATIONSHIP_TYPES__CLOSE = [
				...RELATIONSHIP_TYPES__CLOSEST,
				'twin_sister_of',
				'twin_brother_of',

				'child_of', // normalized = -- target or else parent_of/mother_of/father_of
				'son_of',
				'daughter_of',
				'sibling_of', // normalized a < b
				'sister_of',
				'brother_of',

				'godfather_of',
				'godmother_of',
				'godparent_of',
				'goddaughter_of',
				'godson_of',
				'godchild_of',
			] as const
			const RELATIONSHIP_TYPES = [
				...RELATIONSHIP_TYPES__CLOSE,
				'coworker_of', // normalized a < b
				'neighbor_of',
				'teacher_of',
				'student_of',

				'other', // normalized a < b

		default:
			throw new Error(`Unknown relationship type for nomalization! "${type}`)
	}

	if (state.relationships.find(r => r.type === type && r.a === a && r.b === b)) return state

	const relationship: Relationship = {
		type,
		a,
		b,
	}

	return {
		...state,
		relationships: [
			...state.relationships,
			relationship,
		],
	}
}


function addꓽdateⵧfree(state: Immutable<State>, group: string, lda: LooseDateAnnotated): Immutable<State> {
	return {
		...state,
		dates: {
			...state.dates,
			[group]: [
				...(state.dates[group] || []),
				lda,
			],
		},
	}
}

/////////////////////////////////////////////////

export {
	create,

	ensureꓽorg,
	ensureꓽperson,

	claimꓽperson_or_org__name,
	claimꓽperson__nationality,
	claimꓽperson_or_org__note,

	claimꓽperson__status,
	claimꓽperson__gender,
	claimꓽperson__date,
	claimꓽperson__note,
	claimꓽrelationship,

	addꓽdateⵧfree,
}
