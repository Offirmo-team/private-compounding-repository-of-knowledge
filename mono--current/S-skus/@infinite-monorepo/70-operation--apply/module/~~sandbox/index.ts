import { apply } from '@infinite-monorepo/operation--apply'
import path from 'node:path'

/////////////////////////////////////////////////

console.log(`Hi!`)

const OFFIRMO_MONOREPO_ROOT__CURRENT = process.env.OFFIRMO_MONOREPO_ROOT__CURRENT || `~/work/src/x-external/off/offirmo/offirmo-monorepo/stack--current/`

//await apply(OFFIRMO_MONOREPO_ROOT__CURRENT)
//await apply(path.resolve(OFFIRMO_MONOREPO_ROOT__CURRENT, '../stack--imtest'))
//await apply(path.normalize('~/work/src/private/yvem/hello-world--remix--2026/monorepo'))

await apply(path.normalize('~/work/src/x-external/off/offirmo-team/private-compounding-repository-of-knowledge/mono--current/'))
