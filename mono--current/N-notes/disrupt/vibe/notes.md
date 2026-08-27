

# building


## contact


## security

"lock" all APIs, all input/output
securitypolicyviolation

CORS

Do not track


## troubleshooting
- detect ad blocker blocking critical stuff
- detec ad blocker blocking ads


## outbound navigation
- churn prevention
- churn analysis
- security
- visibility
- pre-load
  - 404 prevention by falling back to save on 404 
- detect extensions such as pdf

https://www.linkedin.com/help/linkedin/answer/a1341680/?trk=in_page_learn_more_click


## inbound cleanup
- cleaner URLs
- cleaner analytics
- visibility



## Dev Tools
- debugger = better groups, etc.
- levels


## cache
- auto service worker


## internal nav
- nicer transitions
- full page refresh from time to time
- prefetch on appearance in viewport
- speed stats

https://nextjs.org/learn/dashboard-app/navigating-between-pages#the-link-component



## UI
- header
- footer
- auto dark mode? theming?
- auto "read progress" top bar
- favicon & icons

  	document.addEventListener('scroll', on_viewport_event, { passive: true });
  	return () => {
  		document.removeEventListener('scroll', on_viewport_event);
  	};

## reliability
- refresh
- auto updates
- browser support
- error isolation? (React?)
- 
  window.addEventListener('error', function(evt) {
  // https://developer.mozilla.org/en-US/docs/Web/API/ErrorEvent
  //console.log('DEBUG SXC browser debug: error event', arguments)
  const err = (evt && evt.message === 'Script error.')
  ? new Error('Unreadable error from another origin!')
  : evt.error || new Error(`Error "${evt.message}" from "${evt.filename}", line ${evt.lineno}.${evt.colno}!`)

  		on_error(err, 'browser/onError')

  		//evt.preventDefault() // XXX should we?
  	})

  	window.addEventListener('unhandledrejection', function(evt) {
  		// https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
  		//console.log('DEBUG SXC browser debug: onunhandledrejection', arguments)
  		//console.log(evt.reason)
  		const err = evt.reason || new Error('Error: uncaught promise rejection!')

  		on_error(err, 'browser/unhandled rejection')
  	})

+ console.error and warn

## cookie
- erk but complimentary


## eval
- go through the site
- higher level "is it up?"
- checks
  - domain
  - security
    - CSP
  - 

## building
- my high level site builder
- in-browser helper?


## hosting



# marketing

"drop in"

augmentation vs baked-in

patents?

snowflake



# TOSORT

sell them as modules on figma / x / wordpress / relume / canva ? 

3p JavaScript https://nextjs.org/learn/pages-router/assets-metadata-css-third-party-javascript


// https://developer.mozilla.org/en-US/docs/Web/Events/pointerover
function onꓽpointer_over(evt: WindowEventMap['pointerover']) {
if (DEBUG) console.info(`[${LIB}] pointer event`, { evt, type: evt.pointerType, pointerType: evt.pointerType })

	switch(evt.pointerType) {
		case 'touch':
			if (DEBUG) console.info(`[${LIB}] seen touch usage!`)
			has_seenꓽtouch_usage = true
			break

		case 'pen':
			break

		case 'mouse':
			// not reliable, Safari iOs emulates mouse hover
			break

		default:
			break
	}

	window.removeEventListener('pointerover', onꓽpointer_over)
}
window.addEventListener('pointerover', onꓽpointer_over)

URL cleanup
- ex. youtube = https://www.youtube-nocookie.com/embed/Xdkkux6OxfM?autoplay=1&state=1

search? https://orama.com/product
