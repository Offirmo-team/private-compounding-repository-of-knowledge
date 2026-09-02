import { Enum } from 'typescript-string-enums'


// TODO tips? Should they be here?-	'tip--first_play',
// TODO suggest changing name
// TODO suggest changing class

// TODO inventory full
// TODO suggest optimizing equipment

const EngagementTemplateKey = Enum(

	'code_redemptionⵧfailed',
	'code_redemptionⵧsucceeded',

	// meta
	'reborn',
)
type EngagementTemplateKey = Enum<typeof EngagementTemplateKey> // eslint-disable-line no-redeclare

export {
	EngagementTemplateKey,
}
