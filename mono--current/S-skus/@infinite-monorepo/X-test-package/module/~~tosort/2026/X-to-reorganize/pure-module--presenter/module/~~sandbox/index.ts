import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync, renameSync } from 'node:fs'

/////////////////////////////////////////////////

const __dirname = path.dirname(fileURLToPath(import.meta.url))
//console.log({ __dirname })

/////////////////////////////////////////////////

import { lsDirsSync } from '@monorepo-private/fs--ls'
import { PkgInfosResolver } from '@infinite-monorepo/pkg-infos-resolver'
import { getꓽpackage_details } from '@infinite-monorepo/pkg-analyzer'
import { present } from '@monorepo-private/pure-module--presenter'

const pkg_infos_resolver = new PkgInfosResolver()

const PURE_MODULE__DETAILS: Record<string, PureModuleDetails> = {}

async function refresh_pure_module(pure_module_path: string) {
	console.log('---------------------------------------')
	const pure_module_abspath = path.resolve(__dirname, pure_module_path)
	const pkg_details = await getꓽpackage_details(
		pure_module_abspath,
		{
			indent: '   ',
			pkg_infos_resolver,
		},
	)
	console.log(pkg_details)

	PURE_MODULE__DETAILS[pkg_details.fqname] = pkg_details

	await present({
		indent: '   ',

		pure_module_path,
		pkg_details,

		//dest_dir: path.resolve(__dirname, 'output'),
		//dest_dir: path.resolve(__dirname, '../../../../1-stdlib/timestamps/'),
		dest_dir: path.dirname(pure_module_abspath),

		ts__config__path: path.resolve(__dirname, '../../../../tsconfig.json'),
		ts__custom_types__path: path.resolve(__dirname, '../../../../typescript-custom-typings'),

		pkg_infos_resolver,
	})
}


// xxx to replace with bolt utils
async function convert_and_refresh_pure_modules(parent_path: string) {
	const dirs = lsDirsSync(path.resolve(__dirname, parent_path), { full_path: true })
		.filter(p => !p.includes('~~'))

	for (const dir of dirs) {
		if (!existsSync(path.resolve(__dirname, dir, 'module'))) {
			renameSync(path.resolve(__dirname, dir, 'src'), path.resolve(__dirname, dir, 'module'))
		}
		await refresh_pure_module(dir + '/module/')
	}
}

/////////////////////////////////////////////////



//await refresh_pure_module( '../../../../../0-meta/build-tools/pkg-infos-resolver/module/')
//await refresh_pure_module( '../../../../../0-meta/build-tools/pure-module--analyzer/module/')
//await refresh_pure_module( '../../../../../0-meta/build-tools/pure-module--presenter/module/')

//await convert_and_refresh_pure_modules('../../../../../1-stdlib/')
//await refresh_pure_module( '../../../../../1-stdlib/timestamps/module/')

//await convert_and_refresh_pure_modules('../../../../../2-foundation/')
//await refresh_pure_module( '../../../../../2-foundation/prettify-any/module/')

//await convert_and_refresh_pure_modules('../../../../../3-advanced/')
//await convert_and_refresh_pure_modules('../../../../../3-advanced--multi/')
//await convert_and_refresh_pure_modules('../../../../../3-advanced--browser/')
//await convert_and_refresh_pure_modules('../../../../../3-advanced--node/')

//await convert_and_refresh_pure_modules('../../../../../4-tools/')

await convert_and_refresh_pure_modules('../../../../../5-incubator/active/')

//await convert_and_refresh_pure_modules('../../../../../9-rpg/')

//await convert_and_refresh_pure_modules('../../../../../A-apps--core/the-boring-rpg/')
