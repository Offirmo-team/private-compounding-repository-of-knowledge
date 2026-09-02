import { $EXAMPLE_COMPLETE_NODE } from "@monorepo-private/rich-text-format"

import type { Meta‿v2, Story‿v2 } from "./index.ts"

/////////////////////////////////////////////////

export const String: Story‿v2 = () => "This is a CSF v2 story returning plain text."

export const StringHtml: Story‿v2 = () =>
	`This is a CSF <strong>v2</strong> story returning <em><strong>HTML</strong> as a text.</em>`

export const RichText: Story‿v2 = () => $EXAMPLE_COMPLETE_NODE

export const HtmlElement: Story‿v2 = () => {
	const div = document.createElement("div")
	div.classList.add("foo")
	div.innerHTML = `This is a CSF <strong>v2</strong> story returning an <strong>HTMLElement</strong>.</em>` // HTML string
	return div
}
