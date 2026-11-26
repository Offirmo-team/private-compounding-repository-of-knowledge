    /*
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/innerHeight) */
    declare var innerHeight: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/innerWidth) */
    declare var innerWidth: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/screenLeft) */
    declare var screenLeft: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/screenTop) */
    declare var screenTop: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/screenX) */
    declare var screenX: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/screenY) */
    declare var screenY: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/scrollX) */
    declare var scrollX: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/scrollY) */
    declare var scrollY: number;
     */

const EXAMPLEⵧSIMPLE_PAGE: Parameters<typeof generateꓽwebsiteᝍentryᝍpoints>[0] = { title: 'The Boring RPG', icon:
SVG.createꓽfrom_emoji('📜'), scripts: [ 'snippet:normalize-trailing-slash' ], }

const EXAMPLEⵧEXPERIMENTⵧVIEWPORT: Parameters<typeof generateꓽwebsiteᝍentryᝍpoints>[0] = { isꓽdebug: true,

    wantsꓽinstall: 'partial',
    hasꓽown_navigation: true,
    supportsꓽscreensⵧwith_shape: true,
    canꓽuse_window_controls_overlay: true,
    usesꓽpull_to_refresh: false,

    title: 'Viewport Test 03',
    icon: SVG.addꓽcontent(
    		SVG.setꓽbackground_color(
    			SVG.setꓽviewBox(
    				SVG.createꓽempty(),
    				[0, 0, 1024, 1024],
    			),
    			'#3876BF',
    		),
    		`
    <g transform='translate(-684,-84)'>
    <path
    	style='fill:#f3f0ca;fill-rule:evenodd;stroke-width:48;stroke-miterlimit:4;stroke-dasharray:none;fill-opacity:1'
    	d='m 1218.2004,207.86424 c -43.7014,14.1636 -86.7236,44.97289 -116.1971,89.15266 28.1667,76.89959 28.1667,91.93015 0,168.82813 31.9813,24.82564 64.7075,39.75185 97.5847,44.10272 -3.3121,-41.04105 -5.8279,-82.08852 1.8061,-123.12476 -21.8747,-2.38093 -37.5266,-9.62489 -59.4029,-22.27451 v -51.72557 c 57.5823,30.65837 99.2832,30.14622 158.6429,0 v 51.72878 c -21.4557,10.43084 -35.1377,17.91722 -56.5934,21.22132 5.8022,41.04907 5.5871,82.12063 2.2075,123.17291 29.9327,-5.24191 59.7819,-19.44725 89.1045,-43.09928 -23.0435,-76.89798 -23.0467,-91.93015 0,-168.82653 -27.2643,-44.96646 -76.1851,-74.86865 -117.1523,-89.15587 z m -208.0614,13.19389 c -41.59177,177.26817 -43.91008,345.70938 -43.99037,531.29077 -30.2473,-2.46763 -60.33731,-8.22009 -89.95051,-17.85301 v 45.84306 h 110.8845 c 13.99178,56.23216 10.39071,112.46753 -1.6633,168.7013 h 45.16228 c -11.5514,-56.23377 -13.2244,-112.46914 -1.3999,-168.7013 h 110.6244 v -45.84467 c -29.6855,7.93432 -59.814,13.73012 -90.063,16.79339 0.1317,-184.53461 4.0073,-358.13264 -39.6025,-530.22794 z m 143.6428,324.91031 c 0,188.27539 40.9672,374.62741 192.9074,414.16732 167.2644,-33.7714 193.1127,-225.37336 193.1127,-414.16893 h -386.0233 z'
    	/>
    </g>
    		`
    	),

    description: 'Prototype of PWA-compatible page using the full viewport',

    // https://www.colorhunt.co/palette/1926553876bfe1aa74f3f0ca
    colorⵧbackground: '#3876BF',
    colorⵧforeground: '#F3F0CA',
    colorⵧtheme:      '#E1AA74',

    styles: [
    	'snippet:natural-box-layout',

    	`

:root { /_ transfer the env() to variables _/ --safe-area-inset-top: env(safe-area-inset-top, 0px);
--safe-area-inset-right: env(safe-area-inset-right, 0px); --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
--safe-area-inset-left: env(safe-area-inset-left, 0px);

    			/* https://www.magicpattern.design/tools/css-backgrounds */
    			background-image:  linear-gradient(#7e7e7d 2px, transparent 2px), linear-gradient(90deg, #7e7e7d 2px, transparent 2px), linear-gradient(#7e7e7d 1px, transparent 1px), linear-gradient(90deg, #7e7e7d 1px, var(--color--bg) 1px);
    			background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
    			background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;

    		}

    		/* don't mess with those special containers */
    		html, body {
    			margin: 0;
    			padding: 0;
    			border: initial;
    		}

    		body {
    			/* In order to get a true fullscreen
    			 * when pinned on iPhone
    			 * - position must NOT be "fixed", or it strangely crops to the small viewport! (2023/11 iOs 16.6.1 iPhone 14) (absolute is ok)
    			 * - height MUST be 100lvh;
    			 * If :root has 0 padding, margin & border, no need to explicitly position
    			position: fixed;
    			top: 0;
    			left: 0;
    			 */
    			overflow: hidden;
    			width: 100lvw;
    			height: 100lvh;
    		}

    		.fullviewport {
    			isolation: isolate;
    			position: fixed;
    			top: 0;
    			left: 0;
    			margin: 0;
    			overflow: hidden;
    			width: 100vw;
    			height: 100vh;
    		}
    		.fullviewport.large {
    			width: 100lvw;
    			height: 100lvh;
    			border-style: solid;
    			border-width: 20px;
    			text-align: left;
    		}
    		.fullviewport.dynamic {
    			text-align: center;
    			width: 100dvw;
    			height: 100dvh;
    			border-style: dotted;
    			border-width: 20px;
    		}
    		.fullviewport.small {
    			text-align: right;
    			width: 100svw;
    			height: 100svh;
    			border-width: 10px;
    		}

    		.with-clear-borders {
    			--color--border: rgba(255, 255, 255, 0.3);
    			border: dashed 2lvmin var(--color--border);
    			border-boundary: display; /* https://drafts.csswg.org/css-round-display/#border-boundary-property */
    			shape-inside: display; /* https://drafts.csswg.org/css-round-display/#shape-inside-property */
    		}

    		.safe-inset {
    			--color--border: rgba(255, 0, 0, 0.5);
    			border-top:    solid var(--safe-area-inset-top)    var(--color--border);
    			border-right:  solid var(--safe-area-inset-right)  var(--color--border);
    			border-bottom: solid var(--safe-area-inset-bottom) var(--color--border);
    			border-left:   solid var(--safe-area-inset-left)   var(--color--border);

    			color: var(--color--border);
    			text-align: right;
    		}

    		.controls {
    		}
    	`,
    ],

    scripts: [ 'snippet:normalize-trailing-slash' ],

    html: `
    	<div class='fullviewport large with-clear-borders'>
    		LARGE viewport =
    	</div>

    	<div class='fullviewport dynamic with-clear-borders'>
    		DYNAMIC viewport ●
    	</div>

    	<div class='fullviewport small with-clear-borders'>
    		∎ SMALL viewport
    	</div>

    	<div class='fullviewport safe-inset'>
    		[SAFE INSET]
    	</div>

    	<div class='fullviewport debug'>

    	</div>

    	<div class='fullviewport controls'>
    		<button onclick='location.reload()' style='position: absolute; bottom: 10lvmin; left: 10lvmin;'>Reload</button>
    	</div>

    	<script type='module'>

    		function on_viewport_change() {
    			console.group('on_viewport_change()')

    			console.log({ screen })
    			console.log({ visualViewport })
    			console.log({
    				'document.documentElement.clientWidth': document.documentElement.clientWidth,
    				'document.documentElement.clientHeight': document.documentElement.clientHeight,
    				//'viewportⵧsmall': [ fullviewport_elementⵧsmall.offsetWidth, fullviewport_elementⵧsmall.offsetHeight ],
    				//'viewportⵧnormal': [ fullviewport_elementⵧnormal.offsetWidth, fullviewport_elementⵧnormal.offsetHeight ],
    				//'viewportⵧlarge': [ fullviewport_elementⵧlarge.offsetWidth, fullviewport_elementⵧlarge.offsetHeight ],
    				//'viewportⵧdynamic': [ fullviewport_elementⵧdynamic.offsetWidth, fullviewport_elementⵧdynamic.offsetHeight ],
    			})

    			console.groupEnd()
    		}

    		;(new ResizeObserver((entries, observer) => {
    			for (const entry of entries) {
    				console.log('ResizeObserver: element size changed:', entry);
    				if (entry.target === document.documentElement) {
    					on_viewport_change()
    				}
    			}
    		})).observe(document.documentElement)
    	</script>
    `

}

