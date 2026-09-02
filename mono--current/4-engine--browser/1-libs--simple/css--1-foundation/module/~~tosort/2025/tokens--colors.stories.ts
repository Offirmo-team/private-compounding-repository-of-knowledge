import { AllTogether as Anchors } from '@monorepo-private/storypad/src/__shared/stories/html/elements/a.stories'

////////////////////////////////////////////////////////////////////////////////////

// Table of colors defined as CSS variables
function ColorsAsCSSVariablesTable({radixes, caption}: { radixes: string[], caption: string }) {
	console.log({
		radixes,
		caption,
	})

	return `
<table style="border: var(--o⋄border--thickness) solid var(--o⋄color⁚fg--main);">
	<caption>⬇${ caption }⬇</caption>
	<thead>
		<tr>
			<th scope='col'>CSS variable</th>
			<th scope='col'>foreground</th>
			<th scope='col'>background</th>
			<th scope='col'>default (if any)</th>
		</tr>
	</thead>
	<tbody>
		${radixes.map(radix => {
			const css_var = `--o⋄color⁚` + radix
			return `
				<tr key=${ radix } style="background-color: white;">
					<td style="text-align: start; font-family: monospace;">${ css_var }</td>
					${
						radix.startsWith('bg--')
							? `<td>-</td>`
							: `<td style="color: var(${ css_var })">as foreground</td>`
					}
					${
						radix.startsWith('fg--')
							? `<td>-</td>`
							: `<td style="background-color: var(${ css_var })">as background</td>`
					}
					${
						radix.startsWith('bg--')
							? `<td style="background-color: var(${ css_var }--default)">as background</td>`
							: `<td style="color: var(${ css_var }--default)">as foreground</td>`
					}
				</tr>
			`
		}).join('\n') }
	</tbody>
</table>
	`
}

export function ColorsꓽSemantic() {

	const SEMANTIC_COLORS_VARS_RADIX = [
		'fg--main',
		'fg--strong',
		'fg--link',
		'fg--link--visited',

		'fg--activity-outline',
		//'fg--warning',
		//'fg--info',
		//'fg--success',

		'bg--main',
		'bg--code',
		'bg--highlight--1',
		'bg--highlight--2',

		'fg--accent',
	]

	return ColorsAsCSSVariablesTable({
				radixes: SEMANTIC_COLORS_VARS_RADIX,
				caption: 'Semantic colors from CSS variables',
			})
}


export function ColorsꓽColoredElements() {

return `
${ Anchors() }

<br>

<meter min=0 low=25 high=50 optimum=75 max=100 value=0></meter>
<meter min=0 low=25 high=50 optimum=75 max=100 value=24></meter>
<meter min=0 low=25 high=50 optimum=75 max=100 value=49></meter>
<meter min=0 low=25 high=50 optimum=75 max=100 value=74></meter>
<meter min=0 low=25 high=50 optimum=75 max=100 value=100></meter>

<br>

<progress max=100></progress><br>
<progress max=100 value=0></progress><br>
<progress max=100 value=50></progress><br>
<progress max=100 value=100></progress>

<br>

`
}
