/* Convert a tree data structure
 * into a visual text representation using unicode
 */

import type { Immutable } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

interface TreeForRL {
	isꓽroot(): boolean
	getꓽrepresentationⵧlines(depth: number): string[]
	getꓽchildren(): Immutable<TreeForRL[]>
}

/////////////////////////////////////////////////

function _getꓽrepresentationⵧlines(node: Immutable<TreeForRL>, prefix: string = "", depth = 0): string[] {
	const result = node.getꓽrepresentationⵧlines(depth).map((l) => prefix + l)

	const children = node.getꓽchildren()
	children.forEach((child, index) => {
		const r = _getꓽrepresentationⵧlines(child, "", depth + 1)
		const is_last_child = index === children.length - 1
		result.push(
			...r.map((l, i) => {
				const is_first_line = i === 0
				if (is_first_line) {
					if (is_last_child) {
						return "└ " + l
					} else {
						return "├ " + l
					}
				}

				if (is_last_child) {
					return "  " + l
				} else {
					return "│ " + l
				}
			}),
		)
	})

	return result
}

function getꓽrepresentationⵧlinesⵧgeneric(tree: Immutable<TreeForRL>): string[] {
	if (tree.getꓽchildren().length === 0) {
		return ["[empty tree]"]
	}

	// TODO check orphans
	// TODO check cycles

	return _getꓽrepresentationⵧlines(tree)
}

/////////////////////////////////////////////////

export { type TreeForRL, getꓽrepresentationⵧlinesⵧgeneric }
