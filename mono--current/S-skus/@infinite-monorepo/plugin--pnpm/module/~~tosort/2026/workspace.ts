// https://pnpm.io/settings


export const SETTINGSⵧv10ⵧSTRICTEST = {
	// strictest 2025/10 pnpm 10
	hoist: false,
	hoistWorkspacePackages: false,
	autoInstallPeers: false,
	strictPeerDependencies: true,
	resolvePeersFromWorkspaceRoot: false,
	strictDepBuilds: true,
	preferWorkspacePackages: true, // avoid some attacks
	savePrefix: "", // safer
	saveWorkspaceProtocol: "rolling",
	disallowWorkspaceCycles: true,
	resolutionMode: "time-based",
	catalogMode: "strict",
	minimumReleaseAge: 10080, // https://pnpm.io/supply-chain-security
}
