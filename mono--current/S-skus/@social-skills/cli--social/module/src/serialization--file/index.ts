import assert from "@monorepo-private/assert/v1"
import {
	normalize_unicode,
	coerce_blanks_to_single_spaces,
	normalizeꓽtextⵧsentence,
	normalizeꓽemailⵧsafe,
	normalizeꓽemailⵧreasonable,
	normalizeꓽemailⵧfull,
	normalizeꓽIETFLanguageType,
	normalizeꓽurl,
	normalizeꓽurlⵧhttpₓ,
} from "@monorepo-private/normalize-string"
import type { Immutable } from "@monorepo-private/ts--types"
import { hasꓽemoji } from "@monorepo-private/type-detection"

import * as Reducers from "../state/reducers.ts"
import { type Relationship, RELATIONSHIP_TYPES, isꓽRelationshipType, type State } from "../state/types.ts"
import * as LooseDateLib from "../to-own/loose-dates/index.ts"
import type { LooseDateAnnotated, EmojiRegionFlag, Nationality, OrgId, Org, PersonId, Person } from "../types.ts"

/////////////////////////////////////////////////

const LINE_SEP = "\n"

const MARKER_EMOJI_DATE = "📅" as const
const MARKER_EMOJI_PARTNER = "💞" as const
const MARKER_EMOJI_ANNIVERSARY_BIRTH = "🎂" as const
const MARKER_EMOJI_ANNIVERSARY_WEDDING = "💒" as const
const MARKER_EMOJI_PATRON_DAY = "📛" as const

const BASES = {
	baby: "👶",

	childⵧboy: "👦",
	childⵧgirl: "👧", // U+1F467
	childⵧunknown: "🧒",

	adultⵧman: "👱",
	adultⵧmanⵧbearded: "🧔",
	adultⵧunknown: "🧑",
	adultⵧwoman: "👩",

	elderⵧman: "👴",
	elderⵧunknown: "🧓",
	elderⵧwoman: "👵",

	//person_with_blond_hair: '👱', // U+1F471
}
function starts_with_base_face(s: string): boolean {
	return Object.values(BASES).some((base) => s.startsWith(base))
}

function is_emoji_flag_region(s: string): boolean {
	// TODO improve
	return s === "🇨🇵" || s === "🇦🇺"
}

/////////////////////////////////////////////////

interface InputFileLine {
	lineno: number
	lineⵧraw: string
	line: string
}

function parseꓽclaimⵧdate(claim: string): [string, LooseDateAnnotated] {
	// 📅🎂1981/07/12
	// 📅1942/08/09=patron_saint

	if (claim.startsWith(MARKER_EMOJI_DATE)) {
		claim = claim.slice(MARKER_EMOJI_DATE.length)
	}

	let date_raw = ""
	let id = ""
	let status = "emoji" as "emoji" | "date" | "rest"
	claim.split("").forEach((c) => {
		switch (status) {
			case "emoji":
				if (LooseDateLib.isꓽpart(c)) {
					status = "date"
					date_raw += c
					return
				}

				id += c
				return
			case "date":
				if (!LooseDateLib.isꓽpart(c)) {
					status = "rest"
					if (c === "=") {
						// not informative
						return
					}
					id += c
					return
				}
				date_raw += c
				return
			case "rest":
				id += c
				return
			default:
				throw new Error(`Unknown status!`)
		}
	})

	const lda: LooseDateAnnotated = {
		...LooseDateLib.createⵧfrom_str(date_raw),
		description: id, // may be enriched later
	}

	return [id, lda]
}

function normalizeꓽid(raw: string): PersonId | OrgId {
	assert(raw.startsWith("@"), `id should start with @!`)
	assert(raw.length > 1, `id should not be empty!`)
	return normalize_unicode(raw).toLowerCase()
}

