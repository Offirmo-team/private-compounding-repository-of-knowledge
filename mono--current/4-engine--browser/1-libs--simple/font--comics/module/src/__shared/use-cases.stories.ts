const STYLE = `max-width: 200px; border: solid 2px black; padding: .3em; xtext-align: center; margin: .5em 0; border-radius: 1em;`

export function Speech1() {
	return `
<div style="border-radius: 50%; ${STYLE}">
I haven't been inside the secret room, but I intend to find out what's in there!
</div>
	`
}

export function Speech2() {
	return `
<div style="${STYLE}">
Oh! It's <strong>encyclopedias</strong>! I was expecting something more <em>exciting</em>.
</div>
	`
}

export function Speech3() {
	return `
<style>
.tight {
	letter-spacing: -0.06em;
}
</style>
<div style="${STYLE}">
That's an <span class="tight">inconsequentially</span> tiny matter of physics, doctor Smith!
</div>
	`
}

export function Speech4() {
	return `
<div style="${STYLE}">
⚞Guh!⚟ Stop hitting me--⚞OOF!⚟
</div>
	`
}

export function Speech5() {
	return `
<div style="${STYLE}">
♫Happy birthday to yooo…♪
</div>
	`
}

export function Panel() {
	return `
<div style="${STYLE}">
"<em>Si, Jefe,</em> there are bad men in this town."
</div>
	`
}

export function All() {
	return `
${Speech1()}
${Speech2()}
${Speech3()}
${Speech4()}
${Speech5()}
${Panel()}
	`
}
