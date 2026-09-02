// conservative
export function is_browser_page_visible(): boolean {
	if (globalThis.document.visibilityState === "hidden") return false

	return true
}
