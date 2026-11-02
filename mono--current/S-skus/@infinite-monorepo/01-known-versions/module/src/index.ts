/////////////////////////////////////////////////

export const KNOWN_VERSIONS = {
	Ubuntu: {
		// https://ubuntu.com/about/release-cycle https://releases.ubuntu.com/
		// [ ] NEXT: most likely Apr 2028
		LTS: 26,
	},
	"Node.js": {
		// https://github.com/nodejs/release#release-schedule
		// [ ] NEXT: 2027-10-20 active LTS start 27 (new schedule: from v27, every major becomes LTS)
		LTS: 26,
	},
	pnpm: {
		// https://pnpm.io/blog
		// [ ] NEXT: 12 rust rewrite
		recommended: 11,
	},
} as const

export const NODE_MAJOR_VERSION = KNOWN_VERSIONS["Node.js"].LTS // for convenience

/////////////////////////////////////////////////
