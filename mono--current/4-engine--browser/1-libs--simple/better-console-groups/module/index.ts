import { once } from "limit-once"

import improve_console_groups from "./better-console-groups.ts"

/////////////////////////////////////////////////

const _request_install_better_console_groups_if_not_already = once((active: boolean = true) => {
	if (active) improve_console_groups()
})

/////////////////////////////////////////////////

export { _request_install_better_console_groups_if_not_already }
