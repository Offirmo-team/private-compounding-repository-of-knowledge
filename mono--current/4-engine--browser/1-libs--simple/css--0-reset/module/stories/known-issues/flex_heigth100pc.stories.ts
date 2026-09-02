/* 2022/05/26
 * Seen unique display on Chrome, FF, Safari
 */

export function Details() {
	return `
<p>
It seems browsers have various interpretation of the spec about 'height'. This demo renders differently on Chrome, FF and Safari.
</p>
<p>
See "explanation" on https://stackoverflow.com/a/33644245/587407
</p>
<p>
TODO: bug report?
</p>
	`
}

function _common() {
	return `
<div id="e1" style="background-color: red">div1</div>
<div id="e2" style="background-color: blue">div2</div>
<style>
body {
	display: flex;
	/* height: 100%; uncomment this to align browsers on full height */
}
div#e2 {
	height: 100%;
}
</style>
	`
}

export function Issue() {
	return _common()
}
Issue.decorators = null

export function Fixed() {
	return _common()
}
