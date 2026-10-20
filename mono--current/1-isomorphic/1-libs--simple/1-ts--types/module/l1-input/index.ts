/* Generic, semantic declaration of a value that is needed from the user
 * inspired by <input> https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
 * Ex. Action "rename player"
 * requiring a "string", length >= n, no multiline, not already taken, ascii only etc.
 *
 * TODO full review of this together with
 *  - html forms
 *  - zod
 *  - JSON schema
 * and extract all the best practices (incl. i18n)
 */

/////////////////////////////////////////////////
// SPEC
// MUST be JSON so that it can be passed across client/server through hypermedia (wire)
// MUST be as semantic as possible and not imply a certain implementation

// OPTIONAL hint to improve the input experience
// Or even AUTOFILL the input when possible
// inspired by https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types
// underlying primitive is free to use or ignore
// can be used for both validation and normalization
export type InputType =
	// TODO semantic or technical???
	// from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types
	//| 'text' // A single-line text field. Line-breaks are automatically removed from the input value. TODO shouldn't that be the default??
	//| 'checkbox' // = confirmation
	// technical
	| "string" // any string (default, not recommended)
	| "string--line" // A single-line text field. Line-breaks are automatically removed from the input value.
	| "string--email"
	| "string--url"
	| "string--url--http"
	| "string--password"
	| "number" // any number (not recommended)
	| "number--integer--timestamp--utc--ms"
	// useful for selecting an installer or an app store
	| "env--os" // can be autopopulated
	| "env--arch" // can be autopopulated
// TODO more types as needed.
// TODO inspired by HTML5 input types try to use https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types as much as possible
// TODO inspired by https://legacy.reactjs.org/docs/typechecking-with-proptypes.html
// TODO inspired by schemas https://standardschema.dev/

export type StringNormalizationStepId =
	//| 'strⳇnormalize_unicode' // no, default
	| "strⳇtrim" // should also be default and opt-out
	| "strⳇcoerce_toꓽascii"
	| "strⳇcapitalizeⵧwords"
	| "strⳇcaseⵧto_lower"
	| "strⳇcaseⵧto_upper"
	| "strⳇcoerce_blanks_to_single_spaces"
	| "strⳇremove_all_spaces"
	| "strⳇcoerce_delimiters_to_space"

export type NormalizationStepId = StringNormalizationStepId | string

export type StringValidatorId = "strⳇlengthⵧmin" | "strⳇlengthⵧmax"
// ex. could add password requirements https://www.latrobe.edu.au/staff/passwords/reset-password-guidelines

export type ValidatorId = StringValidatorId | string

// GENERIC version
// everything needed for an <input>
// Note: the primitive is free to ignore some params if not needed/supported
interface BaseInputSpec<T, RichTextType> {
	type?: InputType // overarching hint, may imply everything else: messaging, normalizers and validators...

	// messaging
	prompt?: RichTextType | string // optional bc sometimes the input name itself is enough
	placeholder?: RichTextType | string

	//
	normalizers?: NormalizationStepId[] // order matters
	validators?: {
		[id: ValidatorId]: {
			params?: any // depending on the validator TODO should be k/v ?
			msgⵧvalid?: RichTextType | string // override. the validator will provide defaults if not provided
			msgⵧinvalid?: RichTextType | string // override. the validator will provide defaults if not provided
			evidence?:
				// undef = no display at first, then display valid or invalid when sth is entered
				| "obvious" // means no need to display it when valid, would be noise https://www.merriam-webster.com/thesaurus/obvious
				| "obscure" // means need to display even if valid or not yet anything entered as the user needs to be clearly warned, ex. pwd requirements https://www.merriam-webster.com/thesaurus/obscure#thesaurus-entry-1-2
		}
	}

	// hints XXX TODO isn't everything a hint??
	// Everything should be validated on the server anyway!
	hidden?: boolean // if true, the input is not shown/requested to the user, implies a default/autopopulated value
	advanced?: boolean // if true, the input is only shown/requested to the user on their explicit request. implies a good, safe default/autopopulated value
	// extensibility point for any other hints we may want to provide
	// not already covered above.
	// Use sparingly.
	// If semantic, try to update the spec itself.
	_hints__extra?: {
		valueⵧgenerator__id?: string // ex. 'avatar_name' would auto generate names on demand

		[k: string]: any
	}
}

/////////////////////////////////////////////////

export interface ValueInputSpec<T, RichTextType> extends BaseInputSpec<T, RichTextType> {
	kind: "value"

	valueⵧdefault?: T // ~suggested/recommended

	// TODO review
	// this prevent us from making a long-term spec?
	// or is it? easy to derive one at the end
	valueⵧcurrent?: T // useful in case [intent = change] to discourage using the same value or move it last in UI
}

// everything needed for a <select>
// Note: the primitive is free to ignore some params if not needed/supported
export interface SelectOneInputSpec<T, RichTextType> extends BaseInputSpec<T, RichTextType> {
	kind: "selectⵧone"

	options: {
		// Choices should be displayed following key insertion order.
		// key will be used as display if none provided.
		[key: string]: {
			value?: T // if not provided, will use key as value
			cta?: RichTextType | string // if not provided, will use key as display, capitalized
		}
	}
}

export interface SelectMultipleInputSpec<T, RichTextType> extends BaseInputSpec<Array<T>, RichTextType> {
	kind: "selectⵧmultiple"

	max_choices?: number // absent/undef = as many as wanted, negative = max choices - n

	options: {
		// Choices should be displayed following key insertion order.
		// key will be used as display if none provided.
		[key: string]: {
			value?: T // if not provided, will use key as value
			cta?: RichTextType | string // if not provided, will use key as display, capitalized
		}
	}
}

export type InputSpec<T, RichTextType> =
	| ValueInputSpec<T, RichTextType>
	| SelectOneInputSpec<T, RichTextType>
	| SelectMultipleInputSpec<T, RichTextType>

/////////////////////////////////////////////////
// RESOLVED
// = derives from InputSpec
// = the stuff that will be passed to a UI primitive
// = no longer JSON

export type InputNormalizer<T> = (raw: any) => T // raw is most likely string

export type InputValidator<T, RichTextType> = (value: T) => Promise<
	[
		// Promise so that can use server, ex. check if name already taken
		boolean, // pass or not
		RichTextType | string, // feedback msg. Should follow the result. Can be empty for 'pass' case = don't display anything. Useful for obvious stuff such as length > 0
	]
>

/*
export interface InputParams<T, RichTextType> {
	input_type?: InputSpec<T, RichTextType>['input_type']
	prompt: InputSpec<T, RichTextType>['prompt']
	default_value?: T,
	placeholder?: RichTextType | string,
	normalizer?: NormalizationStepId[]
	validators?: {
		[id: ValidatorId]: {
			params?: any
			msgⵧvalid?: RichTextType | string // if absent, means no need to display it when valid
			msgⵧinvalid: RichTextType | string
		}
	}
}
*/
