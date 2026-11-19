export function Short() {
	return `
		<ul>
			<li>Hello</li>
			<li>World!</li>
		</ul>
	`
}

export function Long() {
	return `
		<ul>
			<li>Hello</li>
			<li>World!</li>
			<li>Hello</li>
			<li>World!</li>
			<li>Hello</li>
			<li>World!</li>
			<li>Hello</li>
			<li>World!</li>
			<li>Hello</li>
			<li>World!</li>
			<li>Hello</li>
			<li>World!</li>
			<li>Hello</li>
			<li>World!</li>
			<li>Hello</li>
			<li>World!</li>
			<li>Hello</li>
			<li>World!</li>
			<li>Hello</li>
			<li>World!</li>
			<li>Hello</li>
			<li>World!</li>
			<li>Hello</li>
			<li>World!</li>
			<li>Hello</li>
			<li>World!</li>
			<li>Hello</li>
			<li>World!</li>
			<li>Hello</li>
			<li>World!</li>
			<li>Hello</li>
			<li>World!</li>
		</ul>
	`
}

export function Nested() {
	return `
		<ul>
			<li>Hello</li>
			<li>World!</li>
			<ul>
				<li>Hello</li>
				<li>World!</li>
				<ul>
					<li>Hello</li>
					<li>World!</li>
					<ul>
						<li>Hello</li>
						<li>World!</li>
					</ul>
				</ul>
			</ul>
		</ul>
	`
}

export function NestedMixed() {
	return `
		<ul>
			<li>Hello</li>
			<li>World!</li>
			<ol>
				<li>Hello</li>
				<li>World!</li>
				<ul>
					<li>Hello</li>
					<li>World!</li>
					<ol>
						<li>Hello</li>
						<li>World!</li>
					</ol>
				</ul>
			</ol>
		</ul>
	`
}

export function Empty() {
	return `
		<ul>
		</ul>
	`
}
