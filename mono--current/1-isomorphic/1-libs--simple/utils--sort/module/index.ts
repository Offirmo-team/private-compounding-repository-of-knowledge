/////////////////////////////////////////////////

export type Score =
	| null // = not even eligible to be scored
	| Array<number> // empty not allowed, lower is better

export function compareꓽscores(score_a: Score, score_b: Score): number {
	const ǃ = assert_from({ compareꓽscores })
	ǃ.require(score_a !== null || score_b !== null, `At least one score should be eligible!`)

	if (score_a === score_b) return 0

	if (score_b === null) return -1
	if (score_a === null) return +1

	ǃ.assert(score_a.length > 0, `score should have length! (A)`)
	ǃ.assert(score_b.length > 0, `score should have length! (B)`)

	return Array.from({ length: Math.max(score_a.length, score_b.length) }).reduce<number>((acc, _, index) => {
		if (acc === 0) {
			try {
				const score_unit_a = score_a[index]
				ǃ.assert(
					typeof score_unit_a === "number",
					`Score comparison should never yield different path on previous equality! (A)`,
				)
				const score_unit_b = score_b[index]
				ǃ.assert(
					typeof score_unit_b === "number",
					`Score comparison should never yield different path on previous equality! (B)`,
				)

				acc = score_unit_a! - score_unit_b!
			} catch (err) {
				console.error(`compare_scores(…) Error at #${index}!`, err)
				console.log(score_a)
				console.log(score_b)
				throw err
			}
		}

		return acc
	}, 0)
}

/////////////////////////////////////////////////

import { assert_from } from "@monorepo-private/assert"
