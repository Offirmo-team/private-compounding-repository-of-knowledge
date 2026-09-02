import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import {
	getꓽtitleⵧapp,
	getꓽtitleⵧappⵧshort,
	getꓽtitleⵧlib,
	getꓽcolorⵧbackground,
	getꓽcolorⵧforeground,
	getꓽdirⵧfiles_to_serve,
} from "../selectors/index.ts"
import type { FilesMap, WebPropertySpec } from "../types.ts"
import { ifꓽdebug } from "../utils/debug.ts"

/////////////////////////////////////////////////

const CODE_TEMPLATEⵧGENERIC = `
import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from '@monorepo-private/ts--types'

//import {  } from './types.ts'

/////////////////////////////////////////////////

function some_stuff(): Immutable<string> {
/*function getꓽXYZⵧfoo‿v2(): void {}
ↆfoo ⵧ fetch
ೱfoo ⵧ promise
ϟaꘌb
notᝍbadₓasⳇwell‿noǃ
bar𝝣fooǃfoo𖾚fooᐧbar
 */
	throw new Error('NIMP!')
}

/////////////////////////////////////////////////

export default some_stuff
`.trim()

const CODE_TEMPLATEⵧSERVICESⳇLOGGER = `
import { getLogger } from '@monorepo-private/universal-debug-api--browser'

import { LIB } from '../consts.ts'

/////////////////////////////////////////////////

const logger = getLogger({
	name: LIB,
	//suggestedLevel: 'error',
	//suggestedLevel: 'warn',
	//suggestedLevel: 'verbose',
	suggestedLevel: 'silly',
})

/////////////////////////////////////////////////

export default logger
`.trim()

function genꓽCODE_TEMPLATEⵧSERVICESⳇCHANNEL(spec: Immutable<WebPropertySpec>): string {
	const URLⵧCANONICAL‿str = spec.urlⵧcanonical
	const URLⵧCANONICAL‿url = new URL(URLⵧCANONICAL‿str)

	return `

/////////////////////////////////////////////////

const URLⵧCANONICAL = '${spec.urlⵧcanonical}'

/////////////////////////////////////////////////

// prod = full security and reliability
// staging = close to prod, usually only difference is the data storage = different from prod
// dev = anything else
const CHANNEL = ((): 'prod' | 'staging' | 'dev' => {

	// first weed out obvious dev cases
	if (!window.isSecureContext)                  return 'dev'
	if (window.location.protocol !== 'https:')    return 'dev'
	if (window.location.port)                     return 'dev'

	// then detect common "local" dev setups
	const isꓽlocalhost = ['localhost', 'example', 'test', 'invalid'].some(domain => window.location.hostname.endsWith(domain)) // https://en.wikipedia.org/wiki/.localhost
	if (isꓽlocalhost)                              return 'dev'
	const isꓽtunneledⵧngrok = ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app', '.ngrok.dev'].some(domain => window.location.hostname.endsWith(domain)) // https://ngrok.com/blog-post/new-ngrok-domains
	if (isꓽtunneledⵧngrok)                        return 'dev'
	const isꓽtunneledⵧcloudflare = ['.cfargotunnel.com'].some(domain => window.location.hostname.endsWith(domain)) // https://developers.cloudflare.com/cloudflare-one/faq/cloudflare-tunnels-faq/
	if (isꓽtunneledⵧcloudflare)                   return 'dev'

	// then detect common "hosted" locations, which mean staging
	if (window.location.hostname.endsWith('.netlify.app'))    return 'staging'
	if (window.location.hostname.endsWith('.github.io'))      return 'staging'
	if (window.location.hostname.endsWith('.pages.dev'))      return 'staging' // cloudflare
	if (window.location.hostname.endsWith('.cloudfront.net')) return 'staging' // AWS

	// finally, does it match the expected canonical URL?
	const URLⵧCANONICAL‿obj = new URL(URLⵧCANONICAL)
	if (window.location.hostname === URLⵧCANONICAL‿obj.hostname) return 'prod'

	// TODO cordova
	// TODO itch.io

	// everything else is unknown = unsafe
	return 'dev'
})()

/////////////////////////////////////////////////

export { CHANNEL }
`.trim()
}

