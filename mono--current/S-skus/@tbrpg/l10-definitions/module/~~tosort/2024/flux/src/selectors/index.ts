import { Immutable } from '@monorepo-private/ts-types'
import { UUID } from '@monorepo-private/uuid'
import { Document } from '@monorepo-private/rich-text-format'
import { Element } from '@tbrpg/definitions'
import { Item } from '@tbrpg/state--inventory'
import { PendingEngagement } from '@oh-my-rpg/state-engagement'
import { AchievementSnapshot } from '@tbrpg/state--progress'
import {
	Adventure,
	State,
	UState,
} from '@tbrpg/state'
import * as selectors from '@tbrpg/state'
import { Action } from '@tbrpg/interfaces'

import { Store } from '../types'
import { get_actions_for_element } from './get_actions'


interface Queries {
	getꓽitem(
		uuid: UUID, state: Immutable<State>
	): Item | null
	appraise_item_value(
		uuid: UUID, state: Immutable<State>
	): number
	appraise_item_power(
		uuid: UUID, state: Immutable<State>
	): number
	find_element(
		uuid: UUID, state: Immutable<State>
	): Immutable<Element> | Immutable<AchievementSnapshot> | null
	get_actions_for_element(
		uuid: UUID, state: Immutable<State>
	): Action[]
	getꓽoldest_pending_flow_engagement(
		state: Immutable<State>
	): { uid: number, $doc: Document, pe: PendingEngagement } | null
	getꓽoldest_pending_non_flow_engagement(
		state: Immutable<State>
	): { uid: number, $doc: Document, pe: PendingEngagement } | null
	getꓽachievements_snapshot(
		state: Immutable<State>
	): Immutable<AchievementSnapshot>[]
	getꓽavailable_energy‿float(
		state: Immutable<State>
	): number
	get_human_time_to_next_energy(
		state: Immutable<State>
	): string
	getꓽachievements_completion(
		state: Immutable<State>
	): [number, number]
	get_last_adventure(
		state: Immutable<State>
	): Immutable<Adventure> | null
	get_recap(
		state: Immutable<State>
	): Document
	is_inventory_full(
		state: Immutable<State>
	): boolean
	getꓽavailable_classes(
		state: Immutable<State>
	): string[]
	// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html
	get_sub_state<K extends keyof UState>(
		key: K, state: Immutable<State>
	): UState[K]
}
function get_queries(store: Store)/*: Queries*/ {
	return {
		getꓽitem(uuid: UUID, state: Immutable<State> = store.get()): Item | null {
			return selectors.getꓽitem(state.u_state, uuid)
		},
		appraise_item_value(uuid: UUID, state: Immutable<State> = store.get()): number {
			return selectors.appraise_item_value(state.u_state, uuid)
		},
		appraise_item_power(uuid: UUID, state: Immutable<State> = store.get()): number {
			return selectors.appraise_item_power(state.u_state, uuid)
		},
		find_element(uuid: UUID, state: Immutable<State> = store.get()): Immutable<Element> | Immutable<AchievementSnapshot> | null {
			return selectors.find_element(state.u_state, uuid)
		},
		get_actions_for_element(uuid: UUID, state: Immutable<State> = store.get()): Action[] {
			return get_actions_for_element(state.u_state, uuid)
		},
		getꓽoldest_pending_flow_engagement(state: Immutable<State> = store.get()): { uid: number, $doc: Document, pe: PendingEngagement } | null {
			return selectors.getꓽoldest_pending_flow_engagement(state.u_state)
		},
		getꓽoldest_pending_non_flow_engagement(state: Immutable<State> = store.get()): { uid: number, $doc: Document, pe: PendingEngagement } | null {
			return selectors.getꓽoldest_pending_non_flow_engagement(state.u_state)
		},
		getꓽachievements_snapshot(state: Immutable<State> = store.get()): Immutable<AchievementSnapshot[]> {
			return selectors.getꓽachievements_snapshot(state.u_state)
		},
		getꓽavailable_energy‿float(state: Immutable<State> = store.get()): number {
			return selectors.getꓽavailable_energy‿float(state.t_state)
		},
		get_human_time_to_next_energy(state: Immutable<State> = store.get()): string {
			return selectors.get_human_time_to_next_energy(state)
		},
		getꓽachievements_completion(state: Immutable<State> = store.get()): [number, number] {
			return selectors.getꓽachievements_completion(state.u_state)
		},
		get_last_adventure(state: Immutable<State> = store.get()): Immutable<Adventure> | null {
			return state.u_state.last_adventure
		},
		get_recap(state: Immutable<State> = store.get()): Document {
			return selectors.get_recap(state.u_state)
		},
		is_inventory_full(state: Immutable<State> = store.get()): boolean {
			return selectors.is_inventory_full(state.u_state)
		},
		getꓽavailable_classes(state: Immutable<State> = store.get()): string[] {
			return selectors.getꓽavailable_classes(state.u_state)
		},
		// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html
		get_sub_state<K extends keyof UState>(key: K, state: Immutable<State> = store.get()): Immutable<UState>[K] {
			return state.u_state[key]
		},
	}
}

export {
	Document,
	get_queries,
}
