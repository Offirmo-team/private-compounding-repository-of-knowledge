import { assert_from } from "@monorepo-private/assert"
import {
	getꓽUTC_timestamp‿ms,
	getꓽUTC_timestampⵧhuman_readable‿minutes,
	type HumanReadableTimestampUTCMinutes,
} from "@monorepo-private/timestamps"
import type { Immutable } from "@monorepo-private/ts--types"

import { getꓽdirⵧfiles_to_serve } from "../selectors/index.ts"
import type { WebPropertySpec, FilesMap } from "../types.ts"

/////////////////////////////////////////////////

// shields.io "endpoint" badges, served at the property root so a README/dashboard can point at them
// https://shields.io/badges/endpoint-badge
// ex. https://github.com/online-adventures/online-adventures.github.io/tree/master/apps/the-boring-rpg
function generate(spec: Immutable<WebPropertySpec>): FilesMap {
	const dir = getꓽdirⵧfiles_to_serve(spec)

	// TODO wire a real version once available
	const versionⵧdummy = "0.0.0"

	return {
		[`${dir}/build_badge_version.json`]: { content: generateꓽendpoint_badge("version", versionⵧdummy) },
		[`${dir}/build_badge_time.json`]: { content: generateꓽendpoint_badge("build date", getꓽbuild_dateⵧutc(spec)) },
	}
}

// non-deterministic by design (real build time); pin spec.built_at‿tms for stable/reproducible output
function getꓽbuild_dateⵧutc(spec: Immutable<WebPropertySpec>): HumanReadableTimestampUTCMinutes {
	const ǃ = assert_from({ getꓽbuild_dateⵧutc })

	const built_at = new Date(spec.built_at‿tms ?? getꓽUTC_timestamp‿ms())
	ǃ.forⵧparam({ built_at‿tms: spec.built_at‿tms }).require(
		!Number.isNaN(built_at.getTime()),
		`built_at must be a valid epoch timestamp (ms)!`,
	)

	return getꓽUTC_timestampⵧhuman_readable‿minutes(built_at)
}

function generateꓽendpoint_badge(label: string, message: string): string {
	return JSON.stringify({ schemaVersion: 1, label, message })
}

/////////////////////////////////////////////////

export default generate
export { generate }
