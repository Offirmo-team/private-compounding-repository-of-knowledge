export function Short() {
	return `
		<ol>
			<li>Hello</li>
			<li>World!</li>
		</ol>
	`
}

export function Long() {
	return `
		<ol>
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
		</ol>
	`
}

export function Nested() {
	return `
		<ol>
			<li>Hello</li>
			<li>World!</li>
			<ol>
				<li>Hello</li>
				<li>World!</li>
				<ol>
					<li>Hello</li>
					<li>World!</li>
					<ol>
						<li>Hello</li>
						<li>World!</li>
					</ol>
				</ol>
			</ol>
		</ol>
	`
}

export function NestedMixed() {
	return `
		<ol>
			<li>Hello</li>
			<li>World!</li>
			<ul>
				<li>Hello</li>
				<li>World!</li>
				<ol>
					<li>Hello</li>
					<li>World!</li>
					<ul>
						<li>Hello</li>
						<li>World!</li>
					</ul>
				</ol>
			</ul>
		</ol>
	`
}

export function Empty() {
	return `
		<ol>
		</ol>
	`
}
