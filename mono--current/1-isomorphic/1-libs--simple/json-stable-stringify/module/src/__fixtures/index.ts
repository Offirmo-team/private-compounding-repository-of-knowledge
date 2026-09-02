const X = {
	primitives: {
		string: ["foo", "42", ""],
		number: [
			42,
			0.05,
			0,
			-0,
			0.0,
			-1 / 3,
			NaN,
			+Infinity,
			-Infinity,
			Math.PI,
			Math.E,
			Number.EPSILON,
			Number.MAX_VALUE,
			Number.MIN_VALUE,
			Number.MAX_SAFE_INTEGER,
			Number.MIN_SAFE_INTEGER,
			0xdeadbeef,
			0b1001,
			0.12e3,
		],
		bigint: [9007199254740991n, BigInt(Number.MAX_SAFE_INTEGER)],
		boolean: [true, false],
		undefined: [undefined],
		symbol: [Symbol(), Symbol("key"), Symbol("key")],
	},
	"non-primitives": {
		null: [null],
		arrays: {
			"elements being primitive types": [["foo", "bar", 42, Symbol("key")]],
			"elements being non-primitive types": [[() => {}, { foo: "bar" }]],
			"with depth": [[[0], [1, 2]]],
			"with holes": [
				new Array(5),
				(() => {
					const a = new Array(5)
					a[3] = 3
					return a
				})(),
			],
			"with circular references": [
				(() => {
					const a: any[] = []
					a.push(a)
					return a
				})(),
			],
		},
		"objects/hashes": {
			"with attributes of primitive types (key + value)": [
				{
					k: undefined,
					23: null,
					[Symbol("key")]: "bar",
					x: 42,
				},
			],

			"with attributes of non-primitive types (key + value)": [
				{
					foo() {},
					0.2e3: {
						n: 42,
					},
				},
			],

			"with attributes of pure JSON": [
				{
					bar: "baz",
					foo: 42,
					gloups: ["gnokman", -0],
					misc: {
						thanks: "for the fish",
					},
				},
			],

			"with attributes = repeated references (NOT circular)": [
				(() => {
					const r: any = { foo: "42" }
					const obj: any = { bar: r, baz: r }
					return obj
				})(),
			],
		},
		/*
			, function (, {


						it("should work with attributes containing circular references", (, => {
							const obj: any = { foo: "42" }
							obj.bar = obj
							obj,
						},
					},

					it("should work with complex circular references -- array + hashes", (, => {
						const o: any = { circular: true }
						const a: any[] = ["circular"]
						o.a = a
						a.push(o,

						o,
					},
					it("should work with complex circular references -- cross", (, => {
						const o1: any = { id: 1 }
						const o2: any = { id: 2 }
						o1.ref = o2
						o2.ref = o1

						{ o1, o2 },
					},

					describe("other object", function (, {
						it("should work with objects -- base", (, => {
							{},
							new Object(,,
						},

						it("should work with objects -- no proto", (, => {
							Object.create(null,,
						},

						it("should work with objects -- this", (, => {
							this,
						},

						it("should work with objects -- known global", (, => {
							globalThis,
						},

						it("should work with common object types: function", (, => {
							(a: number, => {},
							function foo(a: number, {},
							Number,

							{ foo(a: number, {} }, // directly in an object
							{ bar: function foo(a: number, {} }, // indirectly in an object
							{ bar: (a: number, => {} }, // unnamed in an object
						},

						it("should work with common object types: Error", (, => {
							new Error("foo!",,
							new TypeError("foo!",,
						},

						it("should work with common object types: Set", (, => {
							const s0 = new Set(,
							s0,

							const s1 = new Set("foo",
							s1,

							const s2 = new Set([
								"foo",
								42,
								//42n,
								true,
								undefined,
								Symbol("foo",,
								null,
								{ X: 33 },
							],
							s2,

							const ws1 = new WeakSet([s0, s1],
							ws1,
						},

						it("should work with common object types: Map", (, => {
							new Map(,,
						},

						it("should work with common object types: primitive types in their object form", (, => {
							new String("string",,
							new Number(42,,
							new Boolean(true,,
						},

						it("should work with common object types: Date", (, => {
							const d1 = new Date(,
							d1,
						},

						it("should work with common object types: classes", (, => {
							class Greeter {
								greeting: string

								constructor(message: string, {
									this.greeting = message
								}

								greet(, {
									return "Hello, " + this.greeting
								}
							}

							let greeter = new Greeter("world",

							Greeter,
							greeter,
							function Foo(, {}
							Foo,
						},
					},
				},

				describe("special cases", function (, {
					it("should be able to handle deep objects", (, => {
						const deep_obj: any = {
							depth: 0,
						}
						const deep_arr: any = [0]
						const deep_mixed: any = [
							{
								depth: 0,
							},
						]

						let deep_obj_deepest: any = deep_obj
						let deep_arr_deepest: any = deep_arr
						let deep_mixed_deepest: any = deep_mixed

						for (let i = 1; i < 100; ++i, {
							deep_obj_deepest = deep_obj_deepest.sub = {
								depth: i,
							}

							deep_arr_deepest.push([i],
							deep_arr_deepest = deep_arr_deepest[1]
							deep_mixed_deepest = deep_mixed_deepest[0].sub = [
								{
									depth: i * 2,
								},
							]
						}

						deep_obj,
						deep_arr,
						deep_mixed,
					},
				},
			},

		 */
	},
} as const