function deserialize(text: string): Immutable<State> {
	let state = Reducers.create()

	//////////// split + clean lines
	const lines: InputFileLine[] = text
		.split(LINE_SEP)
		.map((lineⵧraw, lineno): InputFileLine => {
			return {
				lineno,
				lineⵧraw,
				line: coerce_blanks_to_single_spaces(normalize_unicode(lineⵧraw)).trim(),
			}
		})
		.filter((ifl) => !!ifl.line)
		.filter((ifl) => !ifl.line.startsWith("#"))
	//console.log(`Raw non-comment input lines:\n` + lines.map(ifl => `${String(ifl.lineno).padStart(3, ' ')} "${ifl.line}"`).join(`\n`))

	function _on_error(err: any, ifl: InputFileLine): void {
		console.error(`\nXXXXXXXXXX`)
		console.error(`Error line #${ifl.lineno} "${ifl.line}"`)
		console.error(`${err?.message}`)
		console.error(`XXXXXXXXXX\n`)
		console.error(err)
		throw err
	}

	//////////// pass: extract organizations
	// to not confuse them with persons later
	const orgs = new Set<OrgId>()
	lines.forEach((ifl) => {
		const { line } = ifl
		try {
			if (!line.startsWith("@")) {
				// this line is not about a person and/or an org
				return
			}

			const segments = line.split(" ")

			const person_or_org_id: PersonId | OrgId = segments.shift()!.toLowerCase()
			if (!person_or_org_id.includes("/")) {
				// this line doesn't clearly reference an org
				return
			}
			const [org_id] = person_or_org_id.split("/")
			assert(!!org_id, `org_id should not be empty!`)

			orgs.add(org_id)
			state = Reducers.ensureꓽorg(state, org_id)
		} catch (err) {
			_on_error(err, ifl)
		}
	})
	console.log(`Found orgs: `, Array.from(orgs).sort())
	function isꓽOrgId(s: PersonId | OrgId): s is OrgId {
		return orgs.has(s)
	}

	//////////// pass ??
	lines.forEach((ifl) => {
		let { line } = ifl
		try {
			let lda: LooseDateAnnotated | undefined = undefined
			let lda_count = 0
			let claims_count = 0
			const non_claims_segments: string[] = []

			const segments = line.split(" ")

			if (line.startsWith("@")) {
				// claim about an org and/or person
				const person_or_orgid: PersonId | OrgId = segments.shift()!.toLowerCase()

				state = isꓽOrgId(person_or_orgid)
					? Reducers.ensureꓽorg(state, person_or_orgid)
					: Reducers.ensureꓽperson(state, person_or_orgid)

				while (segments.length) {
					line = segments.join(" ")
					if (line.startsWith("=")) {
						// special "name" claim
						const name = line.slice(1).trim()
						state = Reducers.claimꓽperson_or_org__name(state, person_or_orgid, name)
						segments.length = 0
					} else {
						const claim = segments.shift()!
						claims_count++ // optimistic
						switch (true) {
							case claim === "🪦":
								state = Reducers.claimꓽperson__status(state, person_or_orgid, "dead")
								break

							case claim.startsWith(MARKER_EMOJI_DATE): {
								lda_count++
								const [id, _lda] = parseꓽclaimⵧdate(claim)
								state = Reducers.claimꓽperson__date(state, person_or_orgid, id, _lda)
								lda = _lda
								break
							}

							case !isꓽOrgId(person_or_orgid) && claim.startsWith(MARKER_EMOJI_PARTNER): {
								const target = normalizeꓽid(claim.slice(MARKER_EMOJI_PARTNER.length))
								state = Reducers.ensureꓽperson(state, target)
								const [a, b] = [person_or_orgid, target].sort()
								state = Reducers.claimꓽrelationship(state, "partner_of", a!, b!)
								break
							}

							case !isꓽOrgId(person_or_orgid) && is_emoji_flag_region(claim): {
								assert(!isꓽOrgId(person_or_orgid))
								state = Reducers.claimꓽperson__nationality(state, person_or_orgid, claim)
								break
							}

							case !isꓽOrgId(person_or_orgid) && claim.includes("_of:"): {
								let [rel_type, target, ...rest] = claim.split(":")
								assert(!!target, `relationship claim: target should not be empty!`)
								assert(rest.length === 0, `relationship claim: rest should be empty!`)
								assert(
									!!rel_type && isꓽRelationshipType(rel_type),
									`relationship claim: unknown "${rel_type}"!`,
								)
								target = normalizeꓽid(target)
								state = Reducers.ensureꓽperson(state, target)
								const [a, b] = [person_or_orgid, target].sort()
								state = Reducers.claimꓽrelationship(state, rel_type, a!, b!)
								break
							}

							/*
							case claim === '--': {
								// it's a separator, ignore
								claims_count--
								assert(non_claims_segments.length === 0 && claims_count === 0, `separator should at start!`)
								break
							}


							if (hasꓽemoji(claim)) {
									console.error(`NIMP claim = "${claim}"`)
									throw new Error(`claim "${claim}" not implemented!`)
								}
								else {
							 */

							default:
								// ignore, will be stored as notes and not lost, TODO implement later
								claims_count--
								non_claims_segments.push(claim)
								break
						}
					}
				}

				if (non_claims_segments.length) {
					// must be notes OR unrecognized claim = we store it as notes
					const note_line = non_claims_segments.join(" ")

					if (lda_count) {
						assert(lda_count === 1, `Unclear notes on line with multiple date claims!`)
						// mutation 🫢 but so convenient 😅
						lda!.description = note_line
					} else {
						console.log(`Assuming notes: "${note_line}"`)
						state = Reducers.claimꓽperson_or_org__note(state, person_or_orgid, note_line)
					}
				}
			} else if (line.startsWith(MARKER_EMOJI_DATE)) {
				const claim = line.slice(MARKER_EMOJI_DATE.length)
				let emoji = ""
				let date_raw = ""
				let description = ""
				let status = "emoji" as "emoji" | "date" | "rest"
				claim.split("").forEach((c) => {
					switch (status) {
						case "emoji":
							if (LooseDateLib.isꓽpart(c)) {
								date_raw += c
								status = "date"
								return
							}

							emoji += c
							return
						case "date":
							if (!LooseDateLib.isꓽpart(c)) {
								description += c
								status = "rest"
								return
							}
							date_raw += c
							return
						case "rest":
							description += c
							return
						default:
							throw new Error(`Unknown status!`)
					}
				})
				emoji = emoji.trim()
				date_raw = date_raw.trim()
				description = (() => {
					description = description.trim()

					if (description.startsWith("=")) description = description.slice(1)

					return description.trim()
				})()

				const lda: LooseDateAnnotated = {
					...LooseDateLib.createⵧfrom_str(date_raw),
					description,
				}
				//console.log(`XXX `, { emoji, lda })
				state = Reducers.addꓽdateⵧfree(state, emoji, lda)
			} else {
				throw new Error(`Unknown line format!`)
			}
		} catch (err) {
			_on_error(err, ifl)
		}
	})

	/////

	return state
}

