// https://pnpm.io/settings

/////////////////////////////////////////////////

export function getꓽconfigⵧv11ⵧstrictest() {
	return {
		minimumReleaseAge: 10080, // =1w 1) explicit to enable defaults such as minimumReleaseAgeStrict 2) longer than default
		minimumReleaseAgeIgnoreMissingTime: false,
		minimumReleaseAgeStrict: true,

		trustPolicy: "no-downgrade",

		hoist: false, // too dangerous, hides "phantom dependencies"
		hoistWorkspacePackages: false,
		hoistPattern: [], // override default
		publicHoistPattern: [],
		shamefullyHoist: false,

		// peer deps cause huge mess, we MUST be strict
		autoInstallPeers: false,
		dedupePeers: true,
		strictPeerDependencies: true,

		engineStrict: true,

		ignoreScripts: true,

		verifyDepsBeforeRun: "warn",

		dangerouslyAllowAllBuilds: false,

		savePrefix: "",

		// resolutionMode TODO review

		enablePrePostScripts: false, // INTENTIONAL for better turbo compat

		catalogMode: "strict",
		cleanupUnusedCatalogs: true,
	} as const
}

export function getꓽconfigⵧv11ⵧRECOMMENDED() {
	const config: any = {
		...getꓽconfigⵧv11ⵧstrictest(),
		minimumReleaseAgeIgnoreMissingTime: true, // ignore if no time info
		trustPolicyIgnoreAfter: 129_600, // 3 months

		savePrefix: "^",
		catalogMode: "prefer",

		publicHoistPattern: [
			/////// libs used by every package
			"tslib", // TODO REVIEW if package.json are all auto-generated with correct tslib peer/dev/prod, no need for this hoist

			/////// tools used by every package, very convenient to hoist
			// TypeScript
			//"tsx", // TODO REVIEW 1) may not be best runner 2) do we even need it with type stripping? https://github.com/poppinss/ts-exec?tab=readme-ov-file#-why-ts-exec-exists

			// tools
			"*oxlint*",
			"*oxfmt*",
		],

		packages: [],
		catalog: {
			oxfmt: "^0",
			oxlint: "^0",
		},
	}

	// bug https://github.com/pnpm/pnpm/issues/7312#issuecomment-4932176600
	delete config.shamefullyHoist
	delete config.hoistWorkspacePackages

	return config
}

/////////////////////////////////////////////////
