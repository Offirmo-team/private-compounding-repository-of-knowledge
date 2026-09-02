/////////////////////////////////////////////////

export const KNOWN_VERSIONS = {
	Ubuntu: {
		// https://ubuntu.com/about/release-cycle https://releases.ubuntu.com/
		// [ ] NEXT: most likely Apr 2028
		LTS: 26,
	},
	"Node.js": {
		// https://github.com/nodejs/release#release-schedule
		// [ ] NEXT: 2026-10-28 active LTS start 26
		LTS: 24,
	},
	pnpm: {
		// https://pnpm.io/blog
		// [ ] NEXT: 12 rust rewrite
		recommended: 11,
	},
} as const

export const NODE_MAJOR_VERSION = KNOWN_VERSIONS["Node.js"].LTS // for convenience

/////////////////////////////////////////////////
