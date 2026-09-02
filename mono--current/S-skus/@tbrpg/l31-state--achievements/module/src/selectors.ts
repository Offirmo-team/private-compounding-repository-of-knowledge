import type { Immutable } from "@monorepo-private/ts--types"

import { type State, AchievementStatus } from "./types.ts"

/////////////////////

function getꓽlast_known_achievement_status(state: Immutable<State>, key: string): AchievementStatus | undefined {
	return state.achievements[key]
}

function isꓽachievement_already_unlocked(state: Immutable<State>, key: string): boolean {
	return Object.hasOwn(state.achievements, key) ? state.achievements[key] === AchievementStatus.unlocked : false
}
/////////////////////

export { getꓽlast_known_achievement_status, isꓽachievement_already_unlocked }
