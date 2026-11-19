type LinkType = "normal" | "new-tab" | "download"

export function AllTogether() {
	return `
<table>
	<thead>
		<tr>
			<th></th>
			<th>Not visited</th>
			<th>Already visited</th>
		</tr>
	</thead>
	<tbody>
		${(["normal", "new-tab", "download"] as LinkType[])
			.map(
				(type) => `
			<tr>
				<td>${type}</td>
				<td>${_link({ text: "link", type, isꓽvisited: false })}</td>
				<td>${_link({ text: "link", type, isꓽvisited: true })}</td>
			</tr>
		`,
			)
			.join(`\n`)}
	</tbody>
</table>
	`
}

export function NeverVisited() {
	return _link({
		isꓽvisited: false,
	})
}

export function AlreadyVisited() {
	return _link({
		isꓽvisited: true,
	})
}

export function NewTab() {
	return _link({
		type: "new-tab",
	})
}

export function Download() {
	return _link({
		type: "download",
	})
}

export function External() {
	return _link({
		isꓽexternal: true,
	})
}

export function _link({
	isꓽvisited = false,
	isꓽexternal = false,
	type = isꓽexternal ? "new-tab" : "normal",
	text,
}: {
	isꓽvisited?: boolean
	isꓽexternal?: boolean
	type?: LinkType
	text?: string
} = {}) {
	const location = document.location

	const auto_text = [
		type === "download" ? "download" : "",
		isꓽexternal ? "external" : "internal",
		"link",
		type === "new-tab" ? "to new tab" : "",
		isꓽvisited ? "(visited)" : "(not visited)",
	].join(" ")

	let href = isꓽexternal ? "https://www.google.com?" : location.pathname + location.search

	return `
		<a
			href="${href}${isꓽvisited ? "" : "&random=" + String(Math.random())}"
			${type === "new-tab" ? 'target="_blank"' : ""}
			${type === "download" ? "download" : ""}
			${isꓽexternal ? 'rel="noreferrer"' : ""}
			>
			${text || auto_text}
		</a>
	`
}
