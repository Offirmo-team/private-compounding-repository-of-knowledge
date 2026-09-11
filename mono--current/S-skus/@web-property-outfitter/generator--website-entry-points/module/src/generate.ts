/////////////////////////////////////////////////

export function getꓽwebᝍpropertyᝍbundle(spec: Immutable<WebPropertySpec>): WebPropertyBundle {
	const ǃ = assert_from({ getꓽwebᝍpropertyᝍbundle })

	ǃ.forⵧparam({ spec__isꓽcatching_all_routes: spec.isꓽcatching_all_routes }).require(
		!(spec.isꓽcatching_all_routes && spec.host === "github-pages"),
		`GitHub Pages does not support SPA routing — isꓽcatching_all_routes cannot be true with host='github-pages'`,
	)

	const serve_me‿relpath = SpecLib.getꓽdirⵧfiles_to_serve(spec)

	const files: FilesMap = {
		...generateꓽhtml(spec),
		...generateꓽicons(spec),
		...generateꓽwell_known(spec),
		...generateꓽmisc_root_files(spec),
		...generateꓽbuild_badges(spec),

		// PWA
		...(SpecLib.needsꓽwebmanifest(spec) && {
			[`${serve_me‿relpath}/${SpecLib.getꓽbasenameⵧwebmanifest(spec)}`]: {
				content: JSON.stringify(generateꓽwebmanifest(spec), undefined, "	"),
			},
		}),

		// JS SRC
		...(SpecLib.shouldꓽgenerateꓽjscode(spec) && generateꓽsource_code(spec)),

		// meta
		"~~logs/spec.json": { content: JSON.stringify(spec, undefined, "	") },
		"~~logs/selectors.json": {
			content: JSON.stringify({
				getꓽlang: SpecLib.getꓽlang(spec),
				getꓽauthor__name: SpecLib.getꓽauthor__name(spec),
				getꓽauthor__contact: SpecLib.getꓽauthor__contact(spec),
				getꓽauthor__intro: SpecLib.getꓽauthor__intro(spec),
				getꓽcontactⵧhuman: SpecLib.getꓽcontactⵧhuman(spec),
				getꓽcontactⵧsecurity: SpecLib.getꓽcontactⵧsecurity(spec),
				getꓽcontactⵧsupport: SpecLib.getꓽcontactⵧsupport(spec),
				isꓽdebug: SpecLib.isꓽdebug(spec),
				getꓽENV: SpecLib.getꓽENV(spec),
				isꓽprod: SpecLib.isꓽprod(spec),
				isꓽpublic: SpecLib.isꓽpublic(spec),
				shouldꓽgenerateꓽjscode: SpecLib.shouldꓽgenerateꓽjscode(spec),
				getꓽdirⵧoutput_root: SpecLib.getꓽdirⵧoutput_root(spec),
				getꓽdirⵧfiles_to_serve: SpecLib.getꓽdirⵧfiles_to_serve(spec),
				wantsꓽinstall: SpecLib.wantsꓽinstall(spec),
				hasꓽown_navigation: SpecLib.hasꓽown_navigation(spec),
				isꓽuser_scalable: SpecLib.isꓽuser_scalable(spec),
				needsꓽwebmanifest: SpecLib.needsꓽwebmanifest(spec),
				supportsꓽscreensⵧwith_shape: SpecLib.supportsꓽscreensⵧwith_shape(spec),
				canꓽuse_window_controls_overlay: SpecLib.canꓽuse_window_controls_overlay(spec),
				usesꓽpull_to_refresh: SpecLib.usesꓽpull_to_refresh(spec),
				prefersꓽorientation: SpecLib.prefersꓽorientation(spec),
				getꓽfeatures: SpecLib.getꓽfeatures(spec),
				getꓽtitleⵧpage: SpecLib.getꓽtitleⵧpage(spec),
				getꓽtitleⵧsocial: SpecLib.getꓽtitleⵧsocial(spec),
				getꓽtitleⵧapp: SpecLib.getꓽtitleⵧapp(spec),
				getꓽtitleⵧappⵧshort: SpecLib.getꓽtitleⵧappⵧshort(spec),
				getꓽtitleⵧlib: SpecLib.getꓽtitleⵧlib(spec),
				getꓽdescriptionⵧpage: SpecLib.getꓽdescriptionⵧpage(spec),
				getꓽcolorⵧforeground: SpecLib.getꓽcolorⵧforeground(spec),
				getꓽcolorⵧbackground: SpecLib.getꓽcolorⵧbackground(spec),
				getꓽcolorⵧtheme: SpecLib.getꓽcolorⵧtheme(spec),
				getꓽbasenameⵧindexᐧhtml: SpecLib.getꓽbasenameⵧindexᐧhtml(spec),
				getꓽbasenameⵧcontactᐧhtml: SpecLib.getꓽbasenameⵧcontactᐧhtml(spec),
				getꓽbasenameⵧerrorᐧhtml: SpecLib.getꓽbasenameⵧerrorᐧhtml(spec),
				getꓽbasenameⵧaboutᐧhtml: SpecLib.getꓽbasenameⵧaboutᐧhtml(spec),
				getꓽbasenameⵧterms_and_conditionsᐧhtml: SpecLib.getꓽbasenameⵧterms_and_conditionsᐧhtml(spec),
				getꓽbasenameⵧprivacy_policyᐧhtml: SpecLib.getꓽbasenameⵧprivacy_policyᐧhtml(spec),
				getꓽbasenameⵧsupportᐧhtml: SpecLib.getꓽbasenameⵧsupportᐧhtml(spec),
				getꓽbasenameⵧwebmanifest: SpecLib.getꓽbasenameⵧwebmanifest(spec),
				getꓽiconⵧemoji: SpecLib.getꓽiconⵧemoji(spec),
				getꓽicon__sizes: SpecLib.getꓽicon__sizes(spec),
			}),
		},
	}

	// final aggreg
	files[nodeꓽpath.join(serve_me‿relpath, "_served_inventory.json")] = {
		content: JSON.stringify(
			(() => {
				return Object.entries(files).reduce(
					(acc, [path, _]) => {
						if (path.startsWith(serve_me‿relpath)) {
							const served_path = nodeꓽpath.relative(serve_me‿relpath, path)
							acc[served_path] = {
								// TODO 1D extra props as needed
								// e.g. caching, debug...
							}
						}

						return acc
					},
					{} as Record<PathⳇRelative, {}>,
				)
			})(),
		),
	}

	return {
		files,
		meta: {
			serve_me‿relpath,
			spec: spec as WebPropertySpec,
		},
	}
}

