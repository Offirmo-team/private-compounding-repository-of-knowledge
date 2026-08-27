import { defineConfig } from "oxfmt"

export default defineConfig({
	sortImports: {
		groups: [
			["style"],
			["value-builtin", "type-builtin"],
			["value-external", "type-external"],
			["value-internal", "type-internal"],
			["value-parent", "type-parent"],
			["value-sibling", "type-sibling"],
			["value-index", "type-index"],
			"unknown",
		],
		internalPattern: ["@monorepo", "@monorepo-private"],
	},
	sortPackageJson: {
		sortScripts: true,
	},

	ignorePatterns: ["N-notes/", "Z-tosort/", "~~*/", "inactive/", "x-inactive/"],

	// non-defaults

	printWidth: 120,
	proseWrap: "always",

	jsdoc: true,
	semi: false,

	overrides: [
		{
			files: ["**/*.jsonc"],
			options: {
				trailingComma: "none",
			},
		},
		{
			files: ["**/*.md"],
			options: {
				printWidth: 120,
			},
		},
	],
})
