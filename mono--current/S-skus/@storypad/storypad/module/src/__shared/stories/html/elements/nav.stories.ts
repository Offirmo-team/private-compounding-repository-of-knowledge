// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav

/////////////////////////////////////////////////
// aggreg

export function AllTogether() {
	const stories = {
		ErrorⳇEmpty,
		Listⳇul,
		Listⳇol,
		NoList,
	}
	return Object.keys(stories)
		.map((key) => `<code>${key}</code>` + (stories as any)[key]())
		.join(`<hr/>`)
}

/////////////////////////////////////////////////
// mistakes/errors (first)

export function ErrorⳇEmpty() {
	return `
<nav>
</nav>
	`
}

/////////////////////////////////////////////////
// ok

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav#examples
export function Listⳇul() {
	return `
<nav>
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>
	`
}

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav#examples
export function Listⳇol() {
	return `
<nav>
  <ol>
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</nav>
	`
}

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav#examples
export function NoList() {
	return `
<nav>
  <h2>Navigation</h2>
  <p>
    You are on my home page. To the north lies <a href="/blog">my blog</a>, from
    whence the sounds of battle can be heard. To the east you can see a large
    mountain, upon which many <a href="/school">school papers</a> are littered.
    Far up this mountain you can spy a little figure who appears to be me,
    desperately scribbling a <a href="/school/thesis">thesis</a>.
  </p>
  <p>
    To the west are several exits. One fun-looking exit is labeled
    <a href="https://games.example.com/">"games"</a>. Another more
    boring-looking exit is labeled <a href="https://isp.example.net/">ISP™</a>.
  </p>
  <p>
    To the south lies a dark and dank <a href="/about">contacts page</a>.
    Cobwebs cover its disused entrance, and at one point you see a rat run
    quickly out of the page.
  </p>
</nav>
	`
}
