const { TextEncoder } = require('util')
const { inject_text_encoder } = require('@monorepo-private/murmurhash')
inject_text_encoder(TextEncoder)