/////////////////////////////////////////////////

// convenience only.
// real consumers will want to subset on boundary/serve_me
export async function writeꓽwebᝍpropertyᝍfiles(
	bundle: Immutable<WebPropertyBundle>,
	targetDir: PathⳇAbsolute,
): Promise<void> {
	await ೱwriteꓽfile_map(bundle.files, targetDir, { rm: true })
}

/////////////////////////////////////////////////
import * as nodeꓽpath from "node:path"

import * as SpecLib from "@web-property-outfitter/spec"

import { assert_from, assert } from "@monorepo-private/assert"
import { ೱwriteꓽfile_map } from "@monorepo-private/fs--better-write-file" // for convenience
import type { Immutable, PathⳇAbsolute, PathⳇRelative } from "@monorepo-private/ts--types"

import generateꓽbuild_badges from "./generate--build-badges/index.ts"
import generateꓽhtml from "./generate--html/index.ts"
import generateꓽicons from "./generate--icons/index.ts"
import generateꓽmisc_root_files from "./generate--misc-root-files/index.ts"
import generateꓽsource_code from "./generate--src/index.ts"
import generateꓽwebmanifest from "./generate--webmanifest/index.ts"
import generateꓽwell_known from "./generate--well-known/index.ts"
import type { FilesMap, WebPropertyBundle, WebPropertySpec } from "./types.ts"
