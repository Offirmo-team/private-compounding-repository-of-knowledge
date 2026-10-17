import { PkgInfosResolver } from "@infinite-monorepo/pkg-infos-resolver"

const resolver = new PkgInfosResolver()
await resolver.ೱall_pending_loaded()

resolver.declareꓽmonorepo_namespace("@monorepo-private")
resolver.declareꓽmonorepo_pkg("@monorepo-private/foo")
resolver.preload("@monorepo-private/foo") // monorepo pkg, does nothing
resolver.preload("@monorepo-private/bar") // monorepo pkg, does nothing

await resolver.ೱall_pending_loaded() // no pb since nothing pending

resolver.preload("pnpm") // delayed bc missing finalized config
resolver.preload("type-fest") // delayed bc missing finalized config

//await resolver.ೱall_pending_loaded() // crash bc blocked forever waiting for finalized config
await resolver.ೱfinalizeꓽcritical_config()
await resolver.ೱall_pending_loaded() // crash bc blocked forever waiting for finalized config

console.log(await resolver.ↆgetꓽpackageᐧjson("pnpm"))
console.log(await resolver.ↆgetꓽpackageᐧjson("type-fest"))
