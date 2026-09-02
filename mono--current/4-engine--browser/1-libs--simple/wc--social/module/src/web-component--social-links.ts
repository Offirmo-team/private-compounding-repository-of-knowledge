// @ts-nocheck
////////////////////////////////////

type Theme = "subtle" | "colorful"

const THEMES = {
	default: "subtle",

	subtle: "subtle",
	colorful: "colorful",
}
const DEBUG = false

////////////////////////////////////
// "Social network" data
// icons: https://icongr.am/
// - https://icongr.am/simple        = brand icons https://simpleicons.org/
// - https://icongr.am/fontawesome   https://fontawesome.com/icons
// - https://icongr.am/material      https://mui.com/components/material-icons/

const SOCIAL_NETWORKS_INFO = {
	// key = normalized network

	// special
	unknown: {
		official_name: "", // empty
		official_color‿hex: "#2f4f4f",
		official_color_to_be_used_as: "bg",
		icongram: { pack_id: "material", icon_id: "share-circle" },
		get_url: (handle, network_id) => `https://www.google.com/search?q=${network_id}+${handle}`,
	},
	website: {
		official_name: "Web",
		official_color‿hex: "#f3b100",
		official_color_to_be_used_as: "bg",
		icongram: { pack_id: "fontawesome", icon_id: "home" },
		get_url: (handle, network_id) => {
			throw new Error("No url generation possible for website!")
		},
	},
	email: {
		official_name: "e-mail",
		official_color‿hex: "#34A853",
		official_color_to_be_used_as: "bg",
		icongram: {
			pack_id: "fontawesome",
			icon_id: "envelope",
			//icon_id: 'at',
		},
		get_url: (handle, network_id) => {
			let email = handle.replace("(at)", "@").replace("(dot)", ".").replace("⋅", ".").replace("∙", ".")
			return `mailto:${email}`
		},
	},

	// (alphabetical sort)
	artstation: {
		official_name: "ArtStation", // https://www.artstation.com/about
		official_color‿hex: "#13AFF0",
		official_color_to_be_used_as: "fg",
		icongram: { pack_id: "simple", icon_id: "artstation" },
		get_url: (handle, network_id) => `https://www.artstation.com/${handle.toLowerCase()}`, // https://www.artstation.com/offirmo
	},
	dev: {
		official_name: "DEV", // https://dev.to/about
		official_color‿hex: "#0A0A0A",
		official_color_to_be_used_as: "bg",
		icongram: { pack_id: "simple", icon_id: "devto" },
		//icongram: { pack_id: "material", icon_id: "dev-to" },
		get_url: (handle, network_id) => `https://dev.to/${handle}`, // https://dev.to/offirmo
		/*special_styles: {
			padding: ".1em 0 0 0",
			zoom: "1.1",
		},*/
	},
	facebook: {
		official_name: "Facebook", // https://about.facebook.com/
		official_color‿hex: "#1877F2",
		official_color_to_be_used_as: "bg",
		is_official_color_dark: undefined,
		icongram: { pack_id: "fontawesome", icon_id: "facebook-f" }, // only the f ^
		icongram_alt: { pack_id: "fontawesome", icon_id: "facebook-official" }, // including square
		/*
			also
			simple/facebook (rounded)
			fontawesome/facebook-square (rounded square)
			material/facebook (rounded)
			 */
		get_url: (handle, network_id) => `https://www.facebook.com/${handle}`, // https://www.facebook.com/boringrpg
	},
	github: {
		official_name: "GitHub", // https://github.com/about
		official_color‿hex: "#181717",
		official_color_to_be_used_as: "bg",
		icongram: { pack_id: "simple", icon_id: "github" },
		get_url: (handle, network_id) => `https://github.com/${handle}`, // https://github.com/Offirmo
	},
	"g.dev": {
		official_name: "Google Developer Platform", // https://gumroad.com/about
		official_color‿hex: "#4285F4",
		official_color_to_be_used_as: "bg",
		icongram: { pack_id: "simple", icon_id: "google" },
		get_url: (handle, network_id) => `https://g.dev/${handle}`, // https://g.dev/xyz
	},
	gumroad: {
		official_name: "Gumroad", // https://gumroad.com/about
		official_color‿hex: "#ff90e8",
		official_color_to_be_used_as: "bg",
		icongram: { pack_id: "simple", icon_id: "gumroad" },
		get_url: (handle, network_id) => `https://${handle}.gumroad.com/`, // https://xyz.gumroad.com/
	},
	instagram: {
		official_name: "Instagram", // https://about.instagram.com/
		official_color‿hex: "#E4405F",
		official_color_to_be_used_as: "bg",
		icongram: { pack_id: "simple", icon_id: "instagram" },
		get_url: (handle, network_id) => `https://www.instagram.com/${handle}`, // https://www.instagram.com/offirmo/
	},
	"itch.io": {
		// https://itch.io/press-kit
		official_name: "itch.io", // https://itch.io/docs/general/about
		official_color‿hex: "#FA5C5C",
		official_color_to_be_used_as: "bg",
		icongram: { pack_id: "simple", icon_id: "itchio" },
		get_url: (handle, network_id) => `https://${handle.toLowerCase()}.itch.io/`, // https://offirmo.itch.io/
	},
	linkedin: {
		// https://brand.linkedin.com/policies
		official_name: "LinkedIn",
		official_color‿hex: "#1e66c2",
		official_color_to_be_used_as: "bg",
		icongram: { pack_id: "simple", icon_id: "linkedin" },
		get_url: (handle, network_id) => `https://www.linkedin.com/in/${handle.toLowerCase()}/`,
	},
	"product hunt": {
		// #DA552F
		official_name: "Product Hunt", // https://www.producthunt.com/about  https://www.producthunt.com/branding
		official_color‿hex: "#DA552F",
		official_color_to_be_used_as: "bg",
		icongram: { pack_id: "simple", icon_id: "producthunt" },
		get_url: (handle, network_id) => `https://www.producthunt.com/@${handle}`, // https://www.producthunt.com/@offirmo
	},
	reddit: {
		official_name: "Reddit", // https://www.redditinc.com/
		official_color‿hex: "#FF4500",
		official_color_to_be_used_as: "bg",
		icongram: { pack_id: "simple", icon_id: "reddit" }, // circled
		get_url: (handle, network_id) => `https://www.reddit.com/user/${handle}`, // https://www.reddit.com/user/Offirmo
	},
	twitter: {
		official_name: "Twitter", // https://about.twitter.com/
		official_color‿hex: "#1DA1F2",
		official_color_to_be_used_as: "bg",
		icongram: { pack_id: "simple", icon_id: "twitter" },
		get_url: (handle, network_id) => `https://twitter.com/${handle}`, // https://twitter.com/Offirmo
	},
	patreon: {
		official_name: "Patreon", // https://www.patreon.com/about
		official_color‿hex: "#FF424D",
		official_color_to_be_used_as: "bg",
		// TODO icon is not great, but there is no alternative on icongram
		icongram: { pack_id: "simple", icon_id: "patreon" }, // circled
		get_url: (handle, network_id) => `https://www.patreon.com/${handle.toLowerCase()}`, // https://www.patreon.com/offirmo
	},

	// Social network candidates:
	// https://medium.com/@Offirmo
	// https://www.buymeacoffee.com/offirmo
	// facebook-messenger
	// whatsapp
	// pinterest
	// email
	// discord
	// youtube
}