const CODE_TEMPLATEⳇINITⳇSECURITY = `
/** Immediate security initializations.
 * This code will be executed immediately when the app starts.
 *
 * We can't ensure full security, but we can try to mitigate some risks.
 * https://owasp.org/www-project-top-ten/
 * - We assume our own code can be compromised (ex. supply chain)
 * - We assume the opener of our page may have injected some js https://krausefx.com//blog/ios-privacy-instagram-and-facebook-can-track-anything-you-do-on-any-website-in-their-in-app-browser
 */
import { getRootSXC } from '@monorepo-private/soft-execution-context'

/////////////////////////////////////////////////

// TODO listen to securitypolicyviolation

// add immediate security actions here
// TODO should happen synchronously inside the HTML!
function initⵧimmediate(): void {
	console.log('%cEnforcing app security…', 'font-style: oblique;')
	// protect against prototype pollution
	// is that really useful?
	// https://www.synopsys.com/blogs/software-security/javascript-security-best-practices.html#6
	Object.freeze(Object.prototype)

	// TODO strip global scope and APIs
	// TODO detect unwanted DOM manipulations
}


// add logs or later security actions here
async function initⵧdeferred() {
	getRootSXC().xTry('init:SXC', ({ logger }) => {
		// ensure we have a CSP
		const allowsꓽunsafe_evals = (() => {
			// https://stackoverflow.com/a/27399739/587407
			try { new Function(''); return true }
			catch (e) { return false }
		})()
		if(allowsꓽunsafe_evals) {
			// this is the first thing a CSP disables...
			logger.error('Content Security Policy is missing! Consider this app unsafe!')
		}

		const isꓽiframe = window.self !== window.top
		if(isꓽiframe) {
			// strictly speaking the web is composable and there is nothing wrong with being an iframe
			// however there are a few attacks...
			// https://web.dev/articles/security-headers#xfo
			logger.warn('Running in an iframe, be cautious!!')
			// since we don't have any iframe-specific feature, let's cut off the connection
			window.parent = window
			window.top = window
		}
	})
}

/////////////////////////////////////////////////

initⵧimmediate()

export default initⵧdeferred
`.trim()

const CODE_TEMPLATEⳇINITⳇLOGGER = `
import logger from '../services/logger.ts'

/////////////////////////////////////////////////

async function init(): Promise<void> {
	console.log(\`🗂 Logger up with level "\${logger.getLevel()}". Reminder to check your dev tools log level!\`)
}

/////////////////////////////////////////////////

export default init
`.trim()

const CODE_TEMPLATEⳇINITⳇSXC = `
import { getRootSXC, decorateWithDetectedEnv } from '@monorepo-private/soft-execution-context--browser'

import { LIB } from '../consts.ts'
import { VERSION } from '../../entry-points/build.ts'
import { CHANNEL } from '../services/channel.ts'
import logger from '../services/logger.ts'

/////////////////////////////////////////////////

async function init(): Promise<void> {
	const rootSXC = getRootSXC()

	decorateWithDetectedEnv(rootSXC)

	rootSXC.setLogicalStack({ module: LIB })

	rootSXC.injectDependencies({
		logger,
		CHANNEL,
		VERSION,
	})

	rootSXC.setAnalyticsAndErrorDetails({
		VERSION,
		CHANNEL,
	})

	rootSXC.xTry('init:SXC', ({ logger, SXC }) => {
		logger.debug('┌ Root SXC is now decorated with a logger ✔')
		logger.debug('├ Root SXC is now decorated with env infos ✔', SXC.getAnalyticsDetails())
		logger.debug('└► Root Soft Execution Context initialized ✔', rootSXC)
	})

	const { ENV } = rootSXC.getInjectedDependencies()
	if (ENV !== process.env.NODE_ENV) {
		logger.error('ENV detection mismatch!', { 'SXC.ENV': ENV, 'process.env.NODE_ENV': process.env.NODE_ENV })
	}
}

/////////////////////////////////////////////////

export default init
`.trim()

const CODE_TEMPLATEⳇINITⳇERRORS = `
import { getRootSXC } from '@monorepo-private/soft-execution-context'
import {	listenToErrorEvents, listenToUnhandledRejections } from '@monorepo-private/soft-execution-context--browser'

/////////////////////////////////////////////////

const STYLES = 'padding: .5em; background-color: red; color: white; font-weight: bold;'

async function init(): Promise<void> {
	const rootSXC = getRootSXC()

	rootSXC.emitter.on('final-error', function onFinalError({ data: {SXC, err, CHANNEL}}) {
		try {
			// this code must be super extra safe!!!
			// don't even use the advanced logger!

			console.group('%cSXC "final-error" event!', STYLES)

			if (CHANNEL === 'dev') {
				console.error('%c↑ error! (no report since dev)', STYLES, {SXC, err})
				return
			}

			//console.log('(this error will be reported)')
			// TODO integrate with Sentry!

			console.groupEnd()
		}
		catch(err) {
			console.log(\`%c RECURSIVE CRASH!!! SXC ERROR HANDLING CAN ABSOLUTELY NOT CRASH!!! FIX THIS!!!\`, STYLES)
			console.log(err)
		}
	})

	listenToErrorEvents()
	listenToUnhandledRejections()

	rootSXC.xTry('init:SXC', ({logger, SXC}) => {
		logger.debug('Root SXC is now decorated with error details ✔', SXC.getErrorDetails())
	})
}

/////////////////////////////////////////////////

export default init
`.trim()

