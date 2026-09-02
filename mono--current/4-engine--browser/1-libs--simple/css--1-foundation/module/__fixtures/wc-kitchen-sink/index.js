customElements.define(
	"offirmo-css-foundation-demo",
	class Component extends HTMLElement {
		constructor() {
			super()
		}

		connectedCallback() {
			this.innerHTML = `
<section style="border: solid 1px currentColor;">
<p>
	<strong>strong</strong>
	<em>em</em>
	normal
	<small>small</small>
	<a href="${document.location}" download>vdlink</a>
	<a href="https://www.google.com/search?q=${String(Math.random())}" target=_blank>utlink</a>
	<mark>mark</mark>

	<img style="display: inline-block" style="height:1em;" src="https://foo.com/bar.jpg" />

	<svg viewBox="0 0 200 25" style="height: 1em; background-color: Highlight;">
		<text x="10" y="20">SVG Text</text>
		<a xlink:href="${document.location.origin + document.location.pathname + document.location.search + "&random=" + String(Math.random())}">
			<text x="95" y="20">ulink</text>
		</a>
		<a xlink:href="${document.location}" target=_blank>
			<text x="150" y="20">vlink</text>
		</a>
	</svg>
</p>
	<textarea id="story" name="story" rows="1">It was a dark and stormy night...</textarea>

	<details open>
		<summary>1st summary</summary>
		<details>
			<summary>summary 2</summary>
			<details>
				<summary>summary 3</summary>
				<p>That's all!</p>
			</details>
		</details>
	</details>
</section>
`
		}
	},
)