export { SOCIAL_NETWORKS_INFO, THEMES, renderꓽAuthor }

////////////////////////////////////

if (globalThis.customElements)
	globalThis.customElements.define(
		"offirmoⳆsocial-links",
		class SocialNav extends HTMLElement {
			static get observedAttributes() {
				return ["data-handle", "data-theme"]
			}

			get_debug_id() {
				return `${this.tagName}ⵧ${this.getAttribute("is")}ⵧ${this.getAttribute("data-handle")}`
			}

			constructor() {
				super()
				if (DEBUG) console.log(`[${this.get_debug_id()}].constructor()]:`, { _this: this })
				// TODO should be in "render"?
				this.innerHTML =
					`
<style>
	/* micro reset */
	.offirmoⳆsocial-links   { box-sizing: border-box; }
	.offirmoⳆsocial-links * { box-sizing: inherit; }

	.offirmoⳆsocial-links {
		/* FYI those vars will be programmatically set:
		--offirmoⳆsocial-links∙handle: // from the "handle" property
		--offirmoⳆsocial-links∙theme: '${THEMES.default}'; // from the "theme" property
		--offirmoⳆsocial-links∙color--fg // from current color
		*/
	}

	.offirmoⳆsocial-links ol, .offirmoⳆsocial-links ul {
		margin: 0;
		list-style-type: none;
		padding-inline-start: 0;
		display: inline-flex;
		flex-direction: row;
		vertical-align: middle;
		gap: .5em;
	}

	.offirmoⳆsocial-link {
		display: inline-flex;
		flex-direction: row;
	}

	.offirmoⳆsocial-link∙icon-container {
		aspect-ratio: 1 / 1;
		display: grid;
		place-items: center center;
		padding: .2em;

		/* customized border-radius could go here */

		background-color: var(--offirmoⳆsocial-link∙color--bg, transparent);
	}

	.offirmoⳆsocial-link∙icon {
		align-content: center;
	}
</style>
` + this.innerHTML

				this._schedule_and_debounce_render()
			}

			_schedule_and_debounce_render() {
				const _this = this
				_schedule_and_debounce({
					getter() {
						return _this._SADPromise
					},
					setter(x) {
						_this._SADPromise = x
					},
					callback() {
						_this._render()
					},
				})
			}

			_render() {
				if (DEBUG) console.group(`[${this.get_debug_id()}]: render`, this, { elt: this })

				this.classList.add("offirmoⳆsocial-links")

				let handle = this.getAttribute("data-handle")
				if (handle) {
					this.style.setProperty("--offirmoⳆsocial-links∙handle", handle)
				}

				let theme = this.getAttribute("data-theme") || THEMES.default
				this.style.setProperty("--offirmoⳆsocial-links∙theme", theme)

				// capture the foreground color
				// (note that this doesn't work for bg for unknown reasons)
				const cs = getComputedStyle(this)
				const color = cs.getPropertyValue("color")
				this.style.setProperty("--offirmoⳆsocial-links∙color--fg", color)

				// The child links derive their appearance (theme, handle, fg color) from the
				// CSS variables set above, but they only sample them inside their own JS render.
				// 1) a change here (e.g. data-theme toggled) wouldn't reach them on its own.
				// 2) I'm seeing a bug due to some render coordination
				// Re-render them to propagate it = fix the strange bug
				this.querySelectorAll<HTMLElement & { _schedule_and_debounce_render?: () => void }>(
					'[is="offirmoⳆsocial-link"]',
				).forEach((link) => link._schedule_and_debounce_render?.())

				if (DEBUG) console.groupEnd()
			}

			/* useful only for debug
	connectedCallback() {
		if (DEBUG) console.log(`[${this.tagName}ⵧ${this.getAttribute('is')}].connectedCallback():`, { _this: this })
	}
	disconnectedCallback() {
		if (DEBUG) console.log(`[${this.tagName}ⵧ${this.getAttribute('is')}].disconnectedCallback():`, { _this: this })
	}
	adoptedCallback() {
		if (DEBUG) console.log(`[${this.tagName}ⵧ${this.getAttribute('is')}].adoptedCallback():`, { _this: this })
	}
	*/
			attributeChangedCallback(name, old_value, new_value) {
				if (DEBUG)
					console.log(`[${this.tagName}ⵧ${this.getAttribute("is")}].attributeChangedCallback():`, {
						name,
						old_value,
						new_value,
						_this: this,
					})
				this._schedule_and_debounce_render()
			}
		},
		{ extends: "nav" },
	)