const ADVENTURERS_FANTASY_ILLUSTRATION: Parameters<typeof generateꓽwebsiteᝍentryᝍpoints>[0] = { isꓽdebug: true, // TODO
false env: 'prod', //preset: TODO?

    wantsꓽinstall: false,
    title: '«Adventurers» open-source fantasy digital illustration',
    description: '«Adventurers» is an open-source digital illustration featuring fantasy themes, free to use and remix (CC BY 4.0) by Albert Weand & Offirmo.',
    keywords: [ 'illustration', 'fantasy', 'isekai', 'adventurers', 'background', 'art' ],

    icon: SVG.addꓽcontent(
    	SVG.setꓽbackground_color(
    		SVG.setꓽviewBox(
    			SVG.createꓽempty(),
    			[ 0, 0, 1024, 1024 ],
    		),
    		'#3876bf',
    	),
    	`

<g transform='translate(-684,-84)'>
	<path
		style='fill:#f3f0ca;fill-rule:evenodd;stroke-width:48;stroke-miterlimit:4;stroke-dasharray:none;fill-opacity:1'
		d='m 1218.2004,207.86424 c -43.7014,14.1636 -86.7236,44.97289 -116.1971,89.15266 28.1667,76.89959 28.1667,91.93015 0,168.82813 31.9813,24.82564 64.7075,39.75185 97.5847,44.10272 -3.3121,-41.04105 -5.8279,-82.08852 1.8061,-123.12476 -21.8747,-2.38093 -37.5266,-9.62489 -59.4029,-22.27451 v -51.72557 c 57.5823,30.65837 99.2832,30.14622 158.6429,0 v 51.72878 c -21.4557,10.43084 -35.1377,17.91722 -56.5934,21.22132 5.8022,41.04907 5.5871,82.12063 2.2075,123.17291 29.9327,-5.24191 59.7819,-19.44725 89.1045,-43.09928 -23.0435,-76.89798 -23.0467,-91.93015 0,-168.82653 -27.2643,-44.96646 -76.1851,-74.86865 -117.1523,-89.15587 z m -208.0614,13.19389 c -41.59177,177.26817 -43.91008,345.70938 -43.99037,531.29077 -30.2473,-2.46763 -60.33731,-8.22009 -89.95051,-17.85301 v 45.84306 h 110.8845 c 13.99178,56.23216 10.39071,112.46753 -1.6633,168.7013 h 45.16228 c -11.5514,-56.23377 -13.2244,-112.46914 -1.3999,-168.7013 h 110.6244 v -45.84467 c -29.6855,7.93432 -59.814,13.73012 -90.063,16.79339 0.1317,-184.53461 4.0073,-358.13264 -39.6025,-530.22794 z m 143.6428,324.91031 c 0,188.27539 40.9672,374.62741 192.9074,414.16732 167.2644,-33.7714 193.1127,-225.37336 193.1127,-414.16893 h -386.0233 z'
		/>
</g>`),

    colorⵧbackground: '#3876bf',
    colorⵧforeground: '#f3f0ca',
    colorⵧtheme: '#e1aa74',

    styles: [
    	'snippet:natural-box-layout'
    ],

    html: 'TODO',

    scripts: [
    	'snippet:normalize-trailing-slash'
    	// TODO google analytics etc.
    ],

}
