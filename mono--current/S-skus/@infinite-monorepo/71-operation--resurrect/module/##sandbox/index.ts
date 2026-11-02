import { homedir } from "node:os"
import path from "node:path"
import process from "node:process"
import { parseArgs } from "node:util"

import { resurrect } from "@infinite-monorepo/operation--resurrect"

/////////////////////////////////////////////////

// ex. pnpm sandbox --from 1.2 --all
const { values } = parseArgs({
	args: process.argv.slice(2).filter((arg) => arg !== "--"), // "pnpm sandbox -- --from 1.2" passes the "--" as-is
	options: { from: { type: "string" }, all: { type: "boolean" } },
})

const packages_with_issues = await resurrect(
	path.join(
		homedir(),
		"work/src/x-external/off/offirmo-team/private-compounding-repository-of-knowledge/mono--current/",
	),
	{
		...(values.from !== undefined && { from: values.from }),
		...(values.all !== undefined && { all: values.all }),
	},
)
process.exitCode = packages_with_issues.some(({ isꓽblocking }) => isꓽblocking) ? 1 : 0
