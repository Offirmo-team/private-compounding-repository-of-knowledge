import { is_browser_connected_to_a_network } from "./index.ts"

export function Default() {
	return `is_browser_connected_to_a_network() = ${is_browser_connected_to_a_network()}`
}
