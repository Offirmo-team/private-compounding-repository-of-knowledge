/** Use case: inferring the environment dev/staging/prod */

/////////////////////////////////////////////////

function isꓽlocalhost(currentWindow = window): boolean {
	return [
		// https://en.wikipedia.org/wiki/Localhost
		"127.0.0.1",
		"[::1]",
		"::1",

		// https://en.wikipedia.org/wiki/.localhost
		"localhost",
		"example",
		"test",
		"invalid",

		"local", // seen https://github.com/peterldowns/localias
	].some((domain) => currentWindow.location.hostname.endsWith(domain))
}

/////////////////////////////////////////////////

export { isꓽlocalhost }
