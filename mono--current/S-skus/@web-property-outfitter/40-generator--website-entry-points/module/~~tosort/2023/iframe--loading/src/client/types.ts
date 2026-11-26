export type CssColor‿str = string

export interface LoaderConfig {
	legend: string
	expected_rsrc_count: number
	bg_color: CssColor‿str
	fg_color: CssColor‿str
	bg_picture: null | [ CSSStyleDeclaration['backgroundImage'], CSSStyleDeclaration['backgroundPositionX'], CSSStyleDeclaration['backgroundPositionY'] ]
}

export interface Loader {
	configure(config: Readonly<Partial<LoaderConfig>>): void
	on_rsrc_loaded(id?: string): void
}
