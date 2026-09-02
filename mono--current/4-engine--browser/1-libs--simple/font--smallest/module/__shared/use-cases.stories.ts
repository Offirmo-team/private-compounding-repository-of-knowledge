const STYLE = `font-size: 5px;`

export function Timestamp() {
	return `
<span style="${STYLE}">
20181121_06h00+45.632
</span>
	`
}

export function Version() {
	return `
<span style="${STYLE}">
v12.34.56-rc.78
</span>
	`
}

export function UUID() {
	return `
<span style="${STYLE}">
uu1soONcKuc4CYVWMKn68CRO
</span>
	`
}

export function All() {
	return `
<div style="zoom: 200%">
${Timestamp()}<br>
${Version()}<br>
${UUID()}
</div>
<div>${Version()} ${Timestamp()} ${UUID()}</div>
	`
}
