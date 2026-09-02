// https://en.wikipedia.org/wiki/IETF_language_tag
// https://en.wikipedia.org/wiki/ISO_639-1
// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
// https://www.w3.org/International/articles/language-tags/
export type IETFLanguageType = string

export type Charset = string

export type TimeZone = string // https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

export interface I18nMessages {
	[k: string]: string | I18nMessages
}
