function generateꓽhtml**head**style(spec: Immutable<WebPropertySpec>): Html‿str { // TODO
https://medium.com/@stephenbunch/how-to-make-a-scrollable-container-with-dynamic-height-using-flexbox-5914a26ae336 //
TODO https://developer.chrome.com/blog/overscroll-behavior/

    const css_blocks: Css‿str[] = [
    		...(spec.content?.critical?.css || []),
    		...getꓽfeatures(spec).reduce((acc, feature_id: FeatureSnippets) => {
    			switch (feature_id) {
    				case 'cssⳇbox-layout--natural':
    					acc.push(snippetꓽcssⳇcssⳇboxᝍlayoutⵧnatural)
    					break
    				case 'cssⳇviewport--full':
    					acc.push(snippetꓽcssⳇviewportⵧfull)
    					break
    				default:
    					// This feature does not have a critical CSS component
    					break
    			}
    			return acc
    		}, [] as Css‿str[]),
    	]
    	.filter(css => {
    		assert(!css.trim().startsWith('npm:'))
    		return true;
    	})

}

function generateꓽhtml**head**script(spec: Immutable<WebPropertySpec>): Html‿str {

    const JS_blocks: JS‿str[] = [
    	...(spec.content?.critical?.js || []),
    	...getꓽfeatures(spec).reduce((acc, feature_id: FeatureSnippets) => {
    		let snippet: JS‿str | undefined;
    		switch (feature_id) {
    			case 'normalize-url-trailing-slash':
    				snippet = String(snippetꓽjsⳇnormalizeᝍtrailingᝍslash)
    				break
    			default:
    				// This feature does not have a critical JS component
    				break
    		}
    		if (snippet) {
    			assert(snippet.startsWith('function '), `All critical JS snippets should be a named function! (${snippet})}`)
    			acc.push(`;(${snippet})()`)
    		}
    		return acc
    	}, [] as JS‿str[]),
    ]

    return `

<script>/////// critical JS ///////
	${JS_blocks.join(EOL)}
</script>

` }

function generateꓽhtml**head**meta(spec: Immutable<WebPropertySpec>): Html‿str { const metas = getꓽmetas(spec) const
links = \_generateꓽlinks(spec)

    // TODO escape all content for attributes!! https://www.liquid-technologies.com/Reference/Glossary/XML_EscapingData.html

    return [
    	// should be first!
    	// https://github.com/h5bp/html5-boilerplate/blob/main/docs/html.md#the-order-of-the-title-and-meta-tags
    	`<meta charset="${metas.charset}" />`,

    	...Object.keys(metas.document)
    		.filter(name => _hasꓽcontent(metas.document, name))
    		.sort()
    		.map(name => {
    			// @ts-ignore
    			let content = metas.document[name]
    			switch(name) {
    				case 'viewport':
    					content = _stringifyꓽmetaⵧviewport__content(content)
    					break
    				default:
    					break
    			}
    			assert(typeof content === 'string' && !!content, `document meta "${name}" should be a non-empty string: "${content}"!`)
    			return `<meta name="${name}" content="${content}">`
    		}),

    	...Object.keys(metas.pragmas)
    		.filter(httpᝍequiv => _hasꓽcontent(metas.pragmas, httpᝍequiv))
    		.sort()
    		.map(httpᝍequiv => {
    			// @ts-ignore
    			let content = metas.pragmas[httpᝍequiv]
    			switch(httpᝍequiv) {
    				// TODO stringify
    				default:
    					break
    			}
    			// TODO assertions
    			return `<meta http-equiv="${httpᝍequiv}" content="${content}">`
    		}),

    	...Object.keys(metas.properties)
    		.filter(property => _hasꓽcontent(metas.properties, property))
    		.sort()
    		.map(property => {
    			// @ts-ignore
    			let content = metas.properties[property]
    			switch(property) {
    				// TODO stringify
    				default:
    					break
    			}
    			// TODO assertions
    			return `<meta property="${property}" content="${content}">`
    		}),

    	...Object.keys(links)
    		.filter(rel => _hasꓽcontent(links, rel))
    		.sort()
    		.map(rel => {
    			// @ts-ignore
    			let href = links[rel]
    			// TODO assertions
    			return `<link rel="${rel}" href="${href}">`
    		}),
    	].join(EOL)

}

function generateꓽhtml\_\_head(spec: Immutable<WebPropertySpec>): Html‿str { //
https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML return `

<head>
	${generateꓽhtml__head__meta(spec)}

    <title>${ifꓽdebug(spec).prefixꓽwith(`[title--page]`, getꓽtitleⵧpage(spec))}</title>

    ${generateꓽhtml__head__style(spec)}

    ${generateꓽhtml__head__script(spec)}

</head>
`
}

function generateꓽhtml\_\_body(spec: Immutable<WebPropertySpec>): Html‿str {

    // TODO extract HTML from files? ./esm/parser-html.mjsxxx
    const html_blocks: Html‿str[] = [
    	...(spec.content?.html || []),
    	...getꓽfeatures(spec).reduce((acc, feature_id: FeatureSnippets) => {
    		switch (feature_id) {
    			case 'htmlⳇreact-root':
    				acc.push(snippetꓽhtmlⳇreact_root(spec))
    				break
    			default:
    				// This feature does not have a html component
    				break
    		}
    		return acc
    	}, [] as Html‿str[]),
    ]

    // TODO review import from js?
    const css_blocks: Css‿str[] = [
    	...(spec.content?.critical?.css || []),
    	...getꓽfeatures(spec).reduce((acc, feature_id: FeatureSnippets) => {
    		switch (feature_id) {
    			case 'cssⳇfoundation--offirmo':
    				acc.push(`@import '@monorepo-private/css--foundation';`)
    				break
    			case 'cssⳇframework--offirmo':
    				acc.push(`@import '@monorepo-private/css--framework';`)
    				break
    			default:
    				// This feature does not have a body CSS component
    				break
    		}
    		return acc
    	}, [] as Css‿str[]),
    ]

    const js_blocks: JS‿str[] = [
    	...(spec.content?.js || []),
    	...getꓽfeatures(spec).reduce((acc, feature_id: FeatureSnippets) => {
    		let snippet: JS‿str | undefined;
    		switch (feature_id) {
    			default:
    				// This feature does not have a body JS component
    				break
    		}
    		if (snippet) {
    			assert(snippet.startsWith('function '), `All snippets should be a named fuction! (${snippet})}`)
    			acc.push(`;(${snippet})()`)
    		}
    		return acc
    	}, [] as JS‿str[]),
    ].map(js‿str => {
    	if (js‿str.endsWith('.ts') || js‿str.endsWith('.jsx') || js‿str.endsWith('.ts') || js‿str.endsWith('.tsx'))
    		return `import '${js‿str}'`
    	return js‿str
    })

    if (html_blocks.length === 0) {
    	html_blocks.push(snippetꓽhtmlⳇcontentⵧauto(spec))
    }

    if (js_blocks.length === 0) {
    	js_blocks.push(`console.log('Hello, world!')`)
    }
    else {
    	html_blocks.unshift(`<noscript>You need to enable JavaScript to run this app.</noscript>`)
    }
