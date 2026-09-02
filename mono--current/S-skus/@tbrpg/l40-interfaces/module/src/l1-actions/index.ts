import { type PendingEngagementUId } from "@oh-my-rpg/state--engagement"
import {
	type State,
	type StartSessionParams,
	type AcknowledgeEngagementMsgSeenParams,
	type EquipItemParams,
	type SellItemParams,
} from "@tbrpg/state"
import { CharacterClass } from "@tbrpg/state--character"
import { Enum } from "typescript-string-enums"

import { type TimestampUTCMs } from "@monorepo-private/timestamps"
import type { Immutable } from "@monorepo-private/ts--types"
import {
	type BaseReducerAction,
	createꓽaction__base,
	createꓽaction,
	ACTION_TYPEꘌUPDATE_TO_NOW,
	type ActionUpdateToNow,
	createꓽactionꘌupdate_to_now,
	ACTION_TYPEꘌNOOP,
	type ActionNoop,
	createꓽactionꘌnoop,
	ACTION_TYPEꘌHACK,
	type ActionHack_,
	createꓽactionꘌhack,
	ACTION_TYPEꘌSET,
	type ActionSet_,
	createꓽactionꘌset,
} from "@monorepo-private/ts--types--hypermedia"
import { type UUID } from "@monorepo-private/uuid"

/////////////////////////////////////////////////

export const ActionType = Enum(
	"play",
	"equip_item",
	"sell_item",
	"rename_avatar",
	"switch_class",

	"redeem_code",

	"re_seed",
	"on_start_session",
	"on_logged_in_refresh",
	"acknowledge_engagement_msg_seen",
	ACTION_TYPEꘌUPDATE_TO_NOW,

	ACTION_TYPEꘌNOOP,
	ACTION_TYPEꘌSET,
	ACTION_TYPEꘌHACK,
)
export type ActionType = Enum<typeof ActionType> // eslint-disable-line no-redeclare

/////////////////////////////////////////////////

interface ActionPlay extends BaseReducerAction {
	type: (typeof ActionType)["play"]
}

interface ActionEquipItem extends BaseReducerAction, EquipItemParams {
	type: (typeof ActionType)["equip_item"]
}

interface ActionSellItem extends BaseReducerAction, SellItemParams {
	type: (typeof ActionType)["sell_item"]
}

interface ActionRenameAvatar extends BaseReducerAction {
	type: (typeof ActionType)["rename_avatar"]
	new_name: string
}

interface ActionSwitchClass extends BaseReducerAction {
	type: (typeof ActionType)["switch_class"]
	new_class: CharacterClass
}

interface ActionRedeemCode extends BaseReducerAction {
	type: (typeof ActionType)["redeem_code"]
	code: string
}

interface ActionReSeed extends BaseReducerAction {
	type: (typeof ActionType)["re_seed"]
	seed: number
}

interface ActionStartSession extends BaseReducerAction, StartSessionParams {
	type: (typeof ActionType)["on_start_session"]
}

interface ActionRefreshLoggedInInfos extends BaseReducerAction {
	type: (typeof ActionType)["on_logged_in_refresh"]
	is_logged_in: boolean
	roles: string[]
}

interface ActionAcknowledgeEngagementMsgSeen extends BaseReducerAction, AcknowledgeEngagementMsgSeenParams {
	type: (typeof ActionType)["acknowledge_engagement_msg_seen"]
	uids: Array<PendingEngagementUId>
}

type ActionSet = ActionSet_<State>
type ActionHack = ActionHack_<State>

export type TBRPGAction =
	| ActionPlay
	| ActionEquipItem
	| ActionSellItem
	| ActionRenameAvatar
	| ActionSwitchClass
	| ActionRedeemCode
	| ActionReSeed
	| ActionStartSession
	| ActionRefreshLoggedInInfos
	| ActionAcknowledgeEngagementMsgSeen
	| ActionUpdateToNow
	| ActionNoop
	| ActionSet
	| ActionHack

/////////////////////////////////////////////////

// needed for some validations
function getꓽaction_types(): string[] {
	return Enum.keys(ActionType)
}

/////////////////////////////////////////////////

export {
	type ActionPlay,
	type ActionEquipItem,
	type ActionSellItem,
	type ActionRenameAvatar,
	type ActionSwitchClass,
	type ActionRedeemCode,
	type ActionReSeed,
	type ActionStartSession,
	type ActionRefreshLoggedInInfos,
	type ActionAcknowledgeEngagementMsgSeen,
	type ActionUpdateToNow,
	type ActionNoop,
	type ActionSet,
	type ActionHack,
	getꓽaction_types,

	// for convenience
	createꓽaction,
}