////////////////////////////////////

if (globalThis.customElements)
	globalThis.customElements.define(
		"offirmoⳆsocial-link",
		class SocialLink extends HTMLAnchorElement {
			static get observedAttributes() {
				return ["href", "data-network", "data-handle"]
			}

			get_debug_id() {
				return `${this.tagName}ⵧ${this.getAttribute("is")}ⵧ${this.getAttribute("data-network") || this.getAttribute("href")?.slice(7, 28)}`
			}

			constructor() {
				super()
				if (DEBUG) console.log(`[${this.get_debug_id()}]: constructor`, this, { elt: this })
				this._schedule_and_debounce_render()
			}

			_schedule_and_debounce_render() {
				const _this = this
				_schedule_and_debounce({
					getter() {
						return _this._SADPromise
					},
					setter(x) {
						_this._SADPromise = x
					},
					callback() {
						_this._render()
					},
				})
			}

			get_theme() {
				const cs = getComputedStyle(this)
				const theme = cs.getPropertyValue("--offirmoⳆsocial-links∙theme") || THEMES.default
				/*console.log({
				s: getComputedStyle(this),
				v: getComputedStyle(this).getPropertyValue("--offirmoⳆsocial-links∙theme"),
			})*/
				return theme
			}

			get_icon_color‿hex() {
				const cs = getComputedStyle(this)
				/*console.log("get_icon_color‿hex", {
				fg: cs.getPropertyValue("--offirmoⳆsocial-links∙color--fg"),
				bg: cs.getPropertyValue("--offirmoⳆsocial-links∙color--bg"),
				c: cs.getPropertyValue("color"),
				cc: cs.getPropertyValue("currentColor"),
				//getComputedStyle(this).getPropertyValue('background-color'),
			})*/

				const c = cs.getPropertyValue("--offirmoⳆsocial-links∙color--fg") || cs.getPropertyValue("color")

				return _get_normalized_hex_representation(c)
			}

			get_font_size‿px() {
				return parseInt(getComputedStyle(this).getPropertyValue("font-size"), 10)
			}

			get_network_id() {
				let network_id = _normalize_network_id(this.getAttribute("data-network"))

				const href = this.getAttribute("href")
				if (href) {
					// href has priority if valid
					try {
						const url = new URL(href)
						const candidate_network_id = Object.keys(SOCIAL_NETWORKS_INFO)
							.filter((k) => k !== "website")
							.find((network_id) => {
								const network_sample_url = new URL(SOCIAL_NETWORKS_INFO[network_id].get_url("foo", network_id))
								if (url.protocol !== network_sample_url.protocol) return false
								if (url.hostname === network_sample_url.hostname) return true

								// subdomains
								if ([url.hostname, network_sample_url.hostname].every((s) => s.endsWith(".gumroad.com"))) {
									return true
								}
								if ([url.hostname, network_sample_url.hostname].every((s) => s.endsWith(".itch.io"))) {
									return true
								}

								return false
							})
						if (candidate_network_id) {
							network_id = candidate_network_id
						} else {
							// unrecognized url
							network_id = "website"
						}
						if (DEBUG) console.log(`[${this.get_debug_id()}]: "href" recognized:`, { href, url, network_id })
					} catch (err) {
						console.error(`[${this.get_debug_id()}]: "href" recognition error!`, err)
					}
				}

				if (!network_id) {
					const candidate = _normalize_network_id(this.innerText)
					if (SOCIAL_NETWORKS_INFO[candidate]) network_id = candidate
				}

				if (!network_id) {
					console.error(`[${this.get_debug_id()}]: "network" is missing and couldn't be inferred!`, this, {
						attribute: this.getAttribute("data-network"),
					})
				} else if (!SOCIAL_NETWORKS_INFO[network_id]) {
					console.error(
						`[${this.get_debug_id()}]: unknown social network "${network_id}", will default to google search!`,
						this,
					)
				}

				return network_id
			}

			get_generic_handle() {
				let handle = _normalize_handle(this.getAttribute("data-handle"))

				if (!handle) {
					// TODO review, handle is for building the href, so why bother?
					// extract from URL if available and useful
					if (this.href && this.href.toLowerCase().trim().startsWith("mailto:"))
						handle = _normalize_handle(this.href.toLowerCase().trim().slice(7))
					// TODO more extractions? useful?
				}

				if (!handle) {
					// try to inherit from parent
					handle = _normalize_handle(getComputedStyle(this).getPropertyValue("--offirmoⳆsocial-links∙handle"))
				}

				if (!handle) {
					// not necessarily an issue bc
					// a user may not have secured the same handle across social networks,
					// hence may be using an explicit href
					return undefined
				}

				return handle
			}

			get_expected_href(network_id = this.get_network_id()) {
				const explicit_href = this.getAttribute("href")

				if (network_id === "website") return explicit_href

				// if possible, we regenerate the href from the handle
				// since some network may evolve their URL scheme
				try {
					const handle = this.get_generic_handle()
					if (handle) return _get_network_info(network_id).get_url(handle, network_id)
				} catch (err) {
					console.warn(`[${this.get_debug_id()}]: get_expected_href() error!`, err)
				}

				// we couldn't generate a href
				// this is not necessarily an issue since the user may have provided an explicit href
				if (DEBUG)
					console.info(
						`[${this.get_debug_id()}]: get_expected_href(): couldn't generate, but not necessarily an issue.`,
						this,
					)

				return undefined
			}

			_render() {
				if (DEBUG) console.group(`[${this.get_debug_id()}]: render`, this, { elt: this })

				const network_id = this.get_network_id()
				const expected_href = this.get_expected_href(network_id)
				const is_pointing_to_current_page = (() => {
					const urlⵧcurrent‿obj = new URL(window.location.href)
					const urlⵧexpected‿obj = new URL(this.href || expected_href || "example.local")
					if (urlⵧcurrent‿obj.origin !== urlⵧexpected‿obj.origin) return false
					if (urlⵧcurrent‿obj.pathname !== urlⵧexpected‿obj.pathname) return false

					return true
				})()
				if (is_pointing_to_current_page) {
					// skip this one, no need to point at ourselves
					this.outerHTML = ""
					return
				}

				const network_infos = _get_network_info(network_id)
				const theme = this.get_theme()

				let icongram_params = _get_icongram_params({
					size‿px: this.get_font_size‿px() * 3,
					color‿hex: this.get_icon_color‿hex(),
					network_infos,
					theme,
				})

				if (DEBUG)
					console.log(`[${this.get_debug_id()}]: now rendering with computed params…`, {
						network_id,
						network_infos,
						theme,
						icongram_params,
						expected_href,
						"color--bg": getComputedStyle(this).getPropertyValue("--offirmoⳆsocial-link∙color--bg"),
					})

				this.classList.add(
					"offirmoⳆsocial-link",
					"own-indicator", // for offirmo-framework
				)

				this.target = this.target || "_blank"
				this.rel = this.rel || "noopener,external"
				// beware of infinite loops!
				if (this.href) {
					// href is an input, so replacing href can cause an infinite loop!
					if (this.href === expected_href) {
						// all good!
					} else if (!expected_href) {
						// normal
					} else {
						// conflict!
						// the only accepted case is email obfuscation, and this should only happen once
						if (this.href.startsWith("mailto:")) {
							if (DEBUG) console.log("de-obfuscating email", { href: this.href, expected_href })
							this.href = expected_href
						} else {
							// warn, but explicit has priority
							console.warn(` href conflict!`, {
								existing: this.getAttribute("href"),
								expected: expected_href,
							})
						}
					}
				} else {
					if (!expected_href) {
						console.error(`[${this.get_debug_id()}]: no href could be found nor generated!`, this)
					} else {
						this.href = expected_href
					}
				}

				if (theme === THEMES.colorful) {
					this.style.setProperty(
						"--offirmoⳆsocial-link∙color--bg",
						network_infos.official_color_to_be_used_as === "bg" ? network_infos.official_color‿hex : "black", // the only network with custom color as FG uses black as a background
					)
				} else {
					// reset + transparent is important for offirmo-framework which sets a default bg on images
					this.style.setProperty("--offirmoⳆsocial-link∙color--bg", "transparent")
				}

				// TODO improve alt with CTA
				this.innerHTML = `
<div class="offirmoⳆsocial-link∙icon-container" style="${Object.entries(network_infos.special_styles || {})
					.map(([k, v]) => `${k}: ${v}`)
					.join("; ")}">
	<img class="offirmoⳆsocial-link∙icon o⋄inline" src="${_get_icongram_url(icongram_params)}"
	     alt="Logo of ${network_infos.official_name || network_id}"
	     width="${this.get_font_size‿px()}" height="${this.get_font_size‿px()}"
	     style="background-color: var(--offirmoⳆsocial-link∙color--bg); ${" " /* for Offirmo framework which sets a bg color */}width: ${this.get_font_size‿px()}px;height: ${this.get_font_size‿px()}px;"
	/></div><!-- ${network_infos.official_name || network_id} -->`

				if (DEBUG) console.groupEnd()
			}

			attributeChangedCallback(name, old_value, new_value) {
				if (DEBUG)
					console.log(`[${this.get_debug_id()}]: attributeChangedCallback`, this, {
						name,
						old_value,
						new_value,
						elt: this,
					})
				this._schedule_and_debounce_render()
			}
		},
		{ extends: "a" },
	)

