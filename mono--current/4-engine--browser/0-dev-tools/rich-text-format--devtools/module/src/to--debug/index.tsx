import { assert, assert_from } from "@monorepo-private/assert"
import * as RichText from "@monorepo-private/rich-text-format"
import type { Immutable, PositiveInteger } from "@monorepo-private/ts--types"
import "@monorepo-private/css--framework"

import type { BaseProps } from "../types.ts"

/////////////////////////////////////////////////

function RichTextToDebug({ $doc: $raw }: BaseProps) {
	console.log(`🔄 <RichTextToDebug>`, $raw)

	const state: State = {
		depth: 0,
		header_depth: 0,
	}

	const $doc = RichText.normalizeꓽnode(RichText.promoteꓽto_node($raw))
	let {
		// extract fields
		$v,
		$type,
		$heading,
		$content,
		$refs,
		$classes,
		$hints,
		...rest
	} = $doc

	const summary = (() => {
		let result = ""
		if ($heading) {
			result += "#".repeat(state.depth + 1)
			result += " " + $heading
		}

		return result
	})()

	return (
		<details open>
			<summary>{summary}</summary>
			<div>
				<pre>
					TODO
					{JSON.stringify(
						{
							$type,
							$heading,
							$content,
							$refs,
							$classes,
							$hints,
							...rest,
						},
						null,
						2,
					)}
				</pre>
				<details>
					<summary>
						<small>details...</small>
					</summary>
					<details>
						<summary>
							<small>simplified</small>
						</summary>
						<pre>{JSON.stringify(RichText.simplifyꓽnode($doc), null, 2)}</pre>
					</details>
					<details>
						<summary>
							<small>full</small>
						</summary>
						<pre>{JSON.stringify($doc, null, 2)}</pre>
					</details>
					<details>
						<summary>
							<small>original</small>
						</summary>
						<pre>{JSON.stringify($raw, null, 2)}</pre>
					</details>
				</details>
			</div>
		</details>
	)
}

type State = {
	depth: PositiveInteger
	header_depth: PositiveInteger
}

/////////////////////////////////////////////////

export { RichTextToDebug }
