// more a demo use case, not a real test

import { type ValueInputSpec, type SelectOneInputSpec } from "../index.ts"

/////////////////////////////////////////////////

type RichTextType = string

const ActionRenameAvatar = {
	type: "rename-avatar",

	new_name: {
		kind: "value",

		prompt: `What's your name, hero?`,
		placeholder: `Your hero's new name`,

		type: "string",

		//default_value?: T, No possible default in this case
		normalizers: [
			"strⳇnormalize_unicode",
			"strⳇcoerce_toꓽascii",
			"strⳇcoerce_delimiters_to_space",
			"strⳇcoerce_blanks_to_single_spaces",
			"strⳇcaseⵧto_lower",
			"strⳇcapitalizeⵧwords",
			"strⳇtrim",
		],
		validators: {
			strⳇlengthⵧmin: {
				params: 1,
				msgⵧinvalid: "Your name must be at least 1 character long.",
				evidence: "obvious",
			},
			strⳇlengthⵧmax: {
				params: 24,
				msgⵧinvalid: "Your name must be no more than 24 characters long.",
				evidence: "obvious",
			},
		},

		_hints__extra: {
			suggestion_generator_id: "avatar_name",
		},
	} satisfies ValueInputSpec<string, RichTextType>,
}

type Klass = "warrior" | "mage" | "rogue" | "cleric" | "druid"
const ActionSwitchClass = {
	type: "switch-class",

	new_klass: {
		kind: "selectⵧone",
		//input_type:

		prompt: `Choose your path wisely`,
		placeholder: "Your new class", // most likely no need, it's a select, but who knows...

		//default_value?: T, no need
		//normalizers: no need
		//validators: no need

		options: {
			warrior: {},
			mage: {},
			rogue: {},
			cleric: {},
			druid: {},
		},

		_hints__extra: {
			suggestion_generator_id: "klassⵧleast_used_in_server",
		},
	} satisfies SelectOneInputSpec<Klass, RichTextType>,
}
