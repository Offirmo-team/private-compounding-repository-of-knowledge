/////////////////////////////////////////////////
// https://semver.org/
// https://www.npmjs.com/package/@types/semver?activeTab=code
// specifier / specification /  constraint / range / requirement

export type SemVerⳇLoose = string

export type SemVerⳇExact = string // ex. 1.2.3
export type SemVerⳇRange = `^${SemVerⳇExact}` | `~${SemVerⳇExact}` | (SemVerⳇExact & {})

export type SemVer = // unclear, try not to use?
	SemVerⳇExact | SemVerⳇRange

// https://developers.cloudflare.com/workers/configuration/compatibility-dates/
export type CompatibilityDate = YYYYᝍMMᝍDD

// LTS
// latest

/*
export type MajorVersionRequirement =
	| SemVerⳇLoose
	| 'lts'
	| CompatibilityDate // equivalent
*/

/////////////////////////////////////////////////

// SPDX license expression syntax version 2.0 string
// https://spdx.org/licenses/
// https://spdx.dev/learn/handling-license-info/
export type SoftwareLicense‿SPDX = string

// TODO refine, license to what? is it a license to REUSE (as in npm package.json)?
// ALSO spdx is for Software!
//license: License‿SPDX | License‿SPDX[] | undefined // https://spdx.org/licenses/ undef = unknown :-(

/////////////////////////////////////////////////

// WARNING Ideally DO NOT USE!!! use dedicated sub-settings instead! cf. https://seanconnolly.dev/dont-be-fooled-by-node-env
// (keeping it as it's useful as a shortcut to infer sub-settings)
// BEWARE of conflating different concepts:
// - env vs. build! cf. https://seanconnolly.dev/dont-be-fooled-by-node-env
// - env vs. release channel, ex. prod with slower "monthly" release channel (aka. "release tracks") https://support.google.com/chrome/a/answer/9027636?hl=en
// - env SPEC vs ACTUAL, ex production could be = prod, prod-cn (usually different laws), FedRAMP (isolated env for security reasons)
// (Add new envs only if they differ from existing ones)
export type UNSAFE_Environment =
	//                 verbose?  assertions?  optims?  use canonical?  sends user analytics?  newest features?  Fully supported w/ backups?
	| "prod" //         ✘          ✘           ✔        ✔               ✔                     ✘                  ✔
	| "staging" //      ✘          ✘           ✔        ✘               ✘                     ✔                  ✘
	| "dev" //          ✔          ✔           ✘        ✘               ✘                     ✔                  ✘
//	| 'test' //         ✔          ✔           ✘        ✘               ✘                     ✔                  -
// staging? https://www.linkedin.com/pulse/staging-environments-inefficient-relic-past-julien-danjou-
// staging = who maintain it?
// staging can slow you down https://www.linkedin.com/posts/enzoa_staging-can-slow-you-down-here-is-how-to-activity-7120787524377014273-slXZ

/////////////////////////////////////////////////

// XXX only applies to Software! TODO review
//version?: SemVer
//changelog?: Url‿str
//source?: Url‿str // if relevant

/////////////////////////////////////////////////

import type { YYYYᝍMMᝍDD } from "../l1-dates/index.ts"
