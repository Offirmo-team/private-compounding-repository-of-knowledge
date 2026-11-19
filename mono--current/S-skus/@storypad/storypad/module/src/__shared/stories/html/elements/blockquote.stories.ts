// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote

/////////////////////////////////////////////////
// aggreg

export function AllTogether() {
	const stories = {
		ErrorⳇEmpty,
		ErrorⳇNoCite,
		Errorⳇinsecure,
		ErrorⳇBadStructure,
		OneParaNoFooter,
		OneParaWithFooter,
		OneParaWithFooterⵧNonEnglish,
		SeveralParaWithFooter,
		InAFigure,
	}
	return Object.keys(stories)
		.map((key) => `<code>${key}</code>` + (stories as any)[key]())
		.join(`<hr/>`)
}

/////////////////////////////////////////////////
// mistakes/errors (first)

export function ErrorⳇEmpty() {
	return `
<blockquote>
</blockquote>
	`
}

export function ErrorⳇNoCite() {
	return `
<blockquote>
	<p>Words can be like X-rays, if you use them properly—they’ll go through anything. You read and you’re pierced.</p>
	<footer>—Aldous Huxley, <cite>Brave New World</cite></footer>
</blockquote>
	`
}

export function Errorⳇinsecure() {
	return `
<blockquote cite="http://www.huxley.net/bnw/four.html">
	<p>Words can be like X-rays, if you use them properly—they’ll go through anything. You read and you’re pierced.</p>
	<footer>—Aldous Huxley, <cite>Brave New World</cite></footer>
</blockquote>
	`
}

export function ErrorⳇBadStructure() {
	return `
<blockquote>
	Words can be like X-rays, if you use them properly—they’ll go through anything. You read and you’re pierced.
</blockquote>
	`
}

/////////////////////////////////////////////////
// ok

export function OneParaNoFooter() {
	return `
<blockquote>
	<p>Carpe diem</p>
</blockquote>
	`
}

export function OneParaWithFooter() {
	return `
<blockquote cite="https://www.huxley.net/bnw/four.html">
	<p>Words can be like X-rays, if you use them properly—they’ll go through anything. You read and you’re pierced.</p>
	<footer>—Aldous Huxley, <cite>Brave New World</cite></footer>
</blockquote>
	`
}

export function OneParaWithFooterⵧNonEnglish() {
	return `
<blockquote lang="fr" cite="https://citations.ouest-france.fr/citation-pierre-corneille/aux-ames-bien-nees-valeur-102458.html">
	<p>Aux âmes bien nées, la valeur n'attend point le nombre des années.</p>
	<footer>— Pierre Corneille, <cite>Le Cid</cite></footer>
</blockquote>
	`
}

export function SeveralParaWithFooter() {
	return `
<blockquote cite="https://en.wikipedia.org/wiki/If%E2%80%94">
	<p>If you can talk with crowds and keep your virtue,<br>
	    Or walk with Kings—nor lose the common touch,</p>
	<p>If neither foes nor loving friends can hurt you,<br>
	    If all men count with you, but none too much;</p>
	<p>If you can fill the unforgiving minute<br>
	    With sixty seconds’ worth of distance run,</p>
	<p>Yours is the Earth and everything that’s in it,<br>
	    And —which is more— you’ll be a Man, my son!</p>

	<footer>Rudyard Kipling, <cite>If—</cite></footer>
</blockquote>
	`
}

export function InAFigure() {
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite
	return `
<figure>
	<blockquote>
		<p>It was a bright cold day in April, and the clocks were striking thirteen.</p>
	</blockquote>
	<figcaption>
		First sentence in <cite><a href="https://www.george-orwell.org/1984/0.html" rel="noreferrer">Nineteen Eighty-Four</a></cite>
		by George Orwell (Part 1, Chapter 1).
	</figcaption>
</figure>
	`
}