////////////////////////////////////

import type { Author, Html‿str } from "@monorepo-private/ts--types--hypermedia"

function renderꓽAuthor(author: Author, { theme = THEMES.default }: { theme?: Theme } = {}): Html‿str {
	let result: Html‿str = `
<nav is="offirmoⳆsocial-links" data-theme="${theme}">
	<ol>`

	if (author.urlⵧcanonical) {
		result += `
		<li>
			<a is="offirmoⳆsocial-link" target="_blank" href="${author.urlⵧcanonical}">
				website
			</a>
		</li>`
	}

	if (author.email) {
		result += `
		<li>
			<a is="offirmoⳆsocial-link" target="_blank" href="mailto:${author.email}">
				email
			</a>
		</li>`
	}

	if (author.urlsⵧsocial) {
		author.urlsⵧsocial.forEach((url_social) => {
			result += `
		<li>
			<a is="offirmoⳆsocial-link" data-network="${url_social.network}" target="_blank" href="${url_social.url}">
				${url_social.network}
			</a>
		</li>`
		})
	}

	result += `
	</ol>
</nav>`
	return result
}

////////////////////////////////////

function _normalize_network_id(raw_network_id) {
	let network_id = raw_network_id || ""
	network_id = network_id.toLowerCase().trim()

	// allow some synonyms
	switch (network_id) {
		case "dev.to":
			network_id = "dev"
			break
		case "e-mail":
			network_id = "email"
			break
		default:
			break
	}

	return network_id
}

