/////////////////////////////////////////////////

interface DisplayOptions {
	eol: "" | "\n" | "\r\n" // what should be used for EOL. '' (empty string) = no line return
	max_width‿charcount: number // max width before need to wrap NOT IMPLEMENTED TODO
	//outline: boolean // add a strong separator at top and bottom so that it stands out    NOT IMPLEMENTED TODO
	indent_size‿charcount: number // how many spaces to use for indentation
	max_primitive_str_size: null | number // NOT IMPLEMENTED TODO
	should_recognize_constants: boolean
	should_recognize_globals: boolean
	should_sort_keys: boolean
	should_compact_objects: boolean // if true, will attempt to compact simpler objects on a single line as long as they fit
	should_warn_not_json: boolean // if true, will print in red if not JSON
	quote: "'" | '"'
	date_serialization_fn: string
}

interface StylizeOptions {
	stylizeꓽdim: (s: string) => string
	stylizeꓽsuspicious: (s: string) => string
	stylizeꓽerror: (s: string) => string
	stylizeꓽglobal: (s: string) => string
	stylizeꓽprimitive: (s: string) => string
	stylizeꓽsyntax: (s: string) => string
	stylizeꓽuser: (s: string) => string
}

interface PrettifyOptions {
	can_throw: boolean

	prettifyꓽstring: (x: string, st: State) => string
	prettifyꓽnumber: (x: number, st: State) => string
	prettifyꓽbigint: (x: bigint, st: State) => string
	prettifyꓽboolean: (x: boolean, st: State) => string
	prettifyꓽundefined: (x: undefined, st: State) => string
	prettifyꓽsymbol: (x: symbol, st: State) => string

	prettifyꓽnull: (st: State) => string
	prettifyꓽfunction: (x: Function, st: State, ox?: { as_prop?: boolean }) => string
	prettifyꓽarray: (x: Array<any>, st: State) => string[]
	prettifyꓽobjectⵧkeyⳇvalue: (obj: Object, st: State) => string[]
	prettifyꓽobject: (x: Object, st: State, ox?: { display_constructor?: boolean }) => string[]

	prettifyꓽproperty__name: (x: string | number | symbol, st: State) => string

	prettifyꓽany: (a: any, st: State) => string[]
}

type Options = DisplayOptions & StylizeOptions & PrettifyOptions

interface State {
	o: Options

	indent_string: string // optim/convenience
	indent_levelⵧcurrent: number
	remaining_width‿charcount: number
	indent_levelⵧmax: number
	isꓽjson: boolean

	// TODO depth limit (useful for debug)

	circular: WeakSet<object>
}

/////////////////////////////////////////////////

export { type DisplayOptions, type StylizeOptions, type PrettifyOptions, type Options, type State }
