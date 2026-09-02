import { loadꓽconfigⵧchain } from "@monorepo-private/load-config"
import type { PathⳇAny } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

// useful to build the graph
async function loadꓽspecⵧchainⵧraw(from?: PathⳇAny): ReturnType<typeof loadꓽconfigⵧchain> {
	return await loadꓽconfigⵧchain(".monorepo", { ...(from && { from }) })
}

/////////////////////////////////////////////////

export { loadꓽspecⵧchainⵧraw }