function _get_network_info(network_id) {
	return SOCIAL_NETWORKS_INFO[network_id] ?? SOCIAL_NETWORKS_INFO["unknown"]
}

////////////////////////////////////
// icongram utils
// https://icongr.am/

function _get_icongram_params({ network_infos, theme, size‿px, color‿hex }) {
	let params = {
		size‿px,
		color‿hex,
		...network_infos.icongram,
	}

	// special cases
	if (theme === THEMES.colorful) {
		params = {
			...params,
			color‿hex:
				network_infos.official_color_to_be_used_as === "fg"
					? _get_normalized_hex_representation(network_infos.official_color‿hex)
					: "FFFFFF", // most social icons are white on custom color
		}
	}
	if (theme === THEMES.subtle) {
		if (network_infos.official_name === "Facebook") {
			params = {
				...params,
				...network_infos.icongram_alt,
			}
		}
	}

	return params
}

function _get_icongram_url({
	pack_id = "fontawesome", // 'fontawesome'
	icon_id = "question-circle",
	size‿px = 128,
	color‿hex = "currentColor",
} = {}) {
	return `https://icongr.am/${pack_id}/${icon_id}.svg?size=${size‿px}&color=${color‿hex}`
}

////////////////////////////////////
// misc utils

// without @
function _normalize_handle(raw_handle) {
	raw_handle ??= ""
	let result = raw_handle.trim()

	if (result.startsWith("@")) result = result.slice(1)

	return result
}

