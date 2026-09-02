import assert from '@monorepo-private/assert/v1'
import { Immutable } from '@monorepo-private/state-utils'

import { ChatPrimitivesConsole } from '@monorepo-private/view--chat/primitives--terminal--vanilla'
import { create } from '@monorepo-private/view--chat'
import { HypermediaBrowserWithChatInterface } from './browser.js'
import { AppHateoasServer } from '../server.js'

/////////////////////////////////////////////////

const chat = create({
	DEBUG: false,
	gen_next_step: new HypermediaBrowserWithChatInterface(new AppHateoasServer()),
	primitives: new ChatPrimitivesConsole(),
})

console.log('/////////////////////////////////////////////////')
await chat.start()

/////////////////////////////////////////////////
