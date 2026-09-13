/////////////////////////////////////////////////

export class PkgInfosResolver {
	#state: Immutable<StateLib.State> = StateLib.create()

	/////////////////////////////////////////////////

	preload(pkg_name: string): void {
		this.#state = StateLib.preload_if_npm(this.#state, pkg_name)
	}

	hasꓽasync_operations__pending(): boolean {
		return StateLib.getꓽall_pending_async(this.#state).length > 0
	}

	async ೱall_pending_loaded(): Promise<void> {
		await Promise.allSettled(StateLib.getꓽall_pending_async(this.#state))
		this.#state = StateLib.processꓽresolved_pending_async(this.#state)
	}

	declareꓽmonorepo_pkg(pkg_name: PkgFQName): void {
		this.#state = StateLib.declareꓽmonorepo_pkg(this.#state, pkg_name)
	}
	declareꓽmonorepo_namespace(ns: PkgNamespace): void {
		this.#state = StateLib.declareꓽmonorepo_namespace(this.#state, ns)
	}
	declareꓽversion_override(pkg_name: PkgFQName, version: SemVerⳇRange): void {
		this.#state = StateLib.declareꓽversion_override(this.#state, pkg_name, version)
	}

	ǃgetꓽversionⵧfor_dependencies_field(pkg_name: PkgFQName) {
		return StateLib.ǃgetꓽversionⵧfor_dependencies_field(this.#state, pkg_name)
	}

	async ↆgetꓽpackageᐧjson(pkg_name: string): Promise<PackageJson> {
		this.preload(pkg_name) // just in case, harmless to call several times
		await this.ೱall_pending_loaded() // simpler

		return StateLib.ǃgetꓽlatest_known_packageᐧjson(this.#state, pkg_name)
	}

	async ↆgetꓽextra_typings_pkg_name_if_any_for(pkg_name: string): Promise<string | undefined> {
		if (isꓽtypes_pkg(pkg_name)) return undefined

		if (StateLib.isꓽmonorepo_package(this.#state, pkg_name)) {
			return undefined
		}

		return await this.ↆgetꓽpackageᐧjson(pkg_name).then((packageᐧjson) => {
			if (packageᐧjson._types_package_json) {
				return packageᐧjson._types_package_json.name
			}
			return undefined
		})
	}

	/////////////////////////////////////////////////

	inject(packageᐧjson: PackageJson, { force = false } = {}): void {
		this.#state = StateLib.set(this.#state, packageᐧjson, { force })
	}

	add_catalog_entry(pkg_name: PkgFQName, catalog_name: string = "default"): void {
		this.#state = StateLib.add_catalog_entry(this.#state, pkg_name, catalog_name)
	}

	get_catalogꘌdefault(): Catalog {
		return StateLib.getꓽcatalog(this.#state)
	}
}

export type * from "./state/types.ts"

/////////////////////////////////////////////////

import type { Immutable, SemVerⳇRange } from "@monorepo-private/ts--types"

import * as StateLib from "./state/index.ts"
import type { PkgFQName, PkgNamespace, PackageJson, Catalog } from "./state/types.ts"
import { isꓽtypes_pkg } from "./state/utils--npm.ts"
