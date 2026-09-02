import type { Svg‿str } from "../../types.ts"

/////////////////////////////////////////////////

function getꓽcontentꘌcat(params: string = ""): Svg‿str {
	// Claude Sonnet 4 "generate SVG code for a cute kitten" + manual improvements
	return `
<svg ${params} viewBox="35 37 225 225" xmlns="http://www.w3.org/2000/svg">

	<!-- Kitten body -->
	<ellipse cx="150" cy="200" rx="60" ry="45" fill="#ffa500" stroke="#ff8c00" stroke-width="2"/>

	<!-- Kitten head -->
	<circle cx="150" cy="120" r="55" fill="#ffa500" stroke="#ff8c00" stroke-width="2"/>

	<!-- Ears -->
	<polygon points="120,80 105,45 135,65" fill="#ffa500" stroke="#ff8c00" stroke-width="2"/>
	<polygon points="180,80 195,45 165,65" fill="#ffa500" stroke="#ff8c00" stroke-width="2"/>

	<!-- Inner ears -->
	<polygon points="122,72 115,55 130,65" fill="#ffb347"/>
	<polygon points="178,72 185,55 170,65" fill="#ffb347"/>

	<!-- Face stripes -->
	<path d="M 110 100 Q 120 95 130 100" stroke="#ff8c00" stroke-width="3" fill="none"/>
	<path d="M 170 100 Q 180 95 190 100" stroke="#ff8c00" stroke-width="3" fill="none"/>
	<path d="M 115 115 Q 125 110 135 115" stroke="#ff8c00" stroke-width="2" fill="none"/>
	<path d="M 165 115 Q 175 110 185 115" stroke="#ff8c00" stroke-width="2" fill="none"/>

	<!-- Eyes -->
	<ellipse cx="135" cy="110" rx="12" ry="15" fill="#000"/>
	<ellipse cx="165" cy="110" rx="12" ry="15" fill="#000"/>

	<!-- Eye highlights -->
	<ellipse cx="138" cy="105" rx="4" ry="5" fill="#fff"/>
	<ellipse cx="168" cy="105" rx="4" ry="5" fill="#fff"/>

	<!-- Nose -->
	<polygon points="150,125 145,135 155,135" fill="#ff69b4"/>

	<!-- Mouth -->
	<path d="M 150 135 Q 140 145 135 140" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>
	<path d="M 150 135 Q 160 145 165 140" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>

	<!-- Whiskers -->
	<line x1="100" y1="120" x2="125" y2="125" stroke="#000" stroke-width="1.5"/>
	<line x1="105" y1="135" x2="130" y2="135" stroke="#000" stroke-width="1.5"/>
	<line x1="200" y1="120" x2="175" y2="125" stroke="#000" stroke-width="1.5"/>
	<line x1="195" y1="135" x2="170" y2="135" stroke="#000" stroke-width="1.5"/>

	<!-- Front paws -->
	<ellipse cx="125" cy="235" rx="15" ry="20" fill="#ffa500" stroke="#ff8c00" stroke-width="2"/>
	<ellipse cx="175" cy="235" rx="15" ry="20" fill="#ffa500" stroke="#ff8c00" stroke-width="2"/>

	<!-- Paw pads -->
	<ellipse cx="125" cy="240" rx="8" ry="6" fill="#ff69b4"/>
	<ellipse cx="175" cy="240" rx="8" ry="6" fill="#ff69b4"/>

	<!-- Tail -->
	<path d="M 90 200 Q 60 180 50 150 Q 45 140 55 135" stroke="#ff8c00" stroke-width="12" fill="none" stroke-linecap="round"/>
	<path d="M 90 200 Q 60 180 50 150 Q 45 140 55 135" stroke="#ffa500" stroke-width="8" fill="none" stroke-linecap="round"/>

	<!-- Tail stripes -->
	<circle cx="49" cy="145" r="2.5" fill="#ff8c00"/>
	<circle cx="54" cy="160" r="3" fill="#ff8c00"/>
	<circle cx="63" cy="175" r="3" fill="#ff8c00"/>
</svg>
		`
}

/////////////////////////////////////////////////

export { getꓽcontentꘌcat }
