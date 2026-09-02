import type { Meta‿v3, Story‿v3 } from "@monorepo-private/storypad"

import { renderꓽAuthor } from "./web-component--social-links.ts"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
	parameters: {
		layout: "centered",
	},
	decorators: [
		(story) => {
			void import("./web-component--social-links.ts")
			console.groupEnd()
			console.groupEnd()
			console.groupEnd()
			return story
		},
	],
} satisfies Meta‿v3

/////////////////////////////////////////////////

import { AUTHOR as AUTHORⳇCREATOR } from "@monorepo-private/marketing--creator"
//import { AUTHOR as AUTHORⳇPRO } from "@monorepo-private/marketing--pro"
//import { AUTHOR as AUTHORⳇWEB3 } from "@monorepo-private/marketing--web3"
import type { Author } from "@monorepo-private/ts--types--hypermedia"

function Component({ author }: { author: Author }) {
	return (
		<nav is="offirmoⳆsocial-links" data-theme="subtle">
			<ol>
				{author.urlⵧcanonical && (
					<li key="website">
						<a is="offirmoⳆsocial-link" target="_blank" href={author.urlⵧcanonical}>
							website
						</a>
					</li>
				)}
				{author.email && (
					<li key="email">
						<a is="offirmoⳆsocial-link" target="_blank" href={`mailto:${author.email}`}>
							email
						</a>
					</li>
				)}
				{author.urlsⵧsocial &&
					author.urlsⵧsocial.map((url_social) => {
						return (
							<li key={url_social.network}>
								<a
									is="offirmoⳆsocial-link"
									data-network={url_social.network}
									target="_blank"
									href={url_social.url}
								>
									{url_social.network}
								</a>
							</li>
						)
					})}
			</ol>
		</nav>
	)
}

/*
export const BiggerWithOffirmoFramework: Story‿v3 = {
	render: () => {
		return (
			<div style={{ fontSize: "32px" }}>
				<Component author={AUTHORⳇPRO} />
			</div>
		)
	},
	decorators: [
		(story) => {
			import("@monorepo-private/css--foundation")
			return story
		},
	],
}
export const MarketingⳇPro: Story‿v3 = {
	render: () => renderꓽAuthor(AUTHORⳇPRO),
}
export const MarketingⳇProⵧBigger: Story‿v3 = {
	render: () => `<div style="font-size: 32px">${renderꓽAuthor(AUTHORⳇPRO)}</div>`,
}
export const MarketingⳇProⵧColorful: Story‿v3 = {
	render: () => `<div style="font-size: 32px">${renderꓽAuthor(AUTHORⳇPRO, { theme: "colorful" })}</div>`,
}*/

export const MarketingⳇCreator: Story‿v3 = {
	render: () => {
		return <Component author={AUTHORⳇCREATOR} />
	},
}
/*
export const MarketingⳇWeb3: Story‿v3 = {
	render: () => {
		return <Component author={AUTHORⳇWEB3} />
	},
}*/

export const AlbertWeandDefault: Story‿v3 = {
	render: () => `
<nav is="offirmoⳆsocial-links" data-handle="aweand">
	<strong>Albert Weand</strong>: digital artist, main author
	<ul>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://www.artstation.com/aweand">ArtStation</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://twitter.com/alweandart">twitter</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://www.instagram.com/albertweand">Instagram</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://www.facebook.com/alweandart">facebook</a></li>
	</ul>
</nav>
	`,
}

export const AlbertWeandColorful: Story‿v3 = {
	render: () => `
<nav is="offirmoⳆsocial-links" data-handle="aweand" data-theme="colorful">
	<strong>Albert Weand</strong>: digital artist, main author
	<ul>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://www.artstation.com/aweand">ArtStation</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://twitter.com/alweandart">twitter</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://www.instagram.com/albertweand">Instagram</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://www.facebook.com/alweandart">facebook</a></li>
	</ul>
</nav>
	`,
}

// explicit links
export const OffirmoColorful: Story‿v3 = {
	render: () => `
<nav is="offirmoⳆsocial-links" data-handle="Offirmo" data-theme="colorful">
	Follow us on:
	<ol>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="mailto:offirmo(dot)net(at)gmail.com">email</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://www.reddit.com/user/Offirmo">Reddit</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://github.com/Offirmo">GitHub</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://dev.to/offirmo">dev.to</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://twitter.com/Offirmo">twitter</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://www.artstation.com/offirmo">ArtStation</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://www.instagram.com/offirmo/">Instagram</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://www.patreon.com/offirmo">Patreon</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://www.offirmo.net">website</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://offirmo.itch.io/">itch.io</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://www.producthunt.com/@Offirmo">Product Hunt</a></li>
		<li><a is="offirmoⳆsocial-link" target="_blank" href="https://www.facebook.com/boringrpg">facebook</a></li>
	</ol>
</nav>
	`,
}

// auto links
export const OffirmoColorfulAutolinks: Story‿v3 = {
	render: () => `
<nav is="offirmoⳆsocial-links" data-handle="Offirmo" data-theme="colorful">
	Follow us on:
	<ol>
		<li><a is="offirmoⳆsocial-link" data-network="reddit" style="color: green;"></a></li>
		<li><a is="offirmoⳆsocial-link" data-network="Product Hunt"></a></li>
		<li><a is="offirmoⳆsocial-link" data-network="twitter"></a></li>
		<li><a is="offirmoⳆsocial-link" data-network="facebook" data-handle="boringrpg"></a></li>
		<li><a is="offirmoⳆsocial-link" data-network="dev.to"></a></li>
		<li><a is="offirmoⳆsocial-link" data-network="itch.io"></a></li>
		<li><a is="offirmoⳆsocial-link" data-network="github"></a></li>
		<li><a is="offirmoⳆsocial-link" data-network="instagram"></a></li>
		<li><a is="offirmoⳆsocial-link" data-network="patreon"></a></li>
		<li><a is="offirmoⳆsocial-link" data-network="artstation"></a></li>
		<li><a is="offirmoⳆsocial-link" data-network="foo"></a></li>
	</ol>
</nav>
	`,
}
export const OffirmoDouble: Story‿v3 = {
	render: () => `
<nav is="offirmoⳆsocial-links" default_handle="Offirmo">
	<ol>
		<li><a is="offirmoⳆsocial-link" href="https://www.reddit.com/user/Offirmo"></a></li>
		<li><a is="offirmoⳆsocial-link" href="">Product Hunt</a></li>
		<li><a is="offirmoⳆsocial-link" href="">twitter</a></li>
		<li><a is="offirmoⳆsocial-link" href="" data-handle="boringrpg">facebook</a></li>
		<li><a is="offirmoⳆsocial-link" href="">dev.to</a></li>
		<li><a is="offirmoⳆsocial-link" href="">itch.io</a></li>
		<li><a is="offirmoⳆsocial-link" href="">github</a></li>
		<li><a is="offirmoⳆsocial-link" href="">instagram</a></li>
		<li><a is="offirmoⳆsocial-link" href="">patreon</a></li>
		<li><a is="offirmoⳆsocial-link" href="">artstation</a></li>
	</ol>
</nav>

<nav is="contribute-links" default_handle="Offirmo">
	<ol>
		<li><a is="offirmoⳆsocial-link" data-network="buy me a coffee">buy me a coffee</a></li>
		<li><a is="offirmoⳆsocial-link" data-network="Patreon">Patreon</a></li>
		<li><a is="offirmoⳆsocial-link" data-network="ko-fi.com">ko-fi.com</a></li>
	</ol>
</nav>
	`,
}
