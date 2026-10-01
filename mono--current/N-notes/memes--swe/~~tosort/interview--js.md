[ ] questions https://h5bp.org/Front-end-Developer-Interview-Questions/questions/general-questions/
apply / call / bind
promises
super vs super() = super(...args) only in constructor https://devdocs.io/javascript/operators/super
maps vs objects: "associative array" https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#objects_vs._maps Map remembers the original insertion order of the keys. Any value (both objects and primitive values) may be used as either a key or a value.
var / const / let / hoisting = var = only fn scope + hoisting + redeclaration vs block scoped + no hoisting (TDZ, ReferenceError) + no redeclaration + no global
How does event propagation work on a dom? capture -> target -> bubble https://domevents.dev/
What is time and space complexity
strict / sloppy mode https://devdocs.io/javascript/strict_mode
closures https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function's scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time.
latest ES features -- ES2015 (aka. ES6) = let/const, arrow funcs, multline strings, default params, template literals, destructuring assignments, promises, classes, modules https://github.com/lukehoban/es6features
latest ES features -- ES2016 = ** exponentiation operator, array.includes() + misc
latest ES features -- ES2017 = async/await, Object.values, Object.entries, Object.getOwnPropertyDescriptors, padStart/padEnd, trailing commas, shared mem/buffers, regexp U
latest ES features -- ES2018 = Object rest/spread, promise finally, regexp unicode, async iterators
latest ES features -- ES2019 = proto, trimStartEnd, flat/flatMap
latest ES features -- ES2020 = globalThis, BigInt, optional chaining ?.
latest ES features -- ES2021 = Promise.any, WeakReferences, Logical assignments = ||= &&= ??=
latest ES features -- ES2022 = classes fields, static, private,  indexable.at, Object.hasOwn, Error.cause, Regexp Match Indices
latest ES features -- ES2023 = Array.findLast, findLastIndex, Change Array by copy = toReversed, toSorted, toSpliced, with
latest ES features -- ES2024 = Regexp "v" flag, ArrayBuffer transfer
latest ES features -- ES2025 = Set methods
latest ES features -- next = decorators, iterators helpers, more RegExp
How will you send 1000 requests from a single client to a single backend = browser limitation, need some control
if you use a console.log inside a timeout with 0 second how long would it take to print = "next event cycle" / node = minimum 1ms / browsers will enforce a minimum timeout of 4 milliseconds once a nested call to setTimeout has been scheduled 5 times. / minimum timeout of 1 second for inactive tabs / FF tracking protection // FF pageload https://developer.mozilla.org/en-US/docs/Web/API/setTimeout


scope
arguments
event loop / how setTimeout works
class
symbol
currying https://en.wikipedia.org/wiki/Currying
concurrency
barrel file
this https://devdocs.io/javascript/operators/this
was asked to write ajax call from scratch using Xmlhttprequest
arrow functions -> this
what is a JS promise, how to use it?
How would you allow for multiple promises to be processed at the same time? -> not use await
Describe a time you found and solved a performance problem.
AbortSignal
Meaning of ||=
size of an array after map.set function is used
Promise loops with arrays and what do they resolve to
code with Set and Map classes
find contiguous sub-array
Explain how/why [insert data structure] is efficient
What is the difference between [OOP concept A] and [OOP concept B]
Testing mainly on promises and increasing in difficult. Mainly related to api stuff
CAS instructions
non-blocking collections
What are the concurrent collections do you know
What's different between interface and class
How can we write multiple strings to a file while keeping them separated?
count each items in the array using new Map()
Fibonacci function
Make an analog clock
Make improvements to an existing text-based snake game
Render data to HTML according to spec.
async batch data processing from fake API, processing the response data.
Implement a linked list
Implement a snake game
Implement a timer
Javascript fundamentals, e.g. types of objects
interpret snippets of Javascript code and explain what it does given a certain input.
Technical questions involved simulations of real world problems, where you are expected to explain your solution including the time/memory demands of your algorithm. One technical question was web-focused and involved building a simple UI using HTML, CSS and Javascript. The behavioural component was all standard questions asking to recount an experience in different work situations, with lots of follow up questions about how you interpret your experience and what you learned. All the interviews after the screen heavily emphasised the ability to effectively communicate your thoughts to the interviewer, listen and respond quickly to additional requirements and feedback that the interviewer gives.
