import { poll, type Options } from "@monorepo-private/poll"

function pollꓽWindowVariable(varname: string, options: Partial<Options> = {}) {
	options = {
		debugId: `window.${varname}`,
		...options,
	}
	return poll(() => (window as any)[varname], options)
}

export default pollꓽWindowVariable
export { poll, type Options } // for convenience
