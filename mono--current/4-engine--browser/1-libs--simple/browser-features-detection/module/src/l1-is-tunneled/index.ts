/** Use case: inferring the environment dev/staging/prod */

/////////////////////////////////////////////////

function isꓽtunneled(currentWindow = window): boolean {
	const isꓽtunneledⵧngrok = [".ngrok-free.app", ".ngrok-free.dev", ".ngrok.app", ".ngrok.dev"].some((domain) =>
		currentWindow.location.hostname.endsWith(domain),
	) // https://ngrok.com/blog-post/new-ngrok-domains
	if (isꓽtunneledⵧngrok) return true

	const isꓽtunneledⵧcloudflare = [".cfargotunnel.com"].some((domain) =>
		currentWindow.location.hostname.endsWith(domain),
	) // https://developers.cloudflare.com/cloudflare-one/faq/cloudflare-tunnels-faq/
	if (isꓽtunneledⵧcloudflare) return true

	return false // AFAWK
}

/////////////////////////////////////////////////

export { isꓽtunneled }