// NO "#" included!
// ex. "rbg(128, 255, 3)" -> "80ff03"
function _get_normalized_hex_representation(color) {
	color = color.trim().toLowerCase()
	if (!color) return undefined

	if (color.startsWith("#"))
		switch (color.length) {
			case 7:
				return color.slice(1)
			case 4:
				throw new Error(`_get_normalized_hex_representation(): unhandled format: short hex!`)
			default:
				throw new Error(`_get_normalized_hex_representation(): unhandled hex format "${color}"!`)
		}

	if (color.startsWith("rgb("))
		return color
			.split("(")[1]
			.split(")")[0]
			.split(",")
			.map((s) => parseInt(s, 10))
			.map((n) => n.toString(16))
			.map((s) => s.padStart(2, "0"))
			.join("")

	throw new Error(`_get_normalized_hex_representation(): unhandled format "${color}"!`)
}

// XXX the SAME callback / setter / getter are expected for each call
function _schedule_and_debounce({ callback, getter, setter }) {
	let promise = getter()
	if (promise) {
		// ignore, assuming a callback call is already scheduled
	} else {
		promise = new Promise((resolve, reject) => {
			setTimeout(resolve)
		})
		promise.then(() => {
			setter(null)
			callback()
		})
		setter(promise)
	}
}
