import { ElementType } from "@tbrpg/definitions"
import {
	getꓽlast_known_achievement_status,
	type AchievementDefinition,
	AchievementStatus,
	type AchievementSnapshot,
} from "@tbrpg/state--achievements"

import { type Immutable } from "@monorepo-private/ts--types"

import ACHIEVEMENT_DEFINITIONS from "../data/achievements.ts"
import type { UState } from "../types.ts"

/////////////////////////////////////////////////

function getꓽachievement_snapshot(
	u_state: Immutable<UState>,
	definition: Immutable<AchievementDefinition<UState>>,
): AchievementSnapshot {
	const { session_uuid, name, icon, description, lore, getꓽcompletion_rate } = definition

	// we check this and not getꓽstatus since unlock is "sticky" (by design) and getꓽstatus may not be
	const status = getꓽlast_known_achievement_status(u_state.progress, name)

	return {
		uuid: session_uuid,
		element_type: ElementType.achievement_snapshot,
		name,
		icon,
		description,
		...(!!lore && { lore }),
		status: status!,
		completion_rate: getꓽcompletion_rate ? getꓽcompletion_rate(u_state) : undefined,
	} satisfies AchievementSnapshot
}

function getꓽachievement_snapshot_by_temporary_id(
	u_state: Immutable<UState>,
	temporary_id: string,
): ReturnType<typeof getꓽachievement_snapshot> {
	const definition = ACHIEVEMENT_DEFINITIONS.find((d) => d.session_uuid === temporary_id)
	if (!definition) throw new Error(`No achievement definition found for temporary_id "${temporary_id}"!`)

	return getꓽachievement_snapshot(u_state, definition)
}

function getꓽachievements_snapshot(u_state: Immutable<UState>): ReturnType<typeof getꓽachievement_snapshot>[] {
	return ACHIEVEMENT_DEFINITIONS.map((definition: AchievementDefinition<UState>): AchievementSnapshot => {
		return getꓽachievement_snapshot(u_state, definition)
	}).filter((as) => as.status !== AchievementStatus.secret)
}

function getꓽachievements__completion_rate(u_state: Immutable<UState>): [number, number] {
	const snapshot = getꓽachievements_snapshot(u_state)
	const unlocked_ach_count = snapshot.filter((as) => as.status === AchievementStatus.unlocked).length

	return [unlocked_ach_count, snapshot.length]
}

/////////////////////////////////////////////////

export {
	getꓽachievement_snapshot,
	getꓽachievement_snapshot_by_temporary_id,
	getꓽachievements_snapshot,
	getꓽachievements__completion_rate,
}