const CODE_TEMPLATEⳇINITⳇVIEWⵧREACT = `
import { Fragment, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { getRootSXC } from '@monorepo-private/soft-execution-context'
import { schedule_when_idle_but_within_human_perception } from '@monorepo-private/utils--async'
import ErrorBoundary from '@monorepo-private/react--error-boundary'

import { LIB } from '../consts.ts'

import Root from '../view'

/////////////////////////////////////////////////

const StrictCheck = StrictMode
//const StrictCheck = Fragment // swap to this if you don't want StrictMode

/////////////////////////////////////////////////

async function init(): Promise<void> {
	schedule_when_idle_but_within_human_perception(() => {
		console.log('🔄 starting view with react…')
		getRootSXC().xTry('view', ({ logger, SXC }) => {
			const root = createRoot(document.getElementById('react-root'))
			root.render(
				<StrictCheck>
					<ErrorBoundary name={\`\${LIB}ᐧroot\`} SXC={SXC}>
						<Root />
					</ErrorBoundary>
				</StrictCheck>
			)
		})
	})
}

/////////////////////////////////////////////////

export default init
`.trim()

const CODE_TEMPLATEⳇINITⳇGENERIC = (feat: string) =>
	`
import { getRootSXC } from '@monorepo-private/soft-execution-context'

/////////////////////////////////////////////////

async function init(): Promise<void> {
	const rootSXC = getRootSXC()

	rootSXC.xTry('init', ({logger, SXC}) => {
		console.log('TODO ${feat}')
	})
}

/////////////////////////////////////////////////

export default init
`.trim()

function generate(spec: Immutable<WebPropertySpec>): FilesMap {
	return {
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/consts.ts`]: `export const LIB = '${getꓽtitleⵧlib(spec)}'`,
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/index.ts`]: `
import { asap_but_out_of_immediate_execution, forArray } from '@monorepo-private/utils--async'
import { VERSION, BUILD_DATE } from '../entry-points/build.ts'
import './init/00-security.ts' // as early as possible, side effects expected

/////////////////////////////////////////////////

console.info(\`%cWelcome to %c${getꓽtitleⵧapp(spec)} %cv\${VERSION}%c\${BUILD_DATE}\`,
	'font-weight: bold;',
	'border-radius: 1em; padding: .1em .5em; margin-inline-end: 1ch; background-color: ${getꓽcolorⵧbackground(spec)}; color: ${getꓽcolorⵧforeground(spec)}; font-weight: bold;',
	'border-radius: 1em; padding: .1em .5em; margin-inline-end: 1ch; background-color: darkgrey;                           color: black;                              font-weight: bold;',
	'border-radius: 1em; padding: .1em .5em; margin-inline-end: 1ch; background-color: darkgrey;                           color: black;',
)

/////////////////////////////////////////////////

asap_but_out_of_immediate_execution(async () => {
	console.log('%c——————— end of immediate, synchronous, non-import code. ———————', "font-weight: bold;")

	const logger = (await import('./services/logger.ts')).default

	// order is important! Timing is non-trivial!
	const inits = await import('./init/*.(js|ts|jsx|tsx)')
	await forArray(Object.keys(inits).sort()).executeSequentially(async (key) => {
		logger.group(\`init/"\${key}"\`)
			logger.trace(\`init/"\${key}"…\`)
			const require = inits[key].js || inits[key].ts || inits[key].jsx || inits[key].tsx
			const exports = await (require().catch(() => require())) // allow 1x retry
			const init_fn = exports.default
			await init_fn()
			logger.trace(\`init/"\${key}": done ✅\`)
		logger.groupEnd()
	})
})
`.trimStart(),

		// service layer
		// ~syncing view with external data sources
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/services/auth.ts`]: CODE_TEMPLATEⵧGENERIC,
		[`${getꓽdirⵧfiles_to_serve(spec)}//app/services/channel.ts`]: genꓽCODE_TEMPLATEⵧSERVICESⳇCHANNEL(spec),
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/services/loader.ts`]: CODE_TEMPLATEⵧGENERIC,
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/services/logger.ts`]: CODE_TEMPLATEⵧSERVICESⳇLOGGER,

		// controllers
		// ~shared state and stateful logic
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/controllers/state--app.tsx`]: CODE_TEMPLATEⵧGENERIC,
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/controllers/flux.tsx`]: CODE_TEMPLATEⵧGENERIC,

		// view
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/view/index.tsx`]: CODE_TEMPLATEⵧGENERIC,

		// init
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/init/00-security.ts`]: CODE_TEMPLATEⳇINITⳇSECURITY,
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/init/01-logger.ts`]: CODE_TEMPLATEⳇINITⳇLOGGER,
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/init/02-sxc.ts`]: CODE_TEMPLATEⳇINITⳇSXC,
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/init/03-errors.ts`]: CODE_TEMPLATEⳇINITⳇERRORS,
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/init/10-loader.tsx`]: CODE_TEMPLATEⳇINITⳇGENERIC("loader"),
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/init/11-flux.tsx`]: CODE_TEMPLATEⳇINITⳇGENERIC("flux"),
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/init/12-view.tsx`]: CODE_TEMPLATEⳇINITⳇVIEWⵧREACT,
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/init/20-auth.ts`]: CODE_TEMPLATEⳇINITⳇGENERIC("auth"),
		[`${getꓽdirⵧfiles_to_serve(spec)}/app/init/30-analytics.ts`]: CODE_TEMPLATEⳇINITⳇGENERIC("analytics"),
	}
}

/////////////////////////////////////////////////

export default generate
