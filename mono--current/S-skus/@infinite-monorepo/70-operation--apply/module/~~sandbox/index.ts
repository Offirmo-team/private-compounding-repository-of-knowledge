import { apply } from '@infinite-monorepo/operation--apply'
import path from 'node:path'

/////////////////////////////////////////////////

console.log(`Hi!`)

//const THIS_MONOREPO_ROOT__CURRENT = process.env.MONOREPO_ROOT__CURRENT || `~/work/src/x-external/off/offirmo/offirmo-monorepo/stack--current/`
//await apply(THIS_MONOREPO_ROOT__CURRENT)
//await apply(path.resolve(THIS_MONOREPO_ROOT__CURRENT, '../stack--imtest'))

await apply(path.normalize('~/work/src/x-external/off/offirmo-team/private-compounding-repository-of-knowledge/mono--current/'))
