import stylizeString from '@offirmo/cli-toolbox/string/stylize'
import boxify from '@offirmo/cli-toolbox/string/boxify'

import PKG_JSON from '../../package.json' with { type: 'json' }

console.log(boxify(`
import { TODO } from '${stylizeString.bold(PKG_JSON.name)}'

TODO
`.trim()))
