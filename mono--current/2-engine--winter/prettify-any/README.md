A **node** module to conveniently and clearly print any object in the console, for debug

## Introduction

For debug, we need to display a full representation of any object, cf.
https://stackoverflow.com/questions/10729276/how-can-i-get-the-full-object-in-node-jss-console-log-rather-than-object

When printing to the console (node.js), one has to use
[`util.inspect`](https://nodejs.org/api/util.html#utilinspectobject-options)

I wrote this lib while being unaware of `util.inspect` 🤦

However, I'm keeping it for extra features:

- ✅ ability to copy/paste back to normal code (as much as possible)
  - ✅ and thus overall more readable
- ✅ can help outline wrong JSON
- ✅ highlights "problem-ish" values = NaN, errors, -0, circular references…
- ✅ doesn't expand errors (not the same as error logging)
- ✴️ custom displays for own types

Missing features (worse than util.inspect)

- Promises
- exotic functions: async, gen
- regexps

## Usage

```ts
// "@monorepo-private/prettify-any": "*",

import
import {
	prettifyꓽany,
	prettifyꓽjson,
} from '@monorepo-private/prettify-any'

prettifyꓽjson(foo)
prettifyꓽjson(foo)

import { dumpꓽanyⵧprettified } from '@monorepo-private/prettify-any'

dumpꓽanyⵧprettified('hello', {foo})

```
