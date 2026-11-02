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

	ǃ.forⵧparam({ score_a }).require(score_a.length > 0, `should have length`)
	ǃ.forⵧparam({ score_b }).require(score_b.length > 0, `should have length`)

	// stops at the first difference
	for (const index of Array.from({ length: Math.max(score_a.length, score_b.length) }).keys()) {
		try {
			const score_unit_a = score_a[index]
			ǃ.forⵧvalue({ score_unit_a }).assert(
				typeof score_unit_a === "number",
				`Score comparison should never yield different path on previous equality`,
			)
			const score_unit_b = score_b[index]
			ǃ.forⵧvalue({ score_unit_b }).assert(
				typeof score_unit_b === "number",
				`Score comparison should never yield different path on previous equality`,
			)

			const difference = score_unit_a! - score_unit_b!
			if (difference !== 0) return difference
		} catch (err) {
			console.error(`compare_scores(…) Error at #${index}!`, err)
			console.log(score_a)
			console.log(score_b)
			throw err
		}
	}

	return 0
}

/////////////////////////////////////////////////

import { assert_from } from "@monorepo-private/assert"