/////////////////////////////////////////////////

function serialize(state: Immutable<State>): string {
	const lines: string[] = []

	const person_ids = Object.keys(state.persons).sort()

	person_ids
		.map((id) => state.persons[id]!)
		.forEach((p) => {
			const unhandled_keys = new Set(Object.keys(p))
			let line_intro = `${p.id}`
			unhandled_keys.delete("id")
			unhandled_keys.delete("org_id") // part of the id

			let lines_other = []

			switch (p.status) {
				case "active":
					// default, nothing to do
					unhandled_keys.delete("status")
					break
				case "dead":
					line_intro += ` 🪦`
					unhandled_keys.delete("status")
					break
				default:
					throw new Error(`Unknown status: ${p.status}`)
			}

			;(() => {
				p.known_nationalities.forEach((n) => {
					throw new Error(`Not implemented!`)
				})
				unhandled_keys.delete("known_nationalities")
			})()

			;(() => {
				lines_other.push(
					...p.notes.toSorted().map((note) => {
						return `${p.id} ${note}`
					}),
				)
				unhandled_keys.delete("notes")
			})()

			lines.push(line_intro)
			lines.push(...lines_other)

			if (unhandled_keys.size) {
				throw new Error(`Unhandled keys: ${Array.from(unhandled_keys)}`)
			}
		})

	return lines.join(LINE_SEP) + LINE_SEP
}

/////////////////////////////////////////////////

export { deserialize, serialize }
