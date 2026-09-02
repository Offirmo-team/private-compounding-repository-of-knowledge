#!/usr/bin/env ts-node

import { type Contentⳇweb, type HtmlFileSpec, getꓽhtml‿str } from "@web-property-outfitter/generator--html"

/////////////////////////////////////////////////

const SPEC_WEBCONTENT: Contentⳇweb = {}

const SPEC: HtmlFileSpec = {
	content: SPEC_WEBCONTENT,
}

const html‿str = getꓽhtml‿str(SPEC)
//console.log(html‿str)

/////////////////////////////////////////////////

import * as Prettier from "prettier"
const PRETTIER_OPTIONS = {
	printWidth: 120,
	tabWidth: 3,
	useTabs: true,
	semi: false,
	singleQuote: true,
	jsxSingleQuote: true,
	quoteProps: "consistent",
	arrowParens: "avoid",
} satisfies Partial<Prettier.RequiredOptions>
Prettier.format(html‿str, { ...PRETTIER_OPTIONS, parser: "html" }).then(console.log)
